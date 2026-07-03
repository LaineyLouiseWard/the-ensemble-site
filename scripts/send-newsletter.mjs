#!/usr/bin/env node
/*
 * Create a DRAFT "new article" broadcast in Resend from one or two blog posts.
 *
 *   node scripts/send-newsletter.mjs <slug>                    single-post email
 *   node scripts/send-newsletter.mjs <slug1> <slug2>           dual-post email (slug1 featured)
 *   node scripts/send-newsletter.mjs <slug> --test you@email   send yourself a test instead
 *   node scripts/send-newsletter.mjs <slug> --preview out.html write filled HTML locally, no Resend
 *
 * It reads the post frontmatter, fills templates/newsletter-email.html (or
 * newsletter-email-dual.html when two slugs are given), and creates the broadcast
 * as a DRAFT (never sends). You then open Resend, review, and click Send — so
 * edits/re-runs can never email anyone twice.
 *
 * Required env (in .env): RESEND_API_KEY, NEWSLETTER_FROM, SITE_URL, and one of
 * RESEND_SEGMENT_ID (preferred) or RESEND_AUDIENCE_ID. See docs/email-notifications.md.
 */
import { readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs'
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

const argv = process.argv.slice(2)
const slugs = argv.filter((a, i) => !a.startsWith('--') && argv[i - 1] !== '--test' && argv[i - 1] !== '--preview')
const [slug, slug2] = slugs
// --test <email> (or --test=<email>): send a single test email to that address using
// onboarding@resend.dev — no audience or verified domain needed. Without it, a draft
// broadcast is created instead.
const flagValue = (name) => {
	const i = argv.findIndex((a) => a === `--${name}` || a.startsWith(`--${name}=`))
	if (i === -1) return null
	return argv[i].includes('=') ? argv[i].split('=')[1] : argv[i + 1]
}
const testEmail = flagValue('test')
const previewPath = flagValue('preview')
if (!slug || slugs.length > 2) {
	console.error('Usage: node scripts/send-newsletter.mjs <slug> [slug2] [--test you@email] [--preview out.html]')
	process.exit(1)
}

// Broadcasts need a full-access key; the submit form's send-only key can't create them.
const apiKey = env.RESEND_FULL_API_KEY || env.RESEND_API_KEY
const siteUrl = (env.SITE_URL || '').replace(/\/$/, '')
const from = testEmail ? env.NEWSLETTER_FROM || 'The Ensemble Edit <onboarding@resend.dev>' : env.NEWSLETTER_FROM
const replyTo = env.NEWSLETTER_REPLY_TO || 'lainey.ward1@ucdconnect.ie'
const audienceId = env.RESEND_AUDIENCE_ID
const segmentId = env.RESEND_SEGMENT_ID
const required = previewPath
	? { SITE_URL: siteUrl }
	: testEmail
		? { 'RESEND_API_KEY/RESEND_FULL_API_KEY': apiKey, SITE_URL: siteUrl }
		: { RESEND_FULL_API_KEY: env.RESEND_FULL_API_KEY, NEWSLETTER_FROM: from, SITE_URL: siteUrl, 'RESEND_AUDIENCE_ID/SEGMENT_ID': audienceId || segmentId }
const missing = Object.entries(required)
	.filter(([, v]) => !v)
	.map(([k]) => k)
if (missing.length) {
	console.error('Missing env: ' + missing.join(', ') + '\nSee docs/email-notifications.md.')
	process.exit(1)
}

const TRACK_LABELS = {
	'phd-tips': 'PhD Tips',
	discussion: 'Discussion',
	events: 'Events',
	research: 'Research',
	'quick-take': 'Quick Take',
}

// --- read a post's frontmatter + author + cover into template fields ---
function readPost(slug) {
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

	const trackSlug = scalar('track')
	const pubDate = scalar('pubDate')
	const authorId = (front.match(/^authors:\s*\[([^\]]*)\]/m)?.[1] || '').split(',')[0].trim().replace(/^["']|["']$/g, '')

	let author = 'The Ensemble Edit'
	let avatar = '/avatars/anonymous.png'
	const authorPath = resolve(ROOT, `src/content/authors/${authorId}.json`)
	if (authorId && existsSync(authorPath)) {
		const a = JSON.parse(readFileSync(authorPath, 'utf8'))
		author = a.name || author
		avatar = a.avatar || avatar
	}

	const date = (() => {
		const d = new Date(pubDate)
		return isNaN(d) ? pubDate : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
	})()

	// cover image: ensure a stable public copy exists for the email
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

	return {
		title: scalar('title'),
		description: scalar('description'),
		track: TRACK_LABELS[trackSlug] || trackSlug,
		author,
		avatarUrl: `${siteUrl}${avatar}`,
		date,
		coverUrl: `${siteUrl}/email/${slug}.png`,
		articleUrl: `${siteUrl}/blog/${slug}/`,
	}
}

const p1 = readPost(slug)
const p2 = slug2 ? readPost(slug2) : null

// --- fill template ---
const templateFile = p2 ? 'templates/newsletter-email-dual.html' : 'templates/newsletter-email.html'
let html = readFileSync(resolve(ROOT, templateFile), 'utf8')
const fill = {
	'{{TITLE}}': p1.title,
	'{{DESCRIPTION}}': p1.description,
	'{{TRACK}}': p1.track,
	'{{AUTHOR}}': p1.author,
	'{{AUTHOR_AVATAR}}': p1.avatarUrl,
	'{{DATE}}': p1.date,
	'{{COVER_URL}}': p1.coverUrl,
	'{{ARTICLE_URL}}': p1.articleUrl,
	'{{SITE_URL}}': siteUrl,
	...(p2 && {
		'{{TITLE2}}': p2.title,
		'{{DESCRIPTION2}}': p2.description,
		'{{TRACK2}}': p2.track,
		'{{AUTHOR2}}': p2.author,
		'{{AUTHOR_AVATAR2}}': p2.avatarUrl,
		'{{DATE2}}': p2.date,
		'{{COVER_URL2}}': p2.coverUrl,
		'{{ARTICLE_URL2}}': p2.articleUrl,
	}),
}
for (const [k, v] of Object.entries(fill)) html = html.split(k).join(v)
// strip the leading HTML comment block (the usage notes) so it isn't sent
html = html.replace(/^<!--[\s\S]*?-->\s*/, '')

const subject = `New on The Ensemble Edit: ${p1.title}` + (p2 ? ' (+1 more)' : '')

if (previewPath) {
	writeFileSync(previewPath, html.split('{{{RESEND_UNSUBSCRIBE_URL}}}').join(siteUrl))
	console.log(`\n✓ Preview written to ${previewPath} (nothing sent). Open it in a browser.`)
	process.exit(0)
}

const resend = new Resend(apiKey)

if (testEmail) {
	// Single test email — the unsubscribe token only resolves in broadcasts, so neutralise it.
	const testHtml = html.split('{{{RESEND_UNSUBSCRIBE_URL}}}').join(siteUrl)
	const { data, error } = await resend.emails.send({ from, replyTo, to: [testEmail], subject: `[TEST] ${subject}`, html: testHtml })
	if (error) {
		console.error('Resend error:', error)
		process.exit(1)
	}
	console.log(`\n✓ Test email sent to ${testEmail} (id ${data.id}).`)
	console.log('  Note: without a verified domain, Resend only delivers to your own account email.')
	console.log(`  Cover URL: ${p1.coverUrl}  (must be live to display)`)
} else {
	const { data, error } = await resend.broadcasts.create({
		...(segmentId ? { segmentId } : { audienceId }),
		from,
		replyTo,
		subject,
		previewText: p1.description,
		html,
		name: `New article — ${p1.title}` + (p2 ? ` + ${p2.title}` : ''),
		// no `send` flag => created as a DRAFT
	})
	if (error) {
		console.error('Resend error:', error)
		process.exit(1)
	}
	console.log(`\n✓ Draft broadcast created (id ${data.id}).`)
	console.log('  Review and send it from https://resend.com/broadcasts')
	console.log(`  Subject: ${subject}`)
	console.log(`  Cover URL: ${p1.coverUrl}  (must be live — deploy first)`)
	if (p2) console.log(`  Cover 2:   ${p2.coverUrl}`)
}
