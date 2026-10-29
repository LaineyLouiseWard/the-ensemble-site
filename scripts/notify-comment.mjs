#!/usr/bin/env node
/*
 * Email a post's authors when someone comments on it or replies to a comment.
 *
 * Run by .github/workflows/comment-alerts.yml on every new Giscus comment (a
 * GitHub Discussion comment). Giscus titles each discussion with the post's
 * pathname, "blog/<slug>/", which gives the post and its authors.
 *
 * Env: RESEND_API_KEY, AUTHOR_EMAILS (JSON of author id → email, e.g.
 * {"lainey": "you@example.com"}; authors not listed get no email),
 * GITHUB_EVENT_PATH (set by Actions). Optional: NEWSLETTER_FROM, SITE_URL.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const SITE_URL = process.env.SITE_URL || 'https://the-ensemble-edit.com'
const FROM = process.env.NEWSLETTER_FROM || 'The Ensemble Edit <hello@the-ensemble-edit.com>'

const { discussion, comment } = JSON.parse(readFileSync(process.env.GITHUB_EVENT_PATH, 'utf8'))
const slug = discussion.title.match(/^blog\/([^/]+)\/?$/)?.[1]
if (discussion.category?.name !== 'Comments' || !slug) {
	console.log(`Not a blog comment (${discussion.title}); nothing sent.`)
	process.exit(0)
}

const postPath = ['md', 'mdx'].map((ext) => resolve(ROOT, `src/content/blog/${slug}.${ext}`)).find(existsSync)
const front = postPath ? readFileSync(postPath, 'utf8').match(/^---\n([\s\S]*?)\n---/)?.[1] || '' : ''
const unquote = (s) => s.trim().replace(/^["']|["']$/g, '')
const title = unquote(front.match(/^title:\s*(.*)$/m)?.[1] || slug)
const authorIds = (front.match(/^authors:\s*\[([^\]]*)\]/m)?.[1] || '').split(',').map(unquote).filter(Boolean)

const emails = JSON.parse(process.env.AUTHOR_EMAILS || '{}')
const recipients = authorIds.map((id) => emails[id]).filter(Boolean)
if (!recipients.length) {
	console.log(`No email on file for ${authorIds.join(', ') || slug}; nothing sent.`)
	process.exit(0)
}

const escapeHtml = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const who = comment.user?.login || 'Someone'
const kind = comment.parent_id ? 'reply' : 'comment'
const body = comment.body.length > 1500 ? comment.body.slice(0, 1500) + '…' : comment.body
const fields = {
	'{{KIND}}': kind,
	'{{TITLE}}': escapeHtml(title),
	'{{WHO}}': escapeHtml(who),
	'{{AVATAR}}': comment.user?.avatar_url || 'https://github.com/ghost.png',
	'{{BODY}}': escapeHtml(body),
	'{{POST_URL}}': `${SITE_URL}/blog/${slug}/#comments`,
	'{{SITE_URL}}': SITE_URL,
}
let html = readFileSync(resolve(ROOT, 'templates/comment-alert-email.html'), 'utf8').replace(/^<!--[\s\S]*?-->\s*/, '')
for (const [token, value] of Object.entries(fields)) html = html.split(token).join(value)

for (const to of recipients) {
	const res = await fetch('https://api.resend.com/emails', {
		method: 'POST',
		headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
		body: JSON.stringify({ from: FROM, to: [to], subject: `New ${kind} on "${title}"`, html }),
	})
	if (!res.ok) {
		console.error(`Resend error ${res.status}: ${await res.text()}`)
		process.exit(1)
	}
}
console.log(`Emailed ${recipients.length} author(s) about a ${kind} on ${slug}.`)
