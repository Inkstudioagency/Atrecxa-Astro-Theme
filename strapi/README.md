# Atrecxa CMS (Strapi 5)

Headless CMS for the Atrecxa Astro theme. It stores **Services**, **Projects** and **Blogs**.

```bash
cp .env.example .env     # replace every "tobemodified" value with a random secret
npm install
npm run develop          # admin panel: http://localhost:1337/admin
```

On npm 11+, the native/postinstall scripts this project needs (`better-sqlite3`, `esbuild`, `@swc/core`, `core-js-pure`)
are pre-approved in `package.json` → `allowScripts`.

## What's inside

| Path | Contents |
|---|---|
| `src/api/service`, `src/api/project`, `src/api/blog` | Content types (`schema.json`) with default REST controllers, routes and services |
| `src/components/shared` | `seo` (meta title/description), `stat` (value + label), `text-item` (a line of text) |
| `config/server.ts` | Enables the Strapi MCP server (`mcp.enabled`, endpoint `/mcp`) |
| `config/plugins.ts` | Upload breakpoints (500/800/1080/1600/2000 px) used for the site's responsive images |
| `seed/data.json`, `seed/media/` | Demo content and images |
| `scripts/seed.mjs` | Idempotent seeder: uploads media (Upload API), then creates and publishes entries through the MCP server |

## Content model

| Type | Fields |
|---|---|
| **Service** | title, slug, position (display order), shortDescription, intro, image, stats (max 3), featureImages, overview, gallery, overviewSecondary, included (max 5), seo |
| **Project** | title, slug, position (display order), order, tagline, image, propertyType, location, architectureStyle, completed, interiorSpace, propertyValue, expertImage, overview, gallery, overviewSecondary, seo |
| **Blog** | title, slug, order (highest first), date, category, readTime, excerpt, image, body, gallery, bodySecondary, seo |

Rich-text fields (`overview`, `body`, …) are Markdown. An image on its own line is rendered as a full-width figure.
Alt text comes from each media file's **Alternative text** in the Media Library.

## Seeding the demo content

1. In the admin panel, create a **Full access** API token (*Settings → API Tokens → Create new API Token*).
2. Create an **Admin token** (*Settings → Administration Panel → Admin Tokens → Create new Admin Token*) with
   Content Manager **Read, Create, Update and Publish** on Service, Project and Blog, plus Media Library **Read**.
   The MCP server only exposes the tools this token is allowed to use.
3. Run (with Strapi running):

```bash
STRAPI_URL=http://localhost:1337 STRAPI_UPLOAD_TOKEN=<full-access token> STRAPI_MCP_TOKEN=<admin token> npm run seed
```

Add `--dry-run` to preview the changes without writing anything. Re-running updates entries in place (matched by slug).

## Strapi MCP server

The MCP server is enabled in `config/server.ts` and listens at `http://localhost:1337/mcp` (Streamable HTTP, POST only,
`Authorization: Bearer <admin token>`). Connect an AI client to manage content, for example Claude Code:

```bash
claude mcp add strapi-mcp --transport http http://localhost:1337/mcp -H "Authorization: Bearer YOUR_ADMIN_TOKEN"
```

It provides `list_*`, `get_*`, `create_*`, `update_*`, `publish_*` (and more, depending on the token's permissions) for
`service`, `project` and `blog`, plus Media Library tools. It can't change content types or upload files, which is why
schemas live in `src/` and the seeder uploads media through the REST Upload API. Docs:
<https://docs.strapi.io/cms/features/strapi-mcp-server>

## Tokens used by the website

The Astro site only needs a **Read-only** API token (`STRAPI_API_TOKEN` in the theme's `.env`).

See the theme's main `README.md` for the full setup and deployment.
