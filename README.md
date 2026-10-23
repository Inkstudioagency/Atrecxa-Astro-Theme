# Atrecxa: Architecture & Interior Design Astro Theme

Atrecxa is a modern theme for architecture studios, interior designers and design-build firms. It includes three home
page layouts, three about and services layouts, a project portfolio, a journal, and detail pages for every service,
project and article. Content comes from [Strapi](https://strapi.io) as a headless CMS.

**Live demo:** <https://atrecxa-astro.vercel.app>

## Tech stack

- **Astro 7**: static output, no UI framework, zero client-side routing
- **Strapi 5**: headless CMS for Services, Projects and Blogs (REST API, fetched at build time)
- **CSS**: the original stylesheets as plain global CSS (`src/styles/`), no preprocessor or utility framework
- **Interactions**: GSAP 3 timelines (scroll reveals, split-text titles, parallax, hover states), Lenis smooth scrolling,
  sliders, lightbox and dropdown menu, driven by the bundled interaction runtime in `public/js/`
- **SEO**: per-page titles and descriptions, Open Graph/Twitter cards, canonical URLs, `@astrojs/sitemap`

## Pages

| Route | Page |
|---|---|
| `/`, `/home-v2`, `/home-v3` | Home (three layouts) |
| `/about-us-v1`, `/about-us-v2`, `/about-us-v3` | About (three layouts) |
| `/services-v1`, `/services-v2`, `/services-v3` | Services (three layouts) |
| `/projects` | Project portfolio |
| `/blogs` | Journal |
| `/contact-us` | Contact |
| `/service/[slug]`, `/project/[slug]`, `/blog/[slug]` | CMS detail pages |
| `/style-guide`, `/404` | Style guide, Not found |

## Getting started

Requirements: Node.js 22.23+ (or 24), npm.

```bash
git clone https://github.com/Inkstudioagency/Atrecxa-Astro-Theme.git
cd Atrecxa-Astro-Theme
npm install
npm run dev                 # http://localhost:4321
```

That's all you need to preview the theme: when `STRAPI_URL` isn't set, the site builds from the bundled demo
content in `strapi/seed/` (the same entries and images the Strapi seeder imports). The live demo is deployed this way.
To manage the content in Strapi, follow the two steps below.

### 1. Start the CMS

```bash
cd strapi
cp .env.example .env        # replace every "tobemodified" value with a random secret
npm install
npm run develop             # admin panel: http://localhost:1337/admin
```

Create your admin account in the browser, then load the demo content (see [`strapi/README.md`](strapi/README.md)
for the token setup):

```bash
STRAPI_URL=http://localhost:1337 STRAPI_UPLOAD_TOKEN=<full-access API token> STRAPI_MCP_TOKEN=<admin token> npm run seed
```

### 2. Start the website

```bash
cp .env.example .env        # set STRAPI_URL and a read-only STRAPI_API_TOKEN
npm install
npm run dev                 # http://localhost:4321
```

### Commands

| Command | Action |
|---|---|
| `npm run dev` | Start the dev server at `localhost:4321` |
| `npm run build` | Build the static site to `dist/` (from Strapi when `STRAPI_URL` is set, otherwise from the demo content) |
| `npm run preview` | Preview the build locally |
| `npm run check` | Type-check the project |

## Environment variables

| Variable | Used for |
|---|---|
| `STRAPI_URL` | Base URL of your Strapi instance (build time only). Leave empty to use the bundled demo content |
| `STRAPI_API_TOKEN` | Read-only Strapi API token (build time only, never sent to the browser) |
| `SITE_URL` | Public URL of the site (canonical URLs, Open Graph, sitemap) |
| `PUBLIC_FORM_ENDPOINT` | URL that receives form submissions as JSON (Formspree, Web3Forms, Basin, a serverless function…) |

## Project structure

```text
├── public/
│   ├── fonts/            Switzer font files
│   ├── images/           Theme images (with responsive variants)
│   └── js/               Interaction runtime, GSAP, Lenis, jQuery (self-hosted)
├── src/
│   ├── assets/svg/       Large inline graphics (award logos)
│   ├── components/
│   │   ├── cards/        CMS cards (services, projects, blogs)
│   │   ├── global/       Header, Footer, SEO
│   │   ├── sections/     Sections shared by several pages (FAQ, testimonials, CTA…)
│   │   └── ui/           Buttons, contact form, arrow icon
│   ├── config/           site.ts (brand, social links), navigation.ts (menus), videos.ts (lightbox videos)
│   ├── layouts/          BaseLayout.astro
│   ├── lib/              Strapi client (strapi.ts), typed CMS queries and helpers (cms.ts)
│   ├── pages/            Routes
│   ├── scripts/          Smooth scrolling, counters, form submission
│   └── styles/           Global CSS
└── strapi/               Strapi 5 project (content types, seed data, seeder)
```

## Customization

- **Brand, social links, form endpoint:** `src/config/site.ts`
- **Header and footer menus:** `src/config/navigation.ts`
- **Lightbox videos:** `src/config/videos.ts`
- **Colors, typography, spacing:** CSS custom properties at the top of `src/styles/atrecxa.webflow.css`
- **Your own CSS:** `src/styles/custom.css` (loaded last)
- **Content:** edit Services, Projects and Blogs in the Strapi admin, then rebuild the site

See [THEME-CUSTOMIZATION.md](THEME-CUSTOMIZATION.md) for the full guide (CMS fields, list ordering, forms,
deployment, rebuild webhooks and the Strapi MCP server).

## Deployment

The site is fully static. On Vercel or Netlify, import the repository (the Astro preset is detected automatically:
`npm run build`, output `dist`) and set the environment variables above. Without `STRAPI_URL` it deploys with the
demo content; with it, Strapi must be reachable from the build. Add a Strapi webhook (*Settings → Webhooks*) that
calls your host's deploy hook on publish, so content changes trigger a rebuild.

## Credits & license

- Design: [ink Studio](https://webflow.com/templates/designers/inksstudio-llc)
- Fonts: Switzer (Indian Type Foundry, free license via Fontshare), Aboreto and Inter Tight (Google Fonts, OFL)
- Libraries: [GSAP](https://gsap.com) (free standard license), [Lenis](https://lenis.darkroom.engineering) (MIT),
  jQuery (MIT)
- Demo video: [Cliff House Time-lapse Recut](https://commons.wikimedia.org/wiki/File:Cliff_House_Time-lapse_Recut.webm)
  by AltiusArchitecture, [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/), via Wikimedia Commons

Code released under the [MIT License](LICENSE).
