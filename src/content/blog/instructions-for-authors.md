---
title: 'Instructions for Authors'
description: |
  A guide for new and returning authors on how to write, format, and submit posts for The Ensemble Edit.
pubDate: 'Feb 26 2026'
authors: ['lainey']
track: 'phd-tips'
featured: true
---

This post covers everything you need to write and publish on The Ensemble Edit — from installing the tools to opening your first pull request. No prior experience with Git or the terminal required.

If you get stuck, check the <a href="https://github.com/LaineyLouiseWard/the-ensemble-site/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing Guide</a> or the detailed docs in the `docs/` folder of the repository.

## Setting up your machine

You only need to do this once. If you already have Git, Node.js, Yarn, and a GitHub account, skip to **Clone the repo** below.

### Create a GitHub account

You'll need a GitHub account to submit your post. If you don't have one, sign up for free at <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer">github.com/signup</a>.

Once you have an account, ask a maintainer to add you as a collaborator on the repository so you can push branches.

### Open a terminal

A terminal is the text-based window where you'll type commands throughout this guide. Each grey code block below shows a command to run — copy it, paste it into your terminal, and press Enter.

- **macOS:** Open **Terminal** (search for it in Spotlight, or find it in Applications > Utilities).
- **Windows:** Open **PowerShell** (search for it in the Start menu) or **Git Bash** (installed with Git).
- **Linux:** Open your distribution's terminal app.

### Install Git

Git is the version control tool we use to track changes. Download and install it from <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer">git-scm.com/downloads</a> — pick your operating system and follow the installer.

Once installed, tell Git who you are. Use the **same email** as your GitHub account:

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Install Node.js

Node.js runs the site locally so you can preview your post before submitting. Download the LTS version from <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">nodejs.org</a> and run the installer.

To check it worked, run:

```bash
node --version
```

You should see a version number like `v20.x.x`.

### Install Yarn

Yarn is the package manager we use to install the site's dependencies. Once Node.js is installed, run:

```bash
npm install -g yarn
```

## Clone the repo

Navigate to a folder where you want the project to live — for example, your Documents folder:

```bash
cd ~/Documents
```

Then clone the repository and install its dependencies:

```bash
git clone https://github.com/LaineyLouiseWard/the-ensemble-site.git
cd the-ensemble-site
yarn install
```

This downloads the project and installs everything it needs. It may take a minute.

## Start your post

1. Create a branch for your post:

```bash
git checkout -b post/your-post-slug
```

Replace `your-post-slug` with a short, lowercase, hyphenated name for your article (e.g. `tips-for-first-year-phds`).

2. Copy the starter templates:

```bash
cp templates/_template-post.md src/content/blog/your-post-slug.md
cp templates/_template-author.json src/content/authors/your-id.json
```

Skip the second line if you've contributed before and already have an author profile.

3. If this is your first contribution, pick an avatar from `design-assets/avatars/` — there are over 100 pixel-art options to choose from. Copy your choice:

```bash
cp design-assets/avatars/Set1_023.png public/avatars/your-id.png
```

Replace `Set1_023.png` with whichever avatar you like, and `your-id` with your author ID.

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

### Preview locally

Start the development server:

```bash
yarn dev
```

Open <a href="http://localhost:4321" target="_blank" rel="noopener noreferrer">http://localhost:4321</a> in your browser. Check that your post appears, your name and avatar display correctly, and the content reads well. The page reloads automatically when you save changes.

Press `Ctrl+C` in the terminal to stop the server when you're done.

### Push your changes

Stage your new files, commit them, and push to GitHub:

```bash
git add src/content/blog/your-post-slug.md
git add src/content/authors/your-id.json
git add public/avatars/your-id.png
git add src/assets/blogimages/your-post-slug/
git commit -m "Add post: your-post-slug"
git push -u origin post/your-post-slug
```

Only include the author and avatar lines if this is your first contribution. Only include the blogimages line if you added a cover image.

### Open a pull request

After pushing, go to the repository on GitHub. You'll see a banner offering to create a pull request from your branch — click it and fill in a short description. A maintainer will review your post before anything goes live.

Your post will **not** appear on the live site until it is reviewed and merged.

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
