# Author Profile

Each contributor has a JSON profile in `src/content/authors/`. The filename (without `.json`) is your **author ID** — a short, lowercase, hyphen-separated identifier (e.g. `jane`, `carlos`, `mei-lin`). This ID is referenced in blog post frontmatter and determines your author page URL at `/authors/<id>/`.

## Template

A starter template is available at `.github/_template-author.json`. Copy it and rename:

```bash
cp .github/_template-author.json src/content/authors/jane.json
```

## Schema

| Field         | Type       | Required | Notes                                                                 |
| ------------- | ---------- | -------- | --------------------------------------------------------------------- |
| `name`        | string     | yes      | Display name shown on the site.                                       |
| `role`        | string     | yes      | Current role, e.g. `"PhD Student"`, `"Postdoc"`.                      |
| `affiliation` | string     | no       | Research group and school, e.g. `"Decarb-AI, School of Civil Engineering"`. |
| `bio`         | string     | yes      | About you or your research. Use `\n\n` for paragraph breaks.         |
| `avatar`      | string     | yes      | Path to your avatar image: `"/avatars/<id>.png"`.                     |
| `linkedin`    | string     | no       | Full LinkedIn profile URL.                                            |
| `orcid`       | string     | no       | Full ORCID URL, e.g. `"https://orcid.org/0000-0000-0000-0000"`.      |
| `github`      | string     | no       | Full GitHub profile URL.                                              |
| `website`     | string     | no       | Personal website URL.                                                 |
| `links`       | array      | no       | Array of `{"label": "...", "url": "..."}` objects for other links.    |

## Example

```json
{
  "name": "Jane Smith",
  "role": "PhD Student",
  "affiliation": "AIMSIR, School of Maths",
  "bio": "I study statistical methods for climate projections.\n\nOutside research I run a science podcast.",
  "avatar": "/avatars/jane.png",
  "linkedin": "https://www.linkedin.com/in/jane-smith/",
  "orcid": "https://orcid.org/0000-0000-0000-0000",
  "links": []
}
```

## Avatar / Icon Mapping

Avatars are **not hardcoded**. The site resolves your avatar at build time from the `avatar` field in your JSON profile. The pipeline is:

1. You pick a pre-made pixel-art image from the `Avatars/` directory at the repo root (`Set1_001.png` through `Set1_052.png`, `Set2_001.png` through `Set2_051.png`).
2. Copy it to `public/avatars/<id>.png`, matching your author ID.
3. Set `"avatar": "/avatars/<id>.png"` in your JSON.

Do **not** upload custom images or generate new avatars without maintainer approval. The avatar path flows through Astro's content collection system, so any component that renders an author (profile page, blog card byline) reads the path from the collection data — not from a hardcoded string.

Files live at:

```
Avatars/              Pre-made source images (do not modify)
public/avatars/       Active avatars used by the site
```

## Social Links on Author Pages

If any of `linkedin`, `orcid`, `github`, or `website` are set, an icon row renders automatically on the author detail page (`/authors/<id>/`). Icons are SVGs in `public/icons/social/` and are inverted in dark mode. No additional configuration is needed — just fill in the URL.

## Editing Your Profile

To update your profile text, social links, or affiliation, edit your JSON file directly and submit a PR. The same branch-and-review workflow applies as for blog posts.
