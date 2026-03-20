export const prerender = false

import type { APIRoute } from 'astro'
import { Resend } from 'resend'
import { TRACKS } from '../../consts'

const VALID_TRACKS: readonly string[] = TRACKS.map(function (t) { return t.slug })
const MAX_FILES = 3
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

export const POST: APIRoute = async ({ request }) => {
	const headers = { 'Content-Type': 'application/json' }

	const apiKey = import.meta.env.RESEND_API_KEY || process.env.RESEND_API_KEY
	const toEmail = import.meta.env.SUBMIT_TO_EMAIL || process.env.SUBMIT_TO_EMAIL
	if (!apiKey || !toEmail) {
		return new Response(JSON.stringify({ ok: false, error: 'Server misconfigured' }), {
			status: 500,
			headers,
		})
	}

	let form: FormData
	try {
		form = await request.formData()
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid form data' }), {
			status: 400,
			headers,
		})
	}

	// Honeypot — bots fill this hidden field
	if (form.get('website')) {
		return new Response(JSON.stringify({ ok: true }), { headers })
	}

	const name = (form.get('name') as string || '').trim()
	const email = (form.get('email') as string || '').trim()
	const track = (form.get('track') as string || '').trim()
	const title = (form.get('title') as string || '').trim()
	const content = (form.get('content') as string || '').trim()

	if (!name || !track || !title || !content) {
		return new Response(JSON.stringify({ ok: false, error: 'Please fill in all required fields.' }), {
			status: 400,
			headers,
		})
	}

	if (!VALID_TRACKS.includes(track)) {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid track.' }), {
			status: 400,
			headers,
		})
	}

	// Collect image files
	const images = form.getAll('images') as File[]
	const files = images.filter(function (f) { return f.size > 0 })

	if (files.length > MAX_FILES) {
		return new Response(JSON.stringify({ ok: false, error: 'Maximum 3 images allowed.' }), {
			status: 400,
			headers,
		})
	}

	for (const file of files) {
		if (file.size > MAX_FILE_SIZE) {
			return new Response(JSON.stringify({ ok: false, error: 'Each image must be under 5 MB.' }), {
				status: 400,
				headers,
			})
		}
		if (!ALLOWED_TYPES.includes(file.type)) {
			return new Response(JSON.stringify({ ok: false, error: 'Only JPEG, PNG, GIF, and WebP images are accepted.' }), {
				status: 400,
				headers,
			})
		}
	}

	// Build attachments
	const attachments = await Promise.all(
		files.map(async function (file) {
			const buffer = Buffer.from(await file.arrayBuffer())
			return { filename: file.name, content: buffer }
		})
	)

	const trackLabel = TRACKS.find(function (t) { return t.slug === track })?.label || track

	const htmlBody = `
<h2>New submission: ${escapeHtml(title)}</h2>
<p><strong>From:</strong> ${escapeHtml(name)}${email ? ' (' + escapeHtml(email) + ')' : ''}</p>
<p><strong>Track:</strong> ${escapeHtml(trackLabel)}</p>
<p><strong>Images attached:</strong> ${files.length}</p>
<hr>
<pre style="white-space:pre-wrap;font-family:monospace;max-width:700px;">${escapeHtml(content)}</pre>
`

	const resend = new Resend(apiKey)

	try {
		await resend.emails.send({
			from: 'The Ensemble Edit <onboarding@resend.dev>',
			to: [toEmail],
			subject: `[Ensemble Submission] ${title} (${trackLabel})`,
			html: htmlBody,
			attachments,
		})
	} catch (err) {
		console.error('Resend error:', err)
		return new Response(JSON.stringify({ ok: false, error: 'Failed to send. Please try again.' }), {
			status: 500,
			headers,
		})
	}

	return new Response(JSON.stringify({ ok: true }), { headers })
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}
