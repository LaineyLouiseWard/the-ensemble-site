# Writing an Article

Blog posts are Markdown files in `src/content/blog/`. The filename (without `.md`) is the **slug** and determines the URL: `tips-for-first-year-phds.md` becomes `/blog/tips-for-first-year-phds/`.

A starter template is at `templates/_template-post.md`.

## Frontmatter Schema

### Required fields

| Field         | Type           | Notes                                                                 |
| ------------- | -------------- | --------------------------------------------------------------------- |
| `title`       | string         | Post title. Rendered as `h1` by the layout.                          |
| `description` | string         | 1-2 sentence summary. Shown on cards and in search results.          |
| `pubDate`     | date (string)  | Publication date. Use ISO format `YYYY-MM-DD`, e.g. `'2026-03-01'`. |
| `authors`     | string array   | Author IDs matching filenames in `src/content/authors/`.             |
| `track`       | enum           | One of: `phd-tips`, `events`, `discussion`, `research`.              |

### Optional fields

| Field              | Type          | Notes                                                              |
| ------------------ | ------------- | ------------------------------------------------------------------ |
| `updatedDate`      | date (string) | Set this when revising a published post. Same format as `pubDate`. |
| `coverImageCredit` | string        | Attribution text, e.g. `'Photographer Name, Unsplash'`.           |

## Minimal Example

```yaml
---
title: 'Tips for First-Year PhDs'
description: |
  Practical advice on time management, reading strategies, and staying sane.
pubDate: '2026-03-01'
authors: ['jane']
track: 'phd-tips'
---

Start writing here.
```

## Cover Images

### Folder structure

Cover images follow a slug-based convention:

```
src/assets/blogimages/<slug>/cover.jpg   (preferred)
src/assets/blogimages/<slug>/cover.png   (also supported)
```

For the example above, the path would be:

```
src/assets/blogimages/tips-for-first-year-phds/cover.jpg
```

Astro optimises images at build time. Recommended minimum resolution: **1200 x 675 px** (16:9). Both `.jpg` and `.png` are supported — `.jpg` is checked first, then `.png`.

If you include a cover image, set `coverImageCredit` in frontmatter to attribute the source.

### No cover image

If no image directory exists for your slug, the post renders without a cover. This is fine.

## Writing Guidelines

- Use `##` for top-level sections. The post title is already an `h1`.
- Keep paragraphs short for readability.
- Use fenced code blocks with a language tag for syntax highlighting: ` ```python `.
- External links must open in a new tab. In Markdown, standard links work; the layout handles `target="_blank"`. If writing raw HTML, add `target="_blank" rel="noopener noreferrer"`.
- Do **not** embed external sites in iframes. Most external services block iframe embedding via `X-Frame-Options` / CSP headers. Link to them instead.

## Date Format

The content schema uses `z.coerce.date()`, which accepts multiple formats, but **use ISO `YYYY-MM-DD`** (e.g. `'2026-03-01'`) for consistency. Avoid ambiguous formats like `'03/01/2026'`.

## Common Mistakes

| Mistake | Fix |
| --- | --- |
| Author ID in `authors` does not match any file in `src/content/authors/` | Ensure the string matches the JSON filename exactly (without `.json`). |
| Cover image not appearing | Check that the folder name matches the post slug exactly and the file is named `cover.jpg` or `cover.png`. |
| `track` value not recognised | Must be one of: `phd-tips`, `events`, `discussion`, `research`. Case-sensitive. |
| Date parse error | Use ISO format `'YYYY-MM-DD'`. Wrap in quotes in YAML. |
| Heading hierarchy wrong | Start body headings at `##`, not `#`. The title is already `h1`. |
| Using `<iframe>` for external content | Remove the iframe and use a standard link instead. |
