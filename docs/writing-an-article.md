# Turning a Submission into a Post

Writers send posts through the form at `/submit/`. `src/pages/api/submit.ts` emails the editor (`SUBMIT_TO_EMAIL`) with the subject `[Ensemble Submission] <title> (<topic>)`. The email holds the name and email, the topic, the chosen avatar, the post text and, for a new writer, their bio and links. Any images (up to 3) come as attachments.

Do the steps below on a branch and open a pull request (see [CONTRIBUTING.md](../CONTRIBUTING.md)).

## 1. Create the post file

Pick a kebab-case slug from the title. It sets the URL (`/blog/<slug>/`) and the cover image folder.

```bash
cp templates/_template-post.md src/content/blog/<slug>.md
```

Paste the text in below the frontmatter. The layout renders the title as `h1`, so body headings start at `##`; the form suggests `#` to writers, so demote those. Swap curly quotes in the frontmatter for straight ones or the build fails.

## 2. Fill in the frontmatter

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Post title. |
| `description` | yes | One or two sentences, shown on cards and under the title. |
| `pubDate` | yes | Quoted date, e.g. `'2026-10-10'` or `'Oct 10 2026'`. |
| `authors` | yes | Author IDs matching files in `src/content/authors/`. Use `['anonymous']` for anonymous posts. |
| `track` | yes | The topic the writer picked: `phd-tips`, `discussion`, `events` or `research`. Readers see it as a Topic. |
| `tags` | no | Array of short tags. |
| `featured` | no | `true` pins the post to Featured on the homepage. |
| `updatedDate` | no | Set when revising a published post. |
| `coverImageCredit` | no | Attribution for the cover image. |
| `coverCaption` | no | Caption under the cover image. |

## 3. Add images

- **Cover:** `src/assets/blogimages/<slug>/cover.jpg` (or `cover.png`; `.jpg` wins if both exist). Astro optimises it at build. No folder means no cover, which is fine.
- **Images in the text:** put them in `public/images/blog/<slug>/` and link them as `/images/blog/<slug>/<file>`.

## 4. New writer?

If the name isn't already in `src/content/authors/`, set up their profile first: [author-profile.md](author-profile.md).

## 5. Check and publish

Run `yarn dev` to read it through, then `yarn build`. Open the pull request, merge to `main`, and Vercel deploys it. To email subscribers about it, see [email-notifications.md](email-notifications.md).
