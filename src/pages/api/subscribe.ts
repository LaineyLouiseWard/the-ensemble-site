export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const POST: APIRoute = async ({ request }) => {
	const headers = { 'Content-Type': 'application/json' }

	// Needs a full-access key (contacts write) + the audience id.
	const apiKey = import.meta.env.RESEND_FULL_API_KEY || process.env.RESEND_FULL_API_KEY
	const audienceId = import.meta.env.RESEND_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID
	if (!apiKey || !audienceId) {
		return new Response(JSON.stringify({ ok: false, error: 'Subscriptions are not configured yet.' }), {
			status: 500,
			headers,
		})
	}

	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid request.' }), { status: 400, headers })
	}

	// Honeypot — bots fill this hidden field
	if (body.website) {
		return new Response(JSON.stringify({ ok: true }), { headers })
	}

	const email = ((body.email as string) || '').trim().toLowerCase()
	if (!EMAIL_RE.test(email)) {
		return new Response(JSON.stringify({ ok: false, error: 'Please enter a valid email address.' }), {
			status: 400,
			headers,
		})
	}

	const resend = new Resend(apiKey)
	try {
		const { error } = await resend.contacts.create({ email, audienceId, unsubscribed: false })
		// A duplicate (already subscribed) is fine — treat as success.
		if (error && !/exist/i.test(error.message || '')) {
			console.error('Resend subscribe error:', error)
			return new Response(JSON.stringify({ ok: false, error: 'Could not subscribe. Please try again.' }), {
				status: 502,
				headers,
			})
		}
	} catch (err) {
		console.error('Resend subscribe error:', err)
		return new Response(JSON.stringify({ ok: false, error: 'Could not subscribe. Please try again.' }), {
			status: 502,
			headers,
		})
	}

	return new Response(JSON.stringify({ ok: true }), { headers })
}
