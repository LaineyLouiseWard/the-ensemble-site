export const prerender = false

import type { APIRoute } from 'astro'

const MAX_TEXT = 80
const MAX_NOTES = 50

function getRedis() {
	const url = (import.meta.env.UPSTASH_REDIS_REST_URL ?? process.env.UPSTASH_REDIS_REST_URL
		?? import.meta.env.KV_REST_API_URL ?? process.env.KV_REST_API_URL ?? '').replace(/\/$/, '')
	const token = import.meta.env.UPSTASH_REDIS_REST_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN
		?? import.meta.env.KV_REST_API_TOKEN ?? process.env.KV_REST_API_TOKEN ?? ''
	return { url, token }
}

async function redisCmd(url: string, token: string, cmd: string[]): Promise<unknown> {
	const res = await fetch(`${url}`, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(cmd),
	})
	if (!res.ok) throw new Error(`Upstash ${res.status}`)
	const json = await res.json() as { result: unknown }
	return json.result
}

const KEY = 'pinboard:notes'
const headers = { 'Content-Type': 'application/json' }

// GET — return all notes
export const GET: APIRoute = async () => {
	const { url, token } = getRedis()
	if (!url || !token) {
		return new Response(JSON.stringify({ notes: [] }), { headers })
	}
	try {
		const raw = await redisCmd(url, token, ['LRANGE', KEY, '0', '-1']) as string[]
		const notes = (raw || []).map((s: string) => {
			try { return JSON.parse(s) } catch { return null }
		}).filter(Boolean)
		return new Response(JSON.stringify({ notes }), {
			headers: { ...headers, 'Cache-Control': 'no-store' },
		})
	} catch (err) {
		console.error('[pinboard] GET error:', err)
		return new Response(JSON.stringify({ notes: [] }), { headers })
	}
}

// POST — add a note
export const POST: APIRoute = async ({ request }) => {
	const { url, token } = getRedis()
	if (!url || !token) {
		return new Response(JSON.stringify({ ok: false, error: 'Not configured' }), { status: 500, headers })
	}

	let body: Record<string, unknown>
	try {
		body = await request.json() as Record<string, unknown>
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers })
	}

	const text = (typeof body.text === 'string' ? body.text : '').trim()
	const colour = typeof body.colour === 'string' ? body.colour : 'cream'
	const x = typeof body.x === 'number' ? body.x : 50
	const y = typeof body.y === 'number' ? body.y : 50
	const tilt = typeof body.tilt === 'number' ? body.tilt : 0
	const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''

	if (!text || text.length > MAX_TEXT) {
		return new Response(JSON.stringify({ ok: false, error: `Text required (max ${MAX_TEXT} chars)` }), { status: 400, headers })
	}
	if (!sessionId) {
		return new Response(JSON.stringify({ ok: false, error: 'Missing session' }), { status: 400, headers })
	}

	const note = {
		id: crypto.randomUUID(),
		text,
		colour,
		x,
		y,
		tilt,
		sessionId,
		ts: Date.now(),
	}

	try {
		// Cap total notes
		const len = await redisCmd(url, token, ['LLEN', KEY]) as number
		if (len >= MAX_NOTES) {
			// Remove oldest
			await redisCmd(url, token, ['RPOP', KEY])
		}
		await redisCmd(url, token, ['LPUSH', KEY, JSON.stringify(note)])
		return new Response(JSON.stringify({ ok: true, note }), { headers })
	} catch (err) {
		console.error('[pinboard] POST error:', err)
		return new Response(JSON.stringify({ ok: false, error: 'Failed to save' }), { status: 500, headers })
	}
}

// DELETE — remove own note by id
export const DELETE: APIRoute = async ({ request }) => {
	const { url, token } = getRedis()
	if (!url || !token) {
		return new Response(JSON.stringify({ ok: false, error: 'Not configured' }), { status: 500, headers })
	}

	let body: Record<string, unknown>
	try {
		body = await request.json() as Record<string, unknown>
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid JSON' }), { status: 400, headers })
	}

	const noteId = typeof body.id === 'string' ? body.id : ''
	const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''

	if (!noteId || !sessionId) {
		return new Response(JSON.stringify({ ok: false, error: 'Missing id or session' }), { status: 400, headers })
	}

	try {
		// Get all notes, find the one matching id + sessionId, remove it
		const raw = await redisCmd(url, token, ['LRANGE', KEY, '0', '-1']) as string[]
		const target = (raw || []).find((s: string) => {
			try {
				const n = JSON.parse(s)
				return n.id === noteId && n.sessionId === sessionId
			} catch { return false }
		})

		if (!target) {
			return new Response(JSON.stringify({ ok: false, error: 'Note not found or not yours' }), { status: 403, headers })
		}

		await redisCmd(url, token, ['LREM', KEY, '1', target])
		return new Response(JSON.stringify({ ok: true }), { headers })
	} catch (err) {
		console.error('[pinboard] DELETE error:', err)
		return new Response(JSON.stringify({ ok: false, error: 'Failed to delete' }), { status: 500, headers })
	}
}
