#!/usr/bin/env node
/*
 * Create a DRAFT "new article" broadcast in Resend from a blog post.
 *
 *   node scripts/send-newsletter.mjs <slug>
 *   e.g. node scripts/send-newsletter.mjs creation-of-a-break
 *
 * It reads the post's frontmatter, fills templates/newsletter-email.html, and
 * creates the broadcast as a DRAFT (never sends). You then open Resend, review,
 * and click Send when you decide — so edits/re-runs can never email anyone twice.
 *
 * Required env (in .env): RESEND_API_KEY, NEWSLETTER_FROM, SITE_URL, and one of
 * RESEND_SEGMENT_ID (preferred) or RESEND_AUDIENCE_ID. See docs/email-notifications.md.
 */
import { readFileSync, existsSync, copyFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resend } from 'resend'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const env = { ...process.env }
// Load .env without a dependency
if (existsSync(resolve(ROOT, '.env'))) {
	for (const line of readFileSync(resolve(ROOT, '.env'), 'utf8').split('\n')) {
		const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
		if (m) env[m[1]] ??= m[2].replace(/^["']|["']$/g, '')
	}
}

const slug = process.argv[2]
if (!slug) {
	console.error('Usage: node scripts/send-newsletter.mjs <slug>')
	process.exit(1)
}

const apiKey = env.RESEND_API_KEY
const from = env.NEWSLETTER_FROM
const siteUrl = (env.SITE_URL || '').replace(/\/$/, '')
const segmentId = env.RESEND_SEGMENT_ID || env.RESEND_AUDIENCE_ID
const missing = Object.entries({ RESEND_API_KEY: apiKey, NEWSLETTER_FROM: from, SITE_URL: siteUrl, 'RESEND_SEGMENT_ID/AUDIENCE_ID': segmentId })
	.filter(([, v]) => !v)
	.map(([k]) => k)
if (missing.length) {
	console.error('Missing env: ' + missing.join(', ') + '\nSee docs/email-notifications.md.')
	process.exit(1)
}

// --- read post frontmatter ---
const postPath = ['md', 'mdx'].map((e) => resolve(ROOT, `src/content/blog/${slug}.${e}`)).find(existsSync)
if (!postPath) {
	console.error(`No post found at src/content/blog/${slug}.(md|mdx)`)
	process.exit(1)
}
const fm = readFileSync(postPath, 'utf8').match(/^---\n([\s\S]*?)\n---/)
if (!fm) {
	console.error('Could not read frontmatter from ' + postPath)
	process.exit(1)
}
const front = fm[1]

function scalar(key) {
	// single-line `key: value` (quoted or bare)
	const m = front.match(new RegExp(`^${key}:[ \\t]*(.+)$`, 'm'))
	if (m && m[1].trim() !== '|' && m[1].trim() !== '>') return m[1].trim().replace(/^["']|["']$/g, '')
	// block scalar `key: |` followed by indented lines
	const b = front.match(new RegExp(`^${key}:[ \\t]*[|>]\\s*\\n([\\s\\S]*?)(?=^\\S|$)`, 'm'))
	if (b) return b[1].split('\n').map((l) => l.trim()).filter(Boolean).join(' ')
	return ''
}

const TRACK_LABELS = {
	'phd-tips': 'PhD Tips',
	discussion: 'Discussion',
	events: 'Events',
	research: 'Research',
	'quick-take': 'Quick Take',
}

const title = scalar('title')
const description = scalar('description')
const trackSlug = scalar('track')
const track = TRACK_LABELS[trackSlug] || trackSlug
const pubDate = scalar('pubDate')
const authorId = (front.match(/^authors:\s*\[([^\]]*)\]/m)?.[1] || '').split(',')[0].trim().replace(/^["']|["']$/g, '')

let author = 'The Ensemble Edit'
const authorPath = resolve(ROOT, `src/content/authors/${authorId}.json`)
if (authorId && existsSync(authorPath)) author = JSON.parse(readFileSync(authorPath, 'utf8')).name || author

const date = (() => {
	const d = new Date(pubDate)
	return isNaN(d) ? pubDate : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
})()

// --- cover image: ensure a stable public copy exists for the email ---
const publicCover = resolve(ROOT, `public/email/${slug}.png`)
if (!existsSync(publicCover)) {
	const src = ['png', 'jpg'].map((e) => resolve(ROOT, `src/assets/blogimages/${slug}/cover.${e}`)).find(existsSync)
	if (src) {
		copyFileSync(src, publicCover)
		console.log(`Copied cover -> public/email/${slug}.png (commit & deploy this before sending)`)
	} else {
		console.warn(`No cover found; email will have a broken image unless you add public/email/${slug}.png`)
	}
}
const coverUrl = `${siteUrl}/email/${slug}.png`
const articleUrl = `${siteUrl}/blog/${slug}/`

// --- fill template ---
let html = readFileSync(resolve(ROOT, 'templates/newsletter-email.html'), 'utf8')
const fill = {
	'{{TITLE}}': title,
	'{{DESCRIPTION}}': description,
	'{{TRACK}}': track,
	'{{AUTHOR}}': author,
	'{{DATE}}': date,
	'{{COVER_URL}}': coverUrl,
	'{{ARTICLE_URL}}': articleUrl,
	'{{SITE_URL}}': siteUrl,
}
for (const [k, v] of Object.entries(fill)) html = html.split(k).join(v)
// strip the leading HTML comment block (the usage notes) so it isn't sent
html = html.replace(/^<!--[\s\S]*?-->\s*/, '')

// --- create the draft broadcast ---
const resend = new Resend(apiKey)
const { data, error } = await resend.broadcasts.create({
	segmentId,
	from,
	subject: `New on The Ensemble Edit: ${title}`,
	previewText: description,
	html,
	name: `New article — ${title}`,
	// no `send` flag => created as a DRAFT
})

if (error) {
	console.error('Resend error:', error)
	process.exit(1)
}
console.log(`\n✓ Draft broadcast created (id ${data.id}).`)
console.log('  Review and send it from https://resend.com/broadcasts')
console.log(`  Subject: New on The Ensemble Edit: ${title}`)
console.log(`  Cover URL: ${coverUrl}  (must be live — deploy first)`)
