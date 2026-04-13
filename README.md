# The Ensemble Edit

*Where disciplines converge and ideas diverge*

A postgrad-led interdisciplinary blog on AI and climate research.

---

## Contributing

Want to write a post? You don't need to know web development — just Markdown and a bit of Git.

1. Clone the repo and run `yarn install`
2. Copy the starter templates from `templates/`
3. Pick an avatar from `design-assets/avatars/`
4. Write your post, preview with `yarn dev`
5. Push a branch and open a pull request

You don't need any API keys or environment variables. Everything works locally out of the box.

New to Git? Start with the [Instructions for Authors](https://the-ensemble-site.vercel.app/blog/instructions-for-authors/) guide on the site — it walks through everything from setup to submitting your post.

For a quicker reference, see [CONTRIBUTING.md](CONTRIBUTING.md) or the guides in `docs/`.

**Prefer not to use Git at all?** Submit via the [submission portal](https://the-ensemble-site.vercel.app/submit/) and the editorial team will handle the rest.

---

## Quick Reference

| What you need to do | Where |
| --- | --- |
| Start from a template | `templates/` |
| Write your blog post | `src/content/blog/<your-slug>.md` |
| Add your cover image | `src/assets/blogimages/<your-slug>/cover.jpg` |
| Create your author profile | `src/content/authors/<your-id>.json` |
| Pick an avatar | Browse `design-assets/avatars/`, copy to `public/avatars/<your-id>.png` |
| Add a calendar event | `src/content/events/<event-slug>.md` |

---

## Project Structure

```
templates/            # Starter templates for posts and author profiles
docs/                 # Detailed contributor guides
design-assets/        # Pixel-art avatars and banner source files
src/
├── content/
│   ├── blog/         # Markdown blog posts
│   ├── authors/      # Author profile JSON files
│   └── events/       # Calendar events
├── assets/
│   └── blogimages/   # Cover images (one folder per post slug)
├── components/       # Astro components
├── layouts/          # Page layouts
├── pages/            # Routes
└── styles/           # Global CSS
public/
├── avatars/          # Deployed author avatars
└── icons/            # Calendar, social, and weather icons
```

---

## Tech Stack

[![Built with Astro](https://astro.badg.es/v2/built-with-astro/tiny.svg)](https://astro.build)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-deployed-black?logo=vercel&logoColor=white)

| Category | Tools |
|----------|-------|
| **Framework** | Astro 5 (static site generator) |
| **Styling** | Tailwind CSS v4, EB Garamond typography |
| **Language** | TypeScript |
| **Content** | MDX, Astro Content Collections (Zod schemas) |
| **Deployment** | Vercel (static + serverless endpoints) |
| **Integrations** | Giscus (GitHub Discussions), Open-Meteo API, GitHub GraphQL API |
