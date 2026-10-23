# Atrecxa Customization Guide

## 1. Brand and global settings

`src/config/site.ts`

| Setting | Purpose |
|---|---|
| `name` | Brand name (footer copyright, Open Graph site name) |
| `defaultTitle`, `defaultDescription` | SEO fallbacks (also the home page title and description) |
| `ogImage` | Default social sharing image (`public/images/…`) |
| `social` | Footer social links (Facebook, Instagram, LinkedIn, Twitter/X) |
| `designer` | Footer credit |
| `formEndpoint` | Read from `PUBLIC_FORM_ENDPOINT` |

**Logos:** the header logo is `public/images/Frame-265.webp` (light header) and `public/images/Group-320-1.webp` (dark
header); the large footer wordmark is `public/images/Vector-5.webp`. Replace the files (same names) or change the paths
in `src/components/global/Header.astro` and `Footer.astro`. Favicons live in `public/images/favicon*.png` and
`webclip*.png`.

## 2. Navigation

`src/config/navigation.ts` holds every menu:

- `headerLinks`: header bar links (also repeated in the tablet/mobile menu)
- `headerMenuExtra`: extra links shown only in the right-hand menu
- `dropdownGroups`, `dropdownUtilityLinks`: the "Pages" dropdown
- `headerCta`: the "Get in touch" button
- `footerColumns`: footer link columns

The current page is highlighted automatically (`w--current` + `aria-current="page"`).

## 3. Colors, typography and spacing

The design tokens are CSS custom properties at the top of `src/styles/atrecxa.webflow.css` (colors, font families,
sizes, spacing, radii). Change a variable there to restyle the whole site. Add your own rules to
`src/styles/custom.css`, which is loaded last. Keep the existing class names: the animations target them.

Fonts: Aboreto and Inter Tight load from Google Fonts in `src/layouts/BaseLayout.astro`; Switzer is self-hosted in
`public/fonts/` and declared with `@font-face` in `atrecxa.webflow.css`.

## 4. Content (Strapi)

| Collection | Listed on | Detail page |
|---|---|---|
| Services | `/`, `/home-v2`, `/home-v3`, `/services-v1..v3` | `/service/[slug]` |
| Projects | `/`, `/home-v2`, `/home-v3`, `/projects` | `/project/[slug]` |
| Blogs | `/`, `/home-v2`, `/home-v3`, `/about-us-v1..v3`, `/blogs` | `/blog/[slug]` |

**Ordering.** Services and Projects are listed by `position` (1 = first), which reproduces the template's hand-picked
order. Blogs are listed by `order`, highest first. A few listings intentionally use `order` ascending (the Blogs page
featured post, the V3 "Latest Articles" side posts and two rows of the Projects page). The exact queries are at the top
of each page and section file, e.g. `projects.slice(1, 3)` = the 2nd and 3rd project.

**Fixed slots.** Several layouts show a fixed number of items (for example the home page project mosaic shows four
projects in four differently sized frames). Add as many entries as you like; each slot shows the entry at its position.

**Images.** Upload images in the Media Library and fill in the **Alternative text**: it becomes the `alt` attribute.
Strapi generates 500/800/1080/1600/2000 px versions for responsive `srcset`s.

**Rich text** (`overview`, `body`, …) is Markdown: `## Heading`, `### Subheading`, paragraphs, `- lists`. Put an image on
its own line to show it as a full-width figure.

**Demo content.** With no `STRAPI_URL`, the site is built from `strapi/seed/data.json` and the images in
`strapi/seed/media/` (`src/lib/demo-content.ts`). Once your CMS is set up, set `STRAPI_URL` and `STRAPI_API_TOKEN`.

**Publishing.** The site is static: after editing content, rebuild it. Automate this with a Strapi webhook
(*Settings → Webhooks*, events "Entry publish/unpublish/update") pointing at your host's deploy hook URL
(Vercel: *Project → Settings → Git → Deploy Hooks*; Netlify: *Build hooks*).

**Strapi MCP server.** `strapi/config/server.ts` enables Strapi's MCP server at `/mcp`, so AI assistants can list,
create, update and publish entries using an Admin token. See `strapi/README.md`.

## 5. Static page content

Text and images that aren't CMS-driven (heroes, about sections, testimonials, FAQs, CTAs) are plain markup in
`src/pages/*.astro` and, for sections shared by several pages, `src/components/sections/*.astro`:

| Section component | Used on |
|---|---|
| `TestimonialsV1`, `FaqV1`, `LatestArticlesV1` | Home V1, About V1 (+ Services V1, Contact) |
| `TestimonialsV2`, `FaqV2`, `CtaV2` | Home V2, About V2, Services V2 |
| `TestimonialsV3`, `FaqV3`, `CtaV3`, `LatestArticlesV3` | Home V3, About V3, Services V3 |
| `ContactCta` | Home V1, About V1, Services V1, Projects, Style Guide, all detail pages |

Lightbox videos ("play" buttons) are configured in `src/config/videos.ts`.

## 6. Forms

Every enquiry form posts JSON to `PUBLIC_FORM_ENDPOINT` (set it in `.env` / your host, then rebuild):

```json
{ "form": "Email Form", "page": "/contact-us", "name": "…", "Email": "…", "Phone": "…", "Message": "…" }
```

Works with Formspree, Web3Forms (add your access key as a hidden input in `src/components/ui/ContactForm.astro`),
Basin, Getform or your own serverless function. A 2xx response shows the success message; anything else (or no
endpoint configured) shows the error message. A hidden honeypot field filters basic spam bots.

## 7. Animations and interactions

Scroll reveals (`to-top-*` attributes), split-text titles (`title-animation`), image parallax (`parallax`), button
hovers, FAQ accordions, sliders, the lightbox, the dropdown and the mobile menu are driven by the interaction runtime
in `public/js/webflow/` (one shared chunk plus one file per page, mapped in `src/lib/webflow-runtime.ts`), with GSAP,
ScrollTrigger, SplitText and Lenis from `public/js/`.

- Keep each page's `wfPage` id in `BaseLayout`: it selects that page's animation timelines.
- To create a new page with the same animations, copy an existing page (keep its `wfPage`) and edit the content.
- To remove an animation from an element, delete its `to-top-*` / `title-animation` / `parallax` attribute.
- Smooth scrolling and the number counters (`data-counter`) are in `src/scripts/site.ts`.
- There is no client-side routing, so every navigation is a full page load (this keeps the animations predictable).

## 8. SEO

Each page sets its title and description through `BaseLayout` props; CMS detail pages use the entry's **SEO**
component (meta title/description) and main image. `SITE_URL` drives canonical URLs, Open Graph URLs and
`sitemap-index.xml`. The 404 page is `noindex`.

## 9. Deployment

1. Deploy Strapi (Strapi Cloud, Railway, Render, a VPS…). For production use PostgreSQL or MySQL
   (`DATABASE_CLIENT` in `strapi/.env`) and a cloud upload provider, then seed or enter your content.
2. Create a **Read-only** API token in Strapi.
3. Deploy the site (Vercel, Netlify, Cloudflare Pages…): build command `npm run build`, output `dist`, environment
   variables `STRAPI_URL`, `STRAPI_API_TOKEN`, `SITE_URL`, `PUBLIC_FORM_ENDPOINT`.
4. Add the Strapi → deploy-hook webhook from section 4.
