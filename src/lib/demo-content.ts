// Demo content used when no Strapi instance is configured (STRAPI_URL empty).
// It reads the same dataset that seeds Strapi (strapi/seed/data.json) and returns entries in Strapi's REST response
// shape, so every page and card works unchanged. Images are served from /demo-media/ (copied from strapi/seed/media
// by the demo-media integration in astro.config.mjs). Set STRAPI_URL to use your own CMS instead.
import seed from '../../strapi/seed/data.json';

type SeedMedia = { file: string; alt?: string };
type Collection = 'services' | 'projects' | 'blogs';

let nextId = 1;

function media(m: SeedMedia) {
  return { id: nextId++, url: `/demo-media/${m.file}`, alternativeText: m.alt ?? '', width: null, height: null, formats: null };
}

/** Replace seed media refs with Strapi-like media objects, and `media:<file>` image URLs in Markdown. */
function convert(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(convert);
  if (value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    if (typeof obj.file === 'string' && Object.keys(obj).every((k) => k === 'file' || k === 'alt')) return media(obj as SeedMedia);
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, convert(v)]));
  }
  if (typeof value === 'string' && value.includes('](media:')) return value.replace(/\]\(media:/g, '](/demo-media/');
  return value;
}

const SORT: Record<Collection, (a: Record<string, number>, b: Record<string, number>) => number> = {
  services: (a, b) => a.position - b.position,
  projects: (a, b) => a.position - b.position,
  blogs: (a, b) => b.order - a.order,
};

/** All demo entries of a collection, in the same order the Strapi queries in cms.ts use. */
export function demoEntries<T>(collection: Collection): T[] {
  const entries = (seed[collection] as unknown[]).map((entry, i) => ({
    id: i + 1,
    documentId: `demo-${collection}-${i + 1}`,
    ...(convert(entry) as Record<string, unknown>),
  }));
  return (entries as unknown as Record<string, number>[]).sort(SORT[collection]) as unknown as T[];
}
