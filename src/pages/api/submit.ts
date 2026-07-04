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
	const reviewerChoice = ((body.reviewer as string) || 'reviewer-1').trim() === 'reviewer-2' ? 'reviewer-2' : 'reviewer-1'

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
<p><strong>Reviewer picked:</strong> ${reviewerChoice === 'reviewer-2' ? 'Reviewer 2 (brutal)' : 'Reviewer 1 (kind)'}</p>
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

	// Fun confirmation to the submitter in the style of the Reviewer 2 meme —
	// best-effort; never fails the submission.
	if (email && !isAnonymous) {
		const fromAddress =
			import.meta.env.NEWSLETTER_FROM ||
			process.env.NEWSLETTER_FROM ||
			'The Ensemble Edit <hello@the-ensemble-edit.com>'
		const replyTo =
			import.meta.env.NEWSLETTER_REPLY_TO ||
			process.env.NEWSLETTER_REPLY_TO ||
			'lainey.ward1@ucdconnect.ie'
		const review = buildReviewerEmail(reviewerChoice, name, title)
		try {
			await resend.emails.send({
				from: fromAddress,
				to: [email],
				replyTo,
				subject: review.subject,
				html: review.html,
			})
		} catch (err) {
			console.error('Reviewer confirmation error:', err)
		}
	}

	// Optional newsletter opt-in — best-effort; never fails the submission.
	if (body.subscribe && email && !isAnonymous) {
		const fullKey = import.meta.env.RESEND_FULL_API_KEY || process.env.RESEND_FULL_API_KEY
		const audienceId = import.meta.env.RESEND_AUDIENCE_ID || process.env.RESEND_AUDIENCE_ID
		if (fullKey && audienceId) {
			try {
				await new Resend(fullKey).contacts.create({ email, audienceId, unsubscribed: false })
			} catch (err) {
				console.error('Subscribe opt-in error:', err)
			}
		}
	}

	return new Response(JSON.stringify({ ok: true }), { headers })
}

function buildReviewerEmail(
	choice: string,
	name: string,
	title: string
): { subject: string; html: string } {
	const isR2 = choice === 'reviewer-2'
	const safeTitle = escapeHtml(title)
	const firstName =
		name && name.toLowerCase() !== 'anonymous' ? escapeHtml(name.trim().split(/\s+/)[0]) : 'there'
	const reviewerName = isR2 ? 'Reviewer 2' : 'Reviewer 1'
	const subject = isR2
		? 'Submission received — Reviewer 2’s report 😬'
		: 'Submission received — Reviewer 1’s report ✅'
	const recommendation = isR2 ? 'Accepted — major corrections' : 'Accepted — no corrections'
	const accent = isR2 ? '#b3261e' : '#0784b5'
	const reportBody = isR2
		? 'I have concerns. The argument wanders, the tone is uneven, and it could lose half its length without anyone noticing. I remain unconvinced the author believes their own point — but, against my better judgement, I will allow it.'
		: 'A pleasure to read — clear, timely, and exactly the sort of thing this blog is for. I have no notes. Publish it.'
	const html = `<!doctype html>
<html lang="en"><head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
<body style="margin:0;padding:0;background-color:#ece8df;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#ece8df;">
    <tr><td align="center" style="padding:32px 16px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:600px;max-width:100%;background-color:#ffffff;border:1px solid #e3ddd0;border-radius:14px;overflow:hidden;font-family:Georgia,'Times New Roman',serif;">
        <tr><td style="padding:28px 36px 6px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#0784b5;font-weight:700;">Submission received</div>
          <h1 style="font-family:Georgia,serif;font-size:26px;line-height:1.25;color:#0c0c0c;margin:8px 0 8px;">Got it, ${firstName} — your post has landed. ✓</h1>
          <p style="font-family:Georgia,serif;font-size:16px;line-height:1.55;color:#3a3a3a;margin:0;">Thanks for sending <em>${safeTitle}</em> to The Ensemble Edit.</p>
        </td></tr>
        <tr><td style="padding:18px 36px 30px;">
          <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;letter-spacing:1.5px;text-transform:uppercase;color:#8a8378;font-weight:700;margin-bottom:8px;">Meanwhile, the reviews are in</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #ece8df;border-left:4px solid ${accent};border-radius:8px;">
            <tr><td style="padding:16px 18px;">
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:13px;font-weight:700;color:#0c0c0c;">${reviewerName}</div>
              <div style="font-family:Arial,Helvetica,sans-serif;font-size:12px;color:#8a8378;margin:2px 0 10px;">Recommendation: ${recommendation}</div>
              <p style="font-family:Georgia,serif;font-size:15px;line-height:1.55;color:#3a3a3a;margin:0;">${reportBody}</p>
              <p style="font-family:Georgia,serif;font-size:14px;color:#8a8378;margin:12px 0 0;">— ${reviewerName}</p>
            </td></tr>
          </table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`
	return { subject, html }
}

function escapeHtml(str: string): string {
	return str
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
}
