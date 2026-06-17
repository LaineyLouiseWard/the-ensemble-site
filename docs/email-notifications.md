# Email Notifications (new-article alerts)

Send a branded email to subscribers when a new article goes live. Built on
[Resend](https://resend.com) (already used for the submission form), free at our scale
(3,000 emails/month, 100/day). There is **no subscribe button on the site** — you add
contacts yourself in the Resend dashboard, so this is fully under your control.

The design lives in [`templates/newsletter-email.html`](../templates/newsletter-email.html):
the site masthead is the frame, the post cover sits inside it, then title, blurb, and a
"Read the article" button. It uses Georgia (email clients ignore web fonts) and a
table layout so it renders in Gmail/Outlook.

---

## One-time setup (you do this once, in the Resend dashboard)

1. **Verify a sending domain.** The submission form sends from `onboarding@resend.dev`,
   which Resend only delivers to *your own* address. To email other people you must add
   and verify a domain under **Resend → Domains** (add the DNS records it shows). Free.
2. **Create an Audience** under **Resend → Audiences**, and note its ID. Newer Resend
   calls the sendable list a *Segment* — copy whichever ID the broadcast screen asks for.
3. **Add the env vars** below to `.env` (and to Vercel's project env if you ever run the
   script there). The submission form's `RESEND_API_KEY` is reused.

```
RESEND_API_KEY=...                 # already set for the submit form
NEWSLETTER_FROM=The Ensemble Edit <hello@your-verified-domain>
SITE_URL=https://the-ensemble-site.vercel.app   # your live domain, no trailing slash
RESEND_SEGMENT_ID=...              # or RESEND_AUDIENCE_ID=... (whichever Resend gives you)
```

4. **Add your ~40 contacts.** In the Audience, add subscribers manually (with their
   consent). That's the whole "subscriber list" — no form needed.

---

## Sending an alert for a new article

After the article PR is **merged and live** (the cover image must be deployed before the
email can show it):

```
node scripts/send-newsletter.mjs <slug>
# e.g.
node scripts/send-newsletter.mjs creation-of-a-break
```

The script:

- reads the post's frontmatter (title, blurb, track, date, author),
- ensures a stable cover copy exists at `public/email/<slug>.png` (creating it from the
  post cover if missing — commit & deploy that file before sending),
- fills the template and **creates the broadcast as a draft** (it never sends).

Then go to **[resend.com/broadcasts](https://resend.com/broadcasts)**, open the draft,
preview it, and click **Send** when you're ready. Because you press send yourself,
editing or re-running the script can never email anyone twice.

### Prefer no script? (manual route)

Open the HTML template, replace the `{{DOUBLE_BRACE}}` tokens by hand, paste it into a new
broadcast's **Code** editor in Resend, and send. Leave `{{{RESEND_UNSUBSCRIBE_URL}}}`
untouched — Resend fills the unsubscribe link automatically (it is required).

---

## Notes

- **Unsubscribe is built in.** Resend adds and manages it via `{{{RESEND_UNSUBSCRIBE_URL}}}`.
  Never send a bulk email without it (legal requirement, and good practice).
- **Don't BCC a list from code.** It leaks addresses, has no unsubscribe, and gets flagged
  as spam. The Audience + broadcast flow avoids all of that.
- **Cover image must be a live URL.** Email can't use the site's hashed `_astro/` paths, so
  the script publishes a stable copy at `/email/<slug>.png`.
