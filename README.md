# The Ensemble Edit

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)

A PhD student-led interdisciplinary blog exploring AI and climate research. Built with Astro, deployed on Vercel.

*Where disciplines converge and ideas diverge*

## Features

- **Parallax hero** — pixel-art 5-layer parallax banner with JS-driven seamless drift
- **Multiple authors** — author profiles with avatars, bios, and per-author post listings
- **Tracks** — categorised content (PhD Tips, Events, Discussion, Research)
- **Giscus comments** — GitHub Discussions-backed comments on every blog post
- **Live weather** — footer and favicon dynamically show current UCD weather via Open-Meteo
- **Dark/light mode** — auto, light, and dark theme toggle
- **EB Garamond typography** — editorial serif font across the site
- **RSS feed** — auto-generated feed at `/rss.xml`
- **Image optimisation** — Astro asset pipeline with responsive images
- **Reading time & last modified** — auto-computed via remark plugins

## Getting Started

```bash
# Install dependencies
yarn install

# Start dev server
yarn dev

# Production build
yarn build

# Preview production build
yarn preview
```

## Environment Variables

Create a `.env` file in the project root (already gitignored):

```
GITHUB_TOKEN=github_pat_xxxxx
```

Required for the Ensemble Response feature (live reaction counts from GitHub Discussions). Create a fine-grained PAT with read-only Discussions access to `LaineyLouiseWard/the-ensemble-site`.

## Adding a Blog Post

1. Create `src/content/blog/your-post-slug.md`
2. Add frontmatter: `title`, `description`, `pubDate`, `authors`, `track`
3. Add cover image at `src/assets/blogimages/your-post-slug/cover.jpg`
4. Commit and deploy

## Project Structure

```
src/
├── components/       # Astro components (Navbar, Footer, BlogCard, etc.)
├── content/
│   ├── blog/         # Markdown blog posts
│   └── authors/      # Author profile JSON files
├── layouts/          # BaseLayout, BlogPostLayout
├── pages/
│   ├── api/          # Server-side endpoints (ensemble reactions)
│   ├── authors/      # Author pages
│   ├── blog/         # Blog listing and post pages
│   └── tracks/       # Track filtered views
└── styles/           # Global CSS with Tailwind
```

## Deployment

Configured for Vercel via `@astrojs/vercel`. All pages are statically pre-rendered except `/api/ensemble` which runs as a serverless function.
