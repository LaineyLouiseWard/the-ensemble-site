# Contributing to The Ensemble Edit

## Quickstart

1. Clone the repo and create a branch for your post.
2. Choose an avatar from the `Avatars/` folder and copy it to `public/avatars/`.
3. Create your author profile in `src/content/authors/`.
4. Write your post in `src/content/blog/`.
5. Preview locally with `yarn dev`.
6. Push your branch and open a pull request.
7. A maintainer reviews your PR. Nothing goes live until they approve and merge it.

---

## Prerequisites

You will need:

- [Node.js](https://nodejs.org/) version 18 or higher (version 20 is recommended)
- [Yarn](https://classic.yarnpkg.com/) — install it with `npm install -g yarn`
- A GitHub account with access to this repository

You do **not** need a `GITHUB_TOKEN` or any environment variables. Those are only used by the live site's reaction feature and are not needed for writing or previewing posts.

---

## Step 1: Set up your branch

If this is your **first time**, clone the repository:

```bash
git clone https://github.com/LaineyLouiseWard/the-ensemble-site.git
cd the-ensemble-site
yarn install
```

If you have **already cloned it**, make sure you start from the latest version of `main`:

```bash
git checkout main
git pull
```

Then create a new branch for your post. Name it after your post slug (the short URL-friendly name):

```bash
git checkout -b post/your-post-slug
```

For example, if your post is called "Tips for First-Year PhDs", a good branch name would be `post/tips-for-first-year-phds`.

---

## Step 2: Choose your avatar (first-time contributors)

The repository includes a set of pre-made pixel-art avatars. You must pick one of these — do not upload your own image.

1. Open the `Avatars/` folder in the root of the repo. You will see files named `Set1_001.png` through `Set1_052.png` and `Set2_001.png` through `Set2_051.png`.
2. Browse them and pick one you like.
3. Copy your chosen file into `public/avatars/` and rename it to match your author ID:

```bash
cp Avatars/Set1_023.png public/avatars/jane.png
```

Your author ID is a short, lowercase name with no spaces (e.g. `jane`, `carlos`, `mei-lin`). You will use this same ID in your author profile and in your post frontmatter.

---

## Step 3: Create your author profile (first-time contributors)

Create a new file at `src/content/authors/<your-id>.json`. For example, if your author ID is `jane`, the file is `src/content/authors/jane.json`.

Copy and fill in this template (also available at `.github/_template-author.json`):

```json
{
  "name": "Jane Smith",
  "role": "PhD Student",
  "affiliation": "Your Research Group, Your School",
  "bio": "A sentence or two about your research.",
  "avatar": "/avatars/jane.png",
  "links": []
}
```

Important details:

- **name** — Your display name as you want it to appear on the site.
- **role** — Your current role (e.g. "PhD Student", "Postdoc").
- **affiliation** — Optional. Your research group and school.
- **bio** — A short description of you or your research.
- **avatar** — Must be `/avatars/<your-id>.png`, matching the file you copied in Step 2.
- **links** — Optional. An array of `{"label": "...", "url": "..."}` objects (e.g. your personal site, ORCID, Twitter).

---

## Step 4: Write your post

Create a new Markdown file at `src/content/blog/<your-post-slug>.md`. The filename becomes the URL, so `tips-for-first-year-phds.md` will appear at `/blog/tips-for-first-year-phds/`.

Every post starts with a frontmatter block. Copy this template (also available at `.github/_template-post.md`):

```yaml
---
title: 'Your Post Title'
description: |
  A one-to-two sentence summary. This appears on cards and in search results.
pubDate: 'Mar 01 2026'
authors: ['jane']
track: 'research'
---

Start writing here.
```

### Required fields

| Field         | What to write                                                                  |
| ------------- | ------------------------------------------------------------------------------ |
| `title`       | The title of your post.                                                        |
| `description` | A short summary (1-2 sentences).                                               |
| `pubDate`     | The publication date, e.g. `'Mar 01 2026'`.                                    |
| `authors`     | An array of author IDs. Use the same ID as your JSON filename, in quotes.      |
| `track`       | One of: `phd-tips`, `events`, `discussion`, or `research`.                     |

### Optional fields

| Field              | What it does                                                              |
| ------------------ | ------------------------------------------------------------------------- |
| `updatedDate`      | Add this if you revise the post after it is published.                    |
| `coverImageCredit` | Attribution for the cover image (e.g. `'Photographer Name, Unsplash'`).  |

### Adding a cover image

If you want a cover image, create a folder matching your post slug inside `src/assets/blogimages/` and place a `cover.jpg` inside it:

```
src/assets/blogimages/tips-for-first-year-phds/cover.jpg
```

Astro will optimise the image automatically at build time.

### Writing tips

- Use `##` for your top-level sections. The post title is already rendered as an `h1`.
- Keep paragraphs short — the site is designed for readability.
- Use fenced code blocks with a language tag (e.g. ` ```python `) for syntax highlighting.

---

## Step 5: Preview locally

Start the development server:

```bash
yarn dev
```

Open `http://localhost:4321` in your browser. The page will reload automatically when you save changes. Check that your post appears, your author name and avatar display correctly, and the content reads well.

---

## Step 6: Submit your pull request

When you are happy with your post, stage and commit your files:

```bash
git add src/content/blog/tips-for-first-year-phds.md
git add src/content/authors/jane.json          # first-time contributors only
git add public/avatars/jane.png                # first-time contributors only
git add src/assets/blogimages/                 # only if you added a cover image
git commit -m "Add post: tips-for-first-year-phds"
git push -u origin post/tips-for-first-year-phds
```

Then go to the repository on GitHub. You will see a banner offering to create a pull request from your branch. Click it, fill in a short description, and submit.

---

## What happens after you open a PR

1. **Automated checks run.** The CI pipeline will lint your code, check formatting, and build the site. If anything fails you will see a red mark on the PR — check the logs for details.
2. **A maintainer reviews your post.** They may suggest edits or approve it as-is.
3. **Once approved, the maintainer merges your PR into `main`.**
4. **The site deploys automatically.** Your post will be live within a few minutes of the merge.

Your post will **not** appear on the live site until a maintainer merges it. Opening a PR does not publish anything.

---

## Repository structure (quick reference)

```
Avatars/                Pre-made avatar images (pick one, copy to public/avatars/)
public/avatars/         Avatar images used by the site
src/content/authors/    Author profiles (one JSON file per contributor)
src/content/blog/       Blog posts (one Markdown file per post)
src/assets/blogimages/  Cover images (optimised by Astro at build)
.github/                Templates (_template-post.md, _template-author.json)
```

---

## For maintainers: branch protection

To enforce the review-before-publish workflow, enable branch protection on `main`:

1. Go to **Settings > Branches > Add branch ruleset** (or "Add rule" for classic protection).
2. Apply to branch: `main`.
3. Enable:
   - **Require a pull request before merging** with at least 1 approval.
   - **Require status checks to pass** — select the `lint-and-format` job from the existing CI workflow.
   - **Do not allow bypassing the above settings** (optional but recommended).
4. Save.

This ensures every post is reviewed and passes CI before it reaches the live site. All of these settings are available on GitHub Free plans — no paid features required.

---

## Questions?

Reach out to the team or read the [Instructions for Authors](https://the-ensemble-site.vercel.app/blog/instructions-for-authors/) post on the live site.
