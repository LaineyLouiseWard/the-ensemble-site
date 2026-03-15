---
title: 'Instructions for Authors'
description: |
  A guide for new and returning authors on how to write, format, and submit posts for The Ensemble Edit.
pubDate: 'Feb 26 2026'
authors: ['lainey']
track: 'phd-tips'
featured: true
tags: ['contributing', 'git', 'writing']
---

This post covers everything you need to write and publish on The Ensemble Edit — from installing the tools to opening your first pull request. No prior experience with Git or the terminal required.

If you get stuck, check the <a href="https://github.com/LaineyLouiseWard/the-ensemble-site/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer">Contributing Guide</a>.

### Your post in 7 steps

1. [Set up your machine](#1-set-up-your-machine) _(one-time only)_
2. [Clone the repo](#2-clone-the-repo) _(one-time only)_
3. [Create your author profile](#3-create-your-author-profile) _(one-time only)_
4. [Write your post](#4-write-your-post)
5. [Preview locally](#5-preview-locally)
6. [Push your changes](#6-push-your-changes)
7. [Open a pull request](#7-open-a-pull-request)

---

## 1. Set up your machine

You only need to do this once.

### Create a GitHub account

You'll need a GitHub account to submit your post. If you don't have one, sign up for free at <a href="https://github.com/signup" target="_blank" rel="noopener noreferrer">github.com/signup</a>.

Once you have an account, email <a href="mailto:lainey.ward1@ucdconnect.ie">lainey.ward1@ucdconnect.ie</a> with your GitHub username (the one shown at the top of your profile page, starting with `@`) so we can give you access to the repository.

### Open a terminal

A terminal is the text-based window where you'll type commands throughout this guide. Each code block below shows a command to run — copy it, paste it into your terminal, and press Enter.

- **macOS:** Search for **Terminal** in Spotlight.
- **Windows:** Search for **PowerShell** in the Start menu.
- **Linux:** Search for **Terminal** in your app launcher.

### Install Git

Git is the version control tool we use to track blog changes. Download and install it from <a href="https://git-scm.com/downloads" target="_blank" rel="noopener noreferrer">git-scm.com/downloads</a>.

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

## 2. Clone the repo

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

## 3. Create your author profile

Copy the author template:

```bash
cp templates/_template-author.json src/content/authors/your-id.json
```

Replace `your-id` with a short lowercase name for yourself (e.g. `jane-smith`, `carlos-garcia`). This is your **author ID** — you'll use it in a few places.

### Pick an avatar

Open the `design-assets/avatars/` folder in your file explorer — there are over 100 icons to choose from. Copy your choice:

```bash
cp design-assets/avatars/Set1_023.png public/avatars/your-id.png
```

Replace `Set1_023.png` with whichever avatar you like.

### Fill in your details

Open `src/content/authors/your-id.json` and fill in your details:

```json
{
  "name": "Your Name",
  "role": "PhD Student",
  "affiliation": "Your Group, Your School",
  "bio": "A short bio about your research.",
  "avatar": "/avatars/your-id.png",
  "linkedin": "https://www.linkedin.com/in/you/"
}
```

Social fields (`linkedin`, `orcid`, `github`, `website`) are optional — fill in whichever apply and an icon row appears on your profile page automatically. See <a href="/authors/lainey" target="_blank" rel="noopener noreferrer">Lainey's profile</a> for an example.

## 4. Write your post

Create a branch for your post:

```bash
git checkout -b post/your-post-slug
```

Replace `your-post-slug` with a short, lowercase, hyphenated name for your article (e.g. `tips-for-first-year-phds`).

Copy the post template:

```bash
cp templates/_template-post.md src/content/blog/your-post-slug.md
```

Open `src/content/blog/your-post-slug.md` — it already has the settings structure ready to fill in. The filename becomes the URL.

### Post settings

Every post starts with a settings block at the top of the file, between the `---` lines. Fill in each field:

```yaml
---
# Your post title
title: 'Your Post Title'

# A short summary (one or two sentences) — shown on the blog listing and in search results
description: |
  A one-to-two sentence summary.

# Publication date in YYYY-MM-DD format
pubDate: '2026-03-01'

# Your author ID in square brackets — must match your profile filename
authors: ['your-id']

# One of: phd-tips, events, discussion, research
track: 'research'
---
```

### Cover image (optional)

If you'd like a cover image, create a folder for it — the folder name must match your post slug exactly:

```bash
mkdir src/assets/blogimages/your-post-slug
```

Then copy or move your image into that folder and name it `cover.jpg` (or `cover.png`). Recommended size: 1200 x 675 px (16:9). No manual resizing needed. Posts without a cover image work fine.

### Formatting tips

Here's a quick example showing common formatting:

````markdown
<!-- Use '##' for section headings -->
## My first section

Keep paragraphs short — a few sentences each.

<!-- Link to another site -->
Read more on [Wikipedia](https://en.wikipedia.org).

<!-- Include code with triple backticks -->
```python
print("hello")
```
````

## 5. Preview locally

Start the development server:

```bash
yarn dev
```

Open <a href="http://localhost:4321" target="_blank" rel="noopener noreferrer">http://localhost:4321</a> in your browser and check that your post appears with your name and avatar. The page reloads automatically when you save changes. Press `Ctrl+C` to stop the server.

## 6. Push your changes

First, tell Git which files you want to include. Run each line that applies to you:

```bash
# Your post:
git add src/content/blog/your-post-slug.md

# Your profile and avatar (step 3):
git add src/content/authors/your-id.json
git add public/avatars/your-id.png

# Your cover image (if you added one):
git add src/assets/blogimages/your-post-slug/
```

Then save your changes and upload them to GitHub:

```bash
git commit -m "Add post: your-post-slug"
git push -u origin post/your-post-slug
```

## 7. Open a pull request

Go to the <a href="https://github.com/LaineyLouiseWard/the-ensemble-site" target="_blank" rel="noopener noreferrer">repository on GitHub</a>. Click **Pull requests** in the top menu, then click the green **New pull request** button. Select your branch, add a short description, and submit it. A member of the team will review your post before anything goes live.

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

The `docs/` folder has more detailed guides on profiles, writing, and calendar events.

## Coming back for another post?

Open your terminal, navigate to the project folder, and pull the latest changes before starting:

```bash
cd ~/Documents/the-ensemble-site
git checkout main
git pull
yarn install
```

Then continue from [step 4](#4-write-your-post).

That's it — good luck with your post!
