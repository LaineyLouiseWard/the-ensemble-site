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

## Detailed Guides

| Guide | Covers |
| --- | --- |
| [Author Profile](docs/author-profile.md) | Profile schema, avatar setup, social links, editing your profile. |
| [Writing an Article](docs/writing-an-article.md) | Frontmatter schema, cover images, date format, writing tips, common mistakes. |
| [Calendar Events](docs/calendar-events.md) | Event schema, type/icon/colour mapping, behavioural rules, adding new types. |
| [Views Counter](docs/views-counter.md) | Page view storage adapters, env vars, bot mitigation. |

---

## Prerequisites

- [Node.js](https://nodejs.org/) version 18+ (20 recommended)
- [Yarn](https://classic.yarnpkg.com/) — install with `npm install -g yarn`
- A GitHub account with access to this repository

You do **not** need a `GITHUB_TOKEN` or any environment variables. Those are only used by the live site's reaction feature.

---

## Setting Up Your Branch

**First time:**

```bash
git clone https://github.com/LaineyLouiseWard/the-ensemble-site.git
cd the-ensemble-site
yarn install
```

**Returning contributors:**

```bash
git checkout main
git pull
```

Then create a branch named after your post slug:

```bash
git checkout -b post/your-post-slug
```

---

## Preview Locally

```bash
yarn dev
```

Open `http://localhost:4321`. The page reloads on save. Check that your post appears, your author name and avatar display correctly, and the content reads well.

---

## Submitting a Pull Request

Stage and commit your files:

```bash
git add src/content/blog/your-post-slug.md
git add src/content/authors/your-id.json      # first-time contributors only
git add public/avatars/your-id.png             # first-time contributors only
git add src/assets/blogimages/                 # only if you added a cover image
git commit -m "Add post: your-post-slug"
git push -u origin post/your-post-slug
```

Go to the repository on GitHub and create a pull request from the banner.

---

## After You Open a PR

1. **CI runs.** Linting, formatting, and build checks. Fix any failures shown in the PR logs.
2. **Maintainer review.** They may suggest edits or approve directly.
3. **Merge to `main`.** The maintainer merges once approved.
4. **Auto-deploy.** Your post goes live within minutes of the merge.

Your post will **not** appear on the live site until a maintainer merges it.

---

## Repository Structure

```
Avatars/                Pre-made avatar images (pick one, copy to public/avatars/)
public/avatars/         Avatar images used by the site
src/content/authors/    Author profiles (one JSON file per contributor)
src/content/blog/       Blog posts (one Markdown file per post)
src/content/events/     Calendar events (one Markdown file per event)
src/assets/blogimages/  Cover images (optimised by Astro at build)
.github/                Templates (_template-post.md, _template-author.json)
docs/                   Detailed contributor documentation
```

---

## For Maintainers: Branch Protection

To enforce the review-before-publish workflow, enable branch protection on `main`:

1. Go to **Settings > Branches > Add branch ruleset** (or "Add rule" for classic protection).
2. Apply to branch: `main`.
3. Enable:
   - **Require a pull request before merging** with at least 1 approval.
   - **Require status checks to pass** — select the `lint-and-format` job from the existing CI workflow.
   - **Do not allow bypassing the above settings** (optional but recommended).
4. Save.

All settings are available on GitHub Free plans.

---

## Questions?

Reach out to the team or read the [Instructions for Authors](https://the-ensemble-site.vercel.app/blog/instructions-for-authors/) post on the live site.
