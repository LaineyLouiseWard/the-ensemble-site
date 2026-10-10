# Adding a New Author

When someone submits for the first time, the submission email includes the avatar they picked (e.g. `Set1_014`) and, if they filled them in, a bio, LinkedIn and website. Set up their profile in the same pull request as their post ([writing-an-article.md](writing-an-article.md)).

## 1. Choose an author ID

Short, lowercase and hyphenated, usually the first name (`anton`, `boris-morin`). It names the JSON file, goes in the post's `authors` array, and sets the author page URL `/authors/<id>/`.

## 2. Copy the avatar

```bash
cp design-assets/avatars/<SetN_NNN>.png public/avatars/<id>.png
```

The form hides avatars already in use by matching file contents, so a plain copy is all it needs. Don't make new avatar images.

## 3. Write the profile

```bash
cp templates/_template-author.json src/content/authors/<id>.json
```

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | As typed on the form. |
| `role` | yes | e.g. `"PhD Student"`. The form doesn't ask, so check with the writer if unsure. |
| `bio` | yes | From the form. Use `\n\n` between paragraphs. |
| `avatar` | yes | `"/avatars/<id>.png"` |
| `affiliation` | no | Group and school, e.g. `"Decarb-AI, School of Civil Engineering"`. |
| `from` | no | Shown on the author page as "From: ...". |
| `linkedin`, `orcid`, `github`, `website` | no | Full URLs. Each adds an icon on the author page. |
| `links` | no | Extra links as `[{"label": "...", "url": "..."}]`. |

Returning writers pick their name on the form and skip all of this. Profile edits for existing authors are a JSON change on a branch like anything else.
