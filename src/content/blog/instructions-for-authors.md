---
title: 'Instructions for Authors'
description: |
  A guide for new and returning authors on how to write, format, and submit posts for The Ensemble Edit.
pubDate: 'Feb 26 2026'
coverImageCredit: 'Y S (santonii), Unsplash'
authors: ['lainey']
track: 'phd-tips'
---

Welcome to The Ensemble Edit. This post covers everything you need to know to write and publish a blog post on the site.

## Getting started

Each post is a Markdown file inside `src/content/blog/`. To create a new post, add a file named with your chosen slug, for example `my-great-post.md`. The filename becomes the URL: `/blog/my-great-post/`.

## Frontmatter

Every post starts with a YAML frontmatter block. Here is the minimum you need:

```yaml
---
title: 'Your Post Title'
description: |
  A short summary of your post. This appears on cards and in search results.
pubDate: 'Feb 26 2026'
authors: ['your-author-id']
track: 'research'
---
```

### Required fields

- **title** — The post title.
- **description** — A one-to-two sentence summary.
- **pubDate** — Publication date in a readable format (e.g. `'Mar 01 2026'`).
- **authors** — An array of author IDs matching filenames in `src/content/authors/`.
- **track** — One of `phd-tips`, `events`, `discussion`, or `research`.

### Optional fields

- **updatedDate** — If you revise the post later.
- **coverImageCredit** — Attribution for the cover image.

## Cover images

Place a cover image at `src/assets/blogimages/your-post-slug/cover.jpg`. It will be optimised automatically by the Astro image pipeline.

## Writing your post

Write standard Markdown below the frontmatter. You can use headings, lists, code blocks, images, and links as normal. A few tips:

- Use `##` for top-level sections (the post title is already an `h1`).
- Keep paragraphs concise — the site is designed for readability.
- Use code fences with a language tag for syntax highlighting.

## Author profiles

If you are a new author, create a JSON file in `src/content/authors/` with your ID as the filename (e.g. `your-name.json`). The structure is:

```json
{
  "name": "Your Name",
  "role": "PhD Student",
  "affiliation": "Your Group, Your School",
  "bio": "A short bio about you.",
  "avatar": "/avatars/your-name.png",
  "links": []
}
```

Place your avatar image in `public/avatars/`.

## Submitting

Once your Markdown file and any images are ready, open a pull request against the `main` branch. The site will build and deploy automatically once merged.

If you have any questions, reach out to the team. Happy writing!
