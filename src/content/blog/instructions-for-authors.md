---
title: 'Instructions for Authors'
description: |
  A guide for new and returning authors on how to write, format, and submit posts for The Ensemble Edit.
pubDate: 'Feb 26 2026'
authors: ['lainey']
track: 'phd-tips'
featured: true
---

This post covers everything you need to write and publish on The Ensemble Edit. If you get stuck, the detailed docs in the repository have you covered.

## Before you start

1. Clone the repo and install dependencies with `yarn install`.
2. Create a branch for your post: `git checkout -b post/your-post-slug`.
3. Copy the starter templates to get going:
   - `cp templates/_template-post.md src/content/blog/your-post-slug.md`
   - `cp templates/_template-author.json src/content/authors/your-id.json` (first-time contributors only)
4. If this is your first contribution, pick an avatar from `design-assets/avatars/`, copy it to `public/avatars/your-id.png`, and fill in your author profile (see below).

## Your author profile

If you copied the template in the previous step, open `src/content/authors/your-id.json` and fill in your details. Your author ID is the filename without `.json` — a short lowercase name (e.g. `jane`, `carlos`).

```json
{
  "name": "Your Name",
  "role": "PhD Student",
  "affiliation": "Your Group, Your School",
  "bio": "A short bio about your research.",
  "avatar": "/avatars/your-id.png",
  "linkedin": "https://www.linkedin.com/in/you/",
  "links": []
}
```

Social fields (`linkedin`, `orcid`, `github`, `website`) are optional — fill in whichever apply and an icon row appears on your profile page automatically.

## Writing your post

If you copied the template earlier, open `src/content/blog/your-post-slug.md` — it already has the frontmatter structure ready to fill in. The filename becomes the URL.

### Frontmatter

Every post starts with a YAML block:

```yaml
---
title: 'Your Post Title'
description: |
  A one-to-two sentence summary shown on cards and in search results.
pubDate: '2026-03-01'
authors: ['your-id']
track: 'research'
---
```

**Required:** `title`, `description`, `pubDate` (ISO format `YYYY-MM-DD`), `authors` (array of author IDs), `track` (one of `phd-tips`, `events`, `discussion`, `research`).

**Optional:** `updatedDate`, `coverImageCredit`.

### Cover image

Place a cover image at:

```
src/assets/blogimages/your-post-slug/cover.jpg
```

Both `.jpg` and `.png` are supported. Recommended size: 1200 x 675 px (16:9). Astro optimises images at build time — no manual resizing needed.

### Formatting tips

- Start body headings at `##` (the title is already `h1`).
- Keep paragraphs short for readability.
- Use fenced code blocks with a language tag for syntax highlighting.
- Link to external sites normally — do not use iframes.

## Preview and submit

1. Run `yarn dev` and check `http://localhost:4321`.
2. Verify your post appears, your name and avatar display, and the content reads well.
3. Commit your files and push: `git push -u origin post/your-post-slug`.
4. Open a pull request on GitHub. A maintainer will review it before anything goes live.

## Where things live

Here's a quick map of the repo so you know where to find everything:

| What | Where |
| --- | --- |
| Starter templates | `templates/` |
| Your blog post | `src/content/blog/<slug>.md` |
| Your cover image | `src/assets/blogimages/<slug>/cover.jpg` |
| Your author profile | `src/content/authors/<id>.json` |
| Avatar choices | `design-assets/avatars/` |
| Your deployed avatar | `public/avatars/<id>.png` |

For detailed reference, see these docs in the repo:

- `docs/author-profile.md` — profile schema, avatar setup, social links
- `docs/writing-an-article.md` — frontmatter fields, cover images, common mistakes
- `docs/calendar-events.md` — adding events to the agenda calendar

The source code is on GitHub: <a href="https://github.com/LaineyLouiseWard/the-ensemble-site" target="_blank" rel="noopener noreferrer">LaineyLouiseWard/the-ensemble-site</a>.

Questions? Reach out to the team. Happy writing!
