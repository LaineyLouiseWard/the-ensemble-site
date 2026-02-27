export const prerender = false

import type { APIRoute } from 'astro'
import { getViewsStore } from '../../lib/views-store'

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/

const BOT_UA_PATTERNS = [
	'bot',
	'crawler',
	'spider',
	'slurp',
	'mediapartners',
	'lighthouse',
	'pagespeed',
	'headlesschrome',
	'wget',
	'curl',
	'python-requests',
	'go-http-client',
]

function isBot(ua: string | null): boolean {
	if (!ua) return true
	const lower = ua.toLowerCase()
	return BOT_UA_PATTERNS.some((p) => lower.includes(p))
}

export const GET: APIRoute = async ({ url, request }) => {
	const slug = url.searchParams.get('slug')?.trim()

	if (!slug || !SLUG_RE.test(slug)) {
		return new Response(JSON.stringify({ error: 'Invalid or missing slug' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	const ua = request.headers.get('user-agent')
	if (isBot(ua)) {
		return new Response(JSON.stringify({ views: 0 }), {
			headers: { 'Content-Type': 'application/json' },
		})
	}

	try {
		const store = getViewsStore()
		const views = await store.increment(slug)
		return new Response(JSON.stringify({ views }), {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-store',
			},
		})
	} catch (err) {
		console.error('[views] Storage error:', err)
		return new Response(JSON.stringify({ views: 0 }), {
			headers: { 'Content-Type': 'application/json' },
		})
	}
}
