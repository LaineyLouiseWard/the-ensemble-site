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

	let body: Record<string, unknown>
	try {
		body = await request.json()
	} catch {
		return new Response(JSON.stringify({ ok: false, error: 'Invalid form data' }), {
			status: 400,
			headers,
		})
	}

	// Honeypot — bots fill this hidden field
	if (body.website) {
		return new Response(JSON.stringify({ ok: true }), { headers })
	}

	const name = ((body.name as string) || '').trim()
	const email = ((body.email as string) || '').trim()
	const track = ((body.track as string) || '').trim()
	const title = ((body.title as string) || '').trim()
	const content = ((body.content as string) || '').trim()
	const avatar = ((body.avatar as string) || '').trim()
	const bio = ((body.bio as string) || '').trim()
	const linkedin = ((body.linkedin as string) || '').trim()
	const websiteUrl = ((body['website-url'] as string) || '').trim()

	const isAnonymous = name.toLowerCase() === 'anonymous'

	if (!name || !track || !title || !content) {
		return new Response(JSON.stringify({ ok: false, error: 'Please fill in all required fields.' }), {
			status: 400,
			headers,
		})
	}

	if (!isAnonymous && !email) {
		return new Response(JSON.stringify({ ok: false, error: 'Email is required for non-anonymous submissions.' }), {
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

	// Process base64 images
	const imageData = (body.images || []) as Array<{ name: string; type: string; data: string }>
	const files = imageData.filter(function (img) { return img && img.data })

	if (files.length > MAX_FILES) {
		return new Response(JSON.stringify({ ok: false, error: 'Maximum 3 images allowed.' }), {
			status: 400,
			headers,
		})
	}

	for (const file of files) {
		const buffer = Buffer.from(file.data, 'base64')
		if (buffer.length > MAX_FILE_SIZE) {
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

	const attachments = files.map(function (img) {
		return { filename: img.name, content: Buffer.from(img.data, 'base64') }
	})

	const trackLabel = TRACKS.find(function (t) { return t.slug === track })?.label || track

	const htmlBody = `
<h2>New submission: ${escapeHtml(title)}</h2>
<p><strong>From:</strong> ${escapeHtml(name)}${email ? ' (' + escapeHtml(email) + ')' : ''}${isAnonymous ? ' [Anonymous]' : ''}</p>
<p><strong>Track:</strong> ${escapeHtml(trackLabel)}</p>
<p><strong>Avatar:</strong> ${avatar ? escapeHtml(avatar) : 'None selected'}</p>
<p><strong>Images attached:</strong> ${files.length}</p>
<hr>
<pre style="white-space:pre-wrap;font-family:monospace;max-width:700px;">${escapeHtml(content)}</pre>
${bio || linkedin || websiteUrl ? `
<hr>
<h3>New Author Profile</h3>
${bio ? `<p><strong>Bio:</strong> ${escapeHtml(bio)}</p>` : ''}
${linkedin ? `<p><strong>LinkedIn:</strong> ${escapeHtml(linkedin)}</p>` : ''}
${websiteUrl ? `<p><strong>Website:</strong> ${escapeHtml(websiteUrl)}</p>` : ''}
` : ''}
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
