#!/usr/bin/env node
/**
 * Seeds the demo content (4 services, 9 projects, 10 blog posts) into Strapi.
 *
 *  - Media files (seed/media) are uploaded with the Upload REST API, because the Strapi MCP server
 *    can reference existing assets but cannot upload new ones.
 *  - Entries are created, updated and published through the Strapi MCP server (/mcp),
 *    using the per-content-type tools it generates (list_*, create_*, update_*, publish_*).
 *
 * Idempotent: media is matched by file name and entries by slug, so re-running updates in place.
 *
 * Usage (from the strapi/ folder, with Strapi running):
 *   STRAPI_URL=http://localhost:1337 \
 *   STRAPI_UPLOAD_TOKEN=<full-access API token> \
 *   STRAPI_MCP_TOKEN=<admin token with Content Manager permissions> \
 *   node scripts/seed.mjs [--dry-run]
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const SEED_DIR = path.join(ROOT, 'seed');
const STRAPI_URL = (process.env.STRAPI_URL || 'http://localhost:1337').replace(/\/$/, '');
const UPLOAD_TOKEN = process.env.STRAPI_UPLOAD_TOKEN;
const MCP_TOKEN = process.env.STRAPI_MCP_TOKEN;
const DRY_RUN = process.argv.includes('--dry-run');

if (!DRY_RUN && (!UPLOAD_TOKEN || !MCP_TOKEN)) {
  console.error('Set STRAPI_UPLOAD_TOKEN (full-access API token) and STRAPI_MCP_TOKEN (admin token). See README → CMS setup.');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(path.join(SEED_DIR, 'data.json'), 'utf8'));

// ---------------------------------------------------------------- MCP client (Streamable HTTP)
let rpcId = 0;
async function mcp(method, params = {}) {
  const res = await fetch(`${STRAPI_URL}/mcp`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${MCP_TOKEN}`,
      'Content-Type': 'application/json',
      Accept: 'application/json, text/event-stream',
    },
    body: JSON.stringify({ jsonrpc: '2.0', id: ++rpcId, method, params }),
  });
  if (!res.ok) throw new Error(`MCP ${method} → HTTP ${res.status}: ${await res.text()}`);
  const text = await res.text();
  // Responses arrive as server-sent events ("data: {...}") or plain JSON.
  const payload = text.includes('data:')
    ? text.split('\n').filter((l) => l.startsWith('data:')).map((l) => JSON.parse(l.slice(5))).find((m) => m.id === rpcId)
    : JSON.parse(text);
  if (payload?.error) throw new Error(`MCP ${method}: ${payload.error.message}`);
  return payload.result;
}

async function tool(name, args) {
  const result = await mcp('tools/call', { name, arguments: args });
  if (result.isError) throw new Error(`${name}: ${result.content?.map((c) => c.text).join(' ')}`);
  if (result.structuredContent) return result.structuredContent;
  const text = result.content?.find((c) => c.type === 'text')?.text;
  try { return JSON.parse(text); } catch { return text; }
}

// ---------------------------------------------------------------- Media (Upload REST API)
const uploaded = new Map(); // file name → { id, url }

async function findUpload(name) {
  const url = new URL('/api/upload/files', STRAPI_URL);
  url.searchParams.set('filters[name][$eq]', name);
  const res = await fetch(url, { headers: { Authorization: `Bearer ${UPLOAD_TOKEN}` } });
  if (!res.ok) throw new Error(`Upload lookup failed (${res.status}): ${await res.text()}`);
  const files = await res.json();
  return files[0];
}

async function upload(file, alt) {
  if (uploaded.has(file)) return uploaded.get(file);
  if (DRY_RUN) { const fake = { id: 0, url: `/uploads/${file}` }; uploaded.set(file, fake); return fake; }
  let asset = await findUpload(file);
  if (!asset) {
    const form = new FormData();
    const buffer = fs.readFileSync(path.join(SEED_DIR, 'media', file));
    const type = file.endsWith('.png') ? 'image/png' : file.endsWith('.jpg') ? 'image/jpeg' : 'image/webp';
    form.append('files', new Blob([buffer], { type }), file);
    form.append('fileInfo', JSON.stringify({ name: file, alternativeText: alt || '' }));
    const res = await fetch(`${STRAPI_URL}/api/upload`, { method: 'POST', headers: { Authorization: `Bearer ${UPLOAD_TOKEN}` }, body: form });
    if (!res.ok) throw new Error(`Upload of ${file} failed (${res.status}): ${await res.text()}`);
    [asset] = await res.json();
    console.log(`  ↑ uploaded ${file}`);
  }
  const ref = { id: asset.id, url: asset.url };
  uploaded.set(file, ref);
  return ref;
}

/** Replace { file, alt } media refs with uploaded asset ids, and "media:<file>" image URLs inside Markdown rich text. */
async function resolveMedia(value) {
  if (Array.isArray(value)) return Promise.all(value.map(resolveMedia));
  if (value && typeof value === 'object') {
    if (typeof value.file === 'string' && Object.keys(value).every((k) => k === 'file' || k === 'alt')) {
      return (await upload(value.file, value.alt)).id;
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      if (v === null || v === undefined || v === '') continue;
      out[k] = await resolveMedia(v);
    }
    return out;
  }
  if (typeof value === 'string' && value.includes('](media:')) {
    let markdown = value;
    for (const [, alt, file] of value.matchAll(/!\[([^\]]*)\]\(media:([^)\s]+)\)/g)) {
      const asset = await upload(file, alt);
      markdown = markdown.split(`media:${file}`).join(asset.url);
    }
    return markdown;
  }
  return value;
}

// ---------------------------------------------------------------- Entries (MCP)
async function seedCollection(type, entries) {
  console.log(`\n${type}: ${entries.length} entries`);
  const existing = DRY_RUN ? [] : (await tool(`list_${type}`, { pageSize: 100 }))?.results ?? [];
  const bySlug = new Map((existing || []).map((e) => [e.slug, e.documentId]));
  for (const entry of entries) {
    const payload = await resolveMedia(entry);
    if (DRY_RUN) { console.log(`  · would upsert ${entry.slug}`); continue; }
    let documentId = bySlug.get(entry.slug);
    if (documentId) {
      await tool(`update_${type}`, { documentId, data: payload });
      console.log(`  ✎ updated ${entry.slug}`);
    } else {
      const created = await tool(`create_${type}`, { data: payload });
      documentId = created?.documentId ?? created?.data?.documentId ?? created?.result?.documentId;
      if (!documentId) throw new Error(`create_${type} returned no documentId: ${JSON.stringify(created).slice(0, 300)}`);
      console.log(`  + created ${entry.slug}`);
    }
    await tool(`publish_${type}`, { documentId });
  }
}

const init = DRY_RUN ? null : await mcp('initialize', {
  protocolVersion: '2025-06-18',
  capabilities: {},
  clientInfo: { name: 'atrecxa-seed', version: '1.0.0' },
});
if (init) console.log(`Connected to ${init.serverInfo?.name} at ${STRAPI_URL}/mcp`);

await seedCollection('service', data.services);
await seedCollection('project', data.projects);
await seedCollection('blog', data.blogs);

// ---------------------------------------------------------------- Verify counts (public REST API)
if (!DRY_RUN) {
  console.log('\nVerification (published entries via REST):');
  for (const [plural, expected] of [['services', data.services.length], ['projects', data.projects.length], ['blogs', data.blogs.length]]) {
    const res = await fetch(`${STRAPI_URL}/api/${plural}?pagination[pageSize]=1`, { headers: { Authorization: `Bearer ${UPLOAD_TOKEN}` } });
    const total = (await res.json())?.meta?.pagination?.total;
    console.log(`  ${plural}: ${total}/${expected} ${total === expected ? '✓' : '✗'}`);
  }
}
console.log('\nDone.');
