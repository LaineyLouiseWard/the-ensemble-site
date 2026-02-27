# Page View Counter

Blog posts display a view count beside reading time. The counter increments on each page load via `GET /api/views?slug=<slug>`.

## How It Works

1. `ViewCount.astro` renders an empty `<span>` and fetches `/api/views?slug=<slug>` client-side.
2. The endpoint validates the slug, skips bots, and calls the configured storage adapter to increment and return the count.
3. If no storage is configured, the endpoint returns `{ views: 0 }` and the view count span stays hidden — no error is shown.

## Storage Adapters

The storage layer is defined in `src/lib/views-store.ts` behind a `ViewsStore` interface. Two implementations are provided:

### Option A: Upstash Redis (recommended for Vercel)

Set these env vars in Vercel (or `.env` locally):

| Variable | Value |
|---|---|
| `UPSTASH_REDIS_REST_URL` | Your Upstash REST endpoint, e.g. `https://xyz.upstash.io` |
| `UPSTASH_REDIS_REST_TOKEN` | The REST token from the Upstash console |

Keys are stored as `views:<slug>` and incremented atomically via the Upstash REST `INCR` command.

### Option B: Cloudflare KV

Bind a KV namespace named `VIEWS_KV_NAMESPACE` in your `wrangler.toml` or Cloudflare Pages settings. Keys are `views:<slug>`.

Note: Cloudflare KV is eventually consistent, so counts may lag slightly under high concurrency.

### Fallback (not configured)

If neither option is configured, the store logs a warning once and returns `0` for all requests. The view count span remains empty on the page.

## Bot Mitigation

The `/api/views` endpoint applies two checks:

1. **Slug validation** — rejects empty or malformed slugs (must match `^[a-z0-9]+(?:-[a-z0-9]+)*$`).
2. **User-agent filtering** — skips increment for requests matching common bot patterns (Googlebot, crawlers, Lighthouse, curl, etc.).

## Files

| File | Role |
|---|---|
| `src/pages/api/views.ts` | Serverless endpoint (`prerender = false`) |
| `src/lib/views-store.ts` | Storage adapter interface + implementations |
| `src/components/ViewCount.astro` | Client-side fetch + render |
| `src/layouts/BlogPostLayout.astro` | Wires ViewCount into the post meta row |
