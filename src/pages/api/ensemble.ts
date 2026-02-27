export const prerender = false

import type { APIRoute } from 'astro'

/**
 * GET /api/ensemble?pathname=/blog/some-post/
 *
 * Returns reaction counts (👍 Converge / 👎 Diverge) for the GitHub Discussion
 * that Giscus created for the given pathname.
 *
 * Requires env var: GITHUB_TOKEN (fine-grained PAT, read-only Discussions access)
 */

const REPO_OWNER = 'LaineyLouiseWard'
const REPO_NAME = 'the-ensemble-site'
const CACHE_TTL_MS = 60_000

// Simple in-memory cache (per serverless cold-start; that's fine)
const cache = new Map<string, { data: object; expires: number }>()

const GRAPHQL_QUERY = `
query($searchQuery: String!) {
  search(query: $searchQuery, type: DISCUSSION, first: 1) {
    nodes {
      ... on Discussion {
        id
        title
        reactions(content: THUMBS_UP) { totalCount }
        thumbsDown: reactions(content: THUMBS_DOWN) { totalCount }
      }
    }
  }
}
`

export const GET: APIRoute = async ({ url }) => {
	const pathname = url.searchParams.get('pathname')
	if (!pathname) {
		return new Response(JSON.stringify({ error: 'Missing pathname parameter' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	const cacheHeaders = {
		'Content-Type': 'application/json',
		'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400, max-age=60',
	}

	// Check cache
	const cached = cache.get(pathname)
	if (cached && Date.now() < cached.expires) {
		return new Response(JSON.stringify(cached.data), { headers: cacheHeaders })
	}

	const token = import.meta.env.GITHUB_TOKEN || process.env.GITHUB_TOKEN
	if (!token) {
		return new Response(JSON.stringify({ error: 'Server misconfigured: missing GITHUB_TOKEN' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	// Giscus with data-mapping="pathname" creates discussions whose title
	// is the page pathname (e.g. "/blog/some-post/"). Search for it.
	const searchQuery = `repo:${REPO_OWNER}/${REPO_NAME} in:title "${pathname}"`

	try {
		const res = await fetch('https://api.github.com/graphql', {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${token}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				query: GRAPHQL_QUERY,
				variables: { searchQuery },
			}),
		})

		if (!res.ok) {
			const text = await res.text()
			return new Response(JSON.stringify({ error: 'GitHub API error', detail: text }), {
				status: 502,
				headers: { 'Content-Type': 'application/json' },
			})
		}

		const json = await res.json()
		const discussion = json.data?.search?.nodes?.[0]

		if (!discussion) {
			const data = { pathname, up: 0, down: 0, convergePct: 0, divergePct: 0, total: 0, updatedAt: new Date().toISOString() }
			cache.set(pathname, { data, expires: Date.now() + CACHE_TTL_MS })
			return new Response(JSON.stringify(data), { headers: cacheHeaders })
		}

		const up = discussion.reactions?.totalCount ?? 0
		const down = discussion.thumbsDown?.totalCount ?? 0
		const total = up + down
		const convergePct = total > 0 ? Math.round((up / total) * 100) : 0
		const divergePct = total > 0 ? 100 - convergePct : 0

		const data = { pathname, up, down, convergePct, divergePct, total, updatedAt: new Date().toISOString() }
		cache.set(pathname, { data, expires: Date.now() + CACHE_TTL_MS })

		return new Response(JSON.stringify(data), { headers: cacheHeaders })
	} catch (err) {
		return new Response(JSON.stringify({ error: 'Failed to fetch from GitHub', detail: String(err) }), {
			status: 502,
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
