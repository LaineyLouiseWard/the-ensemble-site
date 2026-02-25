# The Ensemble Edit — Project Guide

## Project Overview

PhD student-led blog called **"The Ensemble Edit"**, built with Astro (Saral theme base). Publishes Markdown articles with multiple authors, track categories, and interactive features.

Tagline: *Where disciplines converge and ideas diverge*

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
- `src/styles/global.css` — Tailwind CSS + custom theme variables
- `src/pages/index.astro` — Homepage with parallax hero
- `src/pages/api/ensemble.ts` — Serverless endpoint for GitHub Discussion reactions
- `src/components/ParallaxHero.astro` — 5-layer pixel-art parallax with JS-driven drift
- `src/components/Footer.astro` — Footer with live UCD weather icon + text
- `src/components/CommentsGiscus.astro` — Giscus comment embed
- `src/components/EnsembleResponse.astro` — Live converge/diverge reaction display

### Content

Blog posts in `src/content/blog/`. Schema: `title`, `description`, `pubDate`, `updatedDate`, `coverImageCredit`, `authors` (array of author IDs), `track`, `tags`.

Authors in `src/content/authors/` as JSON. Schema: `name`, `role`, `affiliation`, `avatar`, `bio`, `links`.

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

### Weather System

Footer fetches Open-Meteo API (UCD coords 53.308, -6.223) client-side. Single fetch updates:
- Footer weather icon (`/icons/*.png`)
- Favicon
- Weather text line (oktas, temp, pressure, wind cardinal)
- Cached in sessionStorage for 60 minutes

### Giscus Comments

- Repo: `LaineyLouiseWard/the-ensemble-site`
- Mapping: pathname
- Category: Comments
- Script uses `is:inline` to prevent Astro stripping

### Environment Variables

- `GITHUB_TOKEN` — Fine-grained PAT with read-only Discussions access (for `/api/ensemble`)

## Design Direction

- Clean, minimal editorial typography (EB Garamond)
- Homepage parallax hero banner with pixel-art layers
- Prioritize readability
- Dark/light/auto theme support
- Consistent `pt-36` title positioning across pages
