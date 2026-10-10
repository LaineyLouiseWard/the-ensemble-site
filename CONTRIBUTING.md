# Contributing to The Ensemble Edit

## Writing a post

Send it through the form at [the-ensemble-edit.com/submit](https://the-ensemble-edit.com/submit/). You don't need Git, GitHub or any setup. The [Instructions for Authors](https://the-ensemble-edit.com/blog/instructions-for-authors/) cover what to write about, your author profile, and what happens after you press Send.

For a bug or an idea about the site itself, open an issue.

## For maintainers

Every change goes through a pull request, including posts that come in through the form:

1. Branch from `main`, e.g. `post/<slug>` for a post or `fix/<thing>` for a site change.
2. Make the change. For a submission, follow [docs/writing-an-article.md](docs/writing-an-article.md) and, for a first-time writer, [docs/author-profile.md](docs/author-profile.md).
3. Run `yarn build`. There is no CI workflow, so this is the check.
4. Open a pull request and review the diff.
5. Merge to `main`. Vercel deploys it automatically.

`main` is covered by the "Protect main" ruleset: changes need a pull request with one approval, and force-pushes and branch deletion are blocked. Repository admins can bypass it.

Other notes in `docs/`: [calendar events](docs/calendar-events.md), [email notifications](docs/email-notifications.md) and the [views counter](docs/views-counter.md).
