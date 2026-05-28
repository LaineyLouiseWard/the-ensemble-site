export const prerender = false

import type { APIRoute } from 'astro'

const POLL_KEY = 'poll:poster-tools'

export const VALID_OPTIONS = [
	'powerpoint',
	'latex',
	'canva',
	'illustrator',
	'affinity',
	'tablet-carved',
	'other',
] as const

type Option = (typeof VALID_OPTIONS)[number]

function getRedis() {
	const url = (
		import.meta.env.UPSTASH_REDIS_REST_URL ??
		process.env.UPSTASH_REDIS_REST_URL ??
		import.meta.env.KV_REST_API_URL ??
		process.env.KV_REST_API_URL ??
		''
	).replace(/\/$/, '')
	const token =
		import.meta.env.UPSTASH_REDIS_REST_TOKEN ??
		process.env.UPSTASH_REDIS_REST_TOKEN ??
		import.meta.env.KV_REST_API_TOKEN ??
		process.env.KV_REST_API_TOKEN ??
		''
	return { url, token }
}

function emptyTally(): Record<Option, number> {
	return Object.fromEntries(VALID_OPTIONS.map((o) => [o, 0])) as Record<Option, number>
}

export const GET: APIRoute = async () => {
	const { url, token } = getRedis()
	const counts = emptyTally()

	if (url && token) {
		const res = await fetch(`${url}/hgetall/${POLL_KEY}`, {
			headers: { Authorization: `Bearer ${token}` },
		})
		const json = (await res.json()) as { result: string[] | null }
		if (json.result) {
			for (let i = 0; i < json.result.length; i += 2) {
				const key = json.result[i] as Option
				if (key in counts) counts[key] = parseInt(json.result[i + 1], 10) || 0
			}
		}
	}

	return new Response(JSON.stringify(counts), {
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	})
}

export const POST: APIRoute = async ({ request }) => {
	const { url, token } = getRedis()
	const body = (await request.json()) as { option?: string }
	const option = body.option?.trim() as Option

	if (!option || !(VALID_OPTIONS as readonly string[]).includes(option)) {
		return new Response(JSON.stringify({ error: 'Invalid option' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		})
	}

	if (url && token) {
		await fetch(`${url}/hincrby/${POLL_KEY}/${option}/1`, {
			headers: { Authorization: `Bearer ${token}` },
		})
	}

	return new Response(JSON.stringify({ ok: true }), {
		headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
	})
}
