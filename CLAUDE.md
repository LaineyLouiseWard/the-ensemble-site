# The Ensemble Edit — Project Guide

## Project Overview

PhD student-led blog called **"The Ensemble Edit"**, built with Astro (Saral theme base). Publishes Markdown articles with multiple authors, track categories, and interactive features.

Tagline: _Where disciplines converge and ideas diverge_

## Commands

- `yarn dev` — Start dev server
- `yarn build` — Production build (includes `astro check`)
- `yarn preview` — Preview production build

## Architecture

### Stack

- **Astro 5** with `@astrojs/vercel` adapter (`output: 'static'`, single serverless endpoint)
- **Tailwind CSS v4** with `@theme` tokens, `@custom-variant`, `@plugin`
- **EB Garamond** as both `--font-sans` and `--font-display` (unified serif)
- **JetBrains Mono** for code blocks

### Key Files

- `astro.config.mjs` — Astro config with Vercel adapter
- `src/consts.ts` — Site title, description, tracks, nav links
- `src/content/config.ts` — Content collection schemas (blog + authors)
- `src/layouts/BaseLayout.astro` — Main layout shell (Navbar, Footer, theme)
- `src/layouts/BlogPostLayout.astro` — Blog post layout (TOC, reading time, authors, Giscus comments)
- `src/styles/global.css` — Tailwind CSS + custslom theme variables
- `src/pages/index.astro` — Homepage with parallax hero
- `src/pages/api/ensemble.ts` — Serverless endpoint for GitHub Discussion reactions
- `src/components/ParallaxHero.astro` — 5-layer pixel-art parallax with JS-driven drift
- `src/components/Footer.astro` — Footer with live UCD weather icon + text
- `src/components/CommentsGiscus.astro` — Giscus comment embed
- `src/components/EnsembleResponse.astro` — Live converge/diverge reaction display

### Content

Blog posts in `src/content/blog/<slug>.md`. Schema: `title`, `description`, `pubDate`, `updatedDate`, `coverImageCredit`, `featured`, `authors` (array of author IDs), `track`, `tags`. The `authors` array must contain IDs that match filenames in `src/content/authors/` (e.g. `['jane']` requires `jane.json`).

**Naming convention:** The filename slug must be consistent across three places:
1. `src/content/blog/<slug>.md` — the article file
2. `src/assets/blogimages/<slug>/cover.{jpg,png}` — the cover image directory and file
3. The slug is derived from the article title in kebab-case (e.g. `claude-code-new-skill-alert`)

Cover images are resolved automatically by slug — always name them `cover.jpg` or `cover.png` inside the matching directory. If both exist, `.jpg` takes precedence.

**Featured pinning:** Add `featured: true` to a post's frontmatter to pin it to the Featured section on the homepage. Posts without this field default to `false` and appear in Latest. The homepage renders featured posts in date-descending order (newest = left).

Authors in `src/content/authors/<id>.json`. Schema: `name`, `role`, `affiliation`, `avatar`, `bio`, `linkedin`, `orcid`, `github`, `website`, `links`.

### Avatar Model

Pre-made pixel-art avatars live in `design-assets/avatars/` (Set1_001–052, Set2_001–051). Contributors **must select an existing avatar** from this folder — do not create, upload, or generate new avatar images without maintainer approval. The chosen file is copied to `public/avatars/<author-id>.png` and referenced in the author JSON as `"/avatars/<author-id>.png"`.

### Contributor Workflow

All content changes follow: **branch → PR → maintainer review → merge to `main` → auto-deploy**. No changes reach the live site without a reviewed and merged pull request. See `CONTRIBUTING.md` for the quickstart and `docs/` for detailed guides (author profiles, writing articles, calendar events).

### Routing

- Static pages pre-rendered at build
- Dynamic routes: `blog/[...slug]`, `authors/[slug]`, `tracks/[track]`
- Single serverless route: `/api/ensemble` (Vercel function, `prerender = false`)

### Tracks

Defined in `src/consts.ts`: PhD Tips, Events, Discussion, Research.

### Parallax Hero

5 layers split into 3 stacking wrappers for z-index isolation:

- Sky (z-auto) → cloud (z-50, pointer-events:none) → ground (z-55, pointer-events:none)
- All horizontal drift is JS-driven via rAF using computed tile width: `heroHeight * (576/324)`
- Each layer has `data-drift-dur`, `data-drift-dir`, `data-drift-x` attributes

### Agenda System Architecture

`src/pages/agenda.astro` — calendar + event list page. All calendar grid content (buttons, day-numbers, icons, dots) is created dynamically via `<script is:inline>`, so CSS for these elements must use `:global()` to bypass Astro scoping.

**Icon rendering:** Each event type maps to a pixel-art PNG in `public/icons/calendar/<type>.png`. Icons appear behind the day number (`z-index: 0` vs `1`) only when a specific type filter is active — never on the default "Upcoming" view. The `TYPE_ICONS` and `TYPE_COLORS` objects in the inline script centralise all type-to-icon and type-to-colour mappings.

**Type-to-colour system:** `TYPE_COLORS` defines one colour per type, used consistently for: filter button active state (`--btn-color`), RHS accent line (inline `backgroundColor`), and event dots. Adding a new type requires updating `TYPE_COLORS`, `TYPE_ICONS`, and the `EVENT_TYPES` array in the frontmatter script.

**Date handling:** Event dates use `z.coerce.date()` in the content schema, which accepts formats like `'Mar 10 2026'`. The JS converts all dates to local `Date` objects. Multi-day events mark every day in the range via `getTypesForDate()`.

**External links:** Event links open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`). No inline iframe embedding is used — external sites block iframes via `X-Frame-Options` / CSP headers.

**Calendar bounds:** Navigation is clamped to a minimum date (currently March 2026) via `MIN_YEAR`/`MIN_MONTH` constants. The dropdown and prev-arrow respect this floor.

### Weather System

Footer fetches Open-Meteo API (UCD coords 53.308, -6.223) client-side. Single fetch updates:

- Footer weather icon (`/icons/weather/*.png`)
- Favicon
- Weather text line (oktas, temp, pressure, wind cardinal)
- Cached in sessionStorage for 60 minutes

### Giscus Comments

- Repo: `LaineyLouiseWard/the-ensemble-site`
- Mapping: pathname
- Category: Comments
- Script uses `is:inline` to prevent Astro stripping

### Page View Counter

`GET /api/views?slug=<slug>` — increments and returns view count for a blog post. Storage is pluggable via `src/lib/views-store.ts` (Upstash Redis). Falls back to returning 0 when no storage is configured. `ViewCount.astro` fetches client-side and renders in the blog post meta row beside reading time. Bot user-agents are skipped.

### Environment Variables

- `GITHUB_TOKEN` — Fine-grained PAT with read-only Discussions access (for `/api/ensemble`)
- `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis for page view counts (optional)

## Design Direction

- Clean, minimal editorial typography (EB Garamond)
- Homepage parallax hero banner with pixel-art layers
- Prioritize readability
- Dark/light/auto theme support
- Consistent `pt-36` title positioning across pages
