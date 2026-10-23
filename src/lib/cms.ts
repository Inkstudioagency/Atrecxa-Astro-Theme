// Typed access to the three Strapi collections (Services, Projects, Blogs) plus render helpers.
// Every getter is memoised, so a static build fetches each collection once.
// Without STRAPI_URL the getters return the bundled demo content (./demo-content.ts) instead.
import { marked } from 'marked';
import { getAll, isStrapiConfigured, strapiAssetUrl } from './strapi';
import { demoEntries } from './demo-content';

export interface StrapiMediaFormat {
  url: string;
  width: number;
  height: number;
}

export interface StrapiMedia {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number | null;
  height: number | null;
  formats?: Record<string, StrapiMediaFormat> | null;
}

/** shared.seo component */
export interface Seo {
  metaTitle: string | null;
  metaDescription: string | null;
}

/** shared.stat component */
export interface Stat {
  value: string;
  label: string;
}

/** shared.text-item component */
export interface TextItem {
  text: string;
}

interface Entry {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  image: StrapiMedia | null;
  seo: Seo | null;
}

export interface Service extends Entry {
  /** Manual display order (1 = first). */
  position: number;
  shortDescription: string | null;
  intro: string | null;
  stats: Stat[];
  featureImages: StrapiMedia[] | null;
  overview: string | null;
  overviewSecondary: string | null;
  gallery: StrapiMedia[] | null;
  included: TextItem[];
}

export interface Project extends Entry {
  /** Manual display order (1 = first). */
  position: number;
  order: number;
  tagline: string | null;
  propertyType: string | null;
  location: string | null;
  architectureStyle: string | null;
  completed: string | null;
  interiorSpace: string | null;
  propertyValue: string | null;
  expertImage: StrapiMedia | null;
  overview: string | null;
  overviewSecondary: string | null;
  gallery: StrapiMedia[] | null;
}

export interface Blog extends Entry {
  /** Display order: the highest number is listed first. */
  order: number;
  date: string;
  category: string | null;
  readTime: string | null;
  excerpt: string | null;
  body: string | null;
  bodySecondary: string | null;
  gallery: StrapiMedia[] | null;
}

const memo = new Map<string, Promise<unknown>>();
function cached<T>(key: string, load: () => Promise<T>): Promise<T> {
  if (!memo.has(key)) memo.set(key, load());
  return memo.get(key) as Promise<T>;
}

/** Services in their manual display order. */
export const getServices = () =>
  cached('services', async () =>
    isStrapiConfigured
      ? getAll<Service>('services', { populate: '*', sort: 'position:asc' })
      : demoEntries<Service>('services'),
  );

/** Projects in their manual display order. */
export const getProjects = () =>
  cached('projects', async () =>
    isStrapiConfigured
      ? getAll<Project>('projects', { populate: '*', sort: 'position:asc' })
      : demoEntries<Project>('projects'),
  );

/** Blog posts, highest `order` first (the template's default listing order). */
export const getBlogs = () =>
  cached('blogs', async () =>
    isStrapiConfigured ? getAll<Blog>('blogs', { populate: '*', sort: 'order:desc' }) : demoEntries<Blog>('blogs'),
  );

/** A copy of the entries sorted by their `order` field, lowest first (used by a few listings in the template). */
export function byOrderAsc<T extends { order: number }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => a.order - b.order);
}

/** Entries other than `current`, for "related" listings on detail pages. */
export function except<T extends { slug: string }>(entries: T[], current: T): T[] {
  return entries.filter((entry) => entry.slug !== current.slug);
}

// ---------- Media ----------

/** Absolute URL of a Strapi media file (undefined when the field is empty). */
export function mediaSrc(media: StrapiMedia | null | undefined): string | undefined {
  return media?.url ? strapiAssetUrl(media.url) : undefined;
}

/** `srcset` from the responsive formats Strapi generated (see strapi/config/plugins.ts → breakpoints) plus the original. */
export function mediaSrcset(media: StrapiMedia | null | undefined): string | undefined {
  if (!media?.url) return undefined;
  const candidates = Object.values(media.formats ?? {})
    .filter((f) => f?.url && f.width)
    .map((f) => ({ url: f.url, width: f.width }));
  if (media.width) candidates.push({ url: media.url, width: media.width });
  if (candidates.length < 2) return undefined;
  return candidates
    .sort((a, b) => a.width - b.width)
    .map((c) => `${strapiAssetUrl(c.url)} ${c.width}w`)
    .join(', ');
}

/** Alt text stored on the media file in Strapi. */
export function mediaAlt(media: StrapiMedia | null | undefined): string {
  return media?.alternativeText ?? '';
}

// ---------- Formatting ----------

/** "April 11, 2025" (the format the template uses). Dates are calendar dates (YYYY-MM-DD). */
export function formatDate(date: string | null | undefined): string {
  if (!date) return '';
  return new Date(`${date.slice(0, 10)}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/**
 * Renders a Strapi rich-text (Markdown) field to HTML for a `.w-richtext` block.
 * Images on their own line become Webflow's full-width rich-text figures, so the original CSS applies unchanged,
 * and relative upload URLs are made absolute.
 */
export function richText(markdown: string | null | undefined): string {
  if (!markdown) return '';
  const html = marked.parse(markdown, { async: false, gfm: true }) as string;
  return html
    .replace(/<p>\s*<img ([^>]*?)\s*\/?>\s*<\/p>/g, (_m, attrs: string) => {
      const src = /src="([^"]*)"/.exec(attrs)?.[1] ?? '';
      const alt = /alt="([^"]*)"/.exec(attrs)?.[1] ?? '';
      return (
        '<figure class="w-richtext-figure-type-image w-richtext-align-fullwidth" data-rt-type="image" data-rt-align="fullwidth">' +
        `<div><img alt="${alt}" src="${src}" loading="lazy"></div></figure>`
      );
    })
    .replace(/(src|href)="(\/uploads\/[^"]*)"/g, (_m, attr: string, url: string) => `${attr}="${strapiAssetUrl(url)}"`)
    .replace(/>\s*\n\s*</g, '><');
}
