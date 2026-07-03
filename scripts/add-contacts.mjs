#!/usr/bin/env node
/*
 * Add subscribers to the Resend audience (with their consent).
 *
 *   node scripts/add-contacts.mjs someone@ucd.ie another@gmail.com
 *   node scripts/add-contacts.mjs --file emails.txt      one address per line (commas also fine)
 *
 * Requires RESEND_FULL_API_KEY and RESEND_AUDIENCE_ID in .env.
 * Re-adding an existing address is harmless — Resend deduplicates by email.
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resend } from 'resend'

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const env = { ...process.env }
if (existsSync(resolve(ROOT, '.env'))) {
	for (const line of readFileSync(resolve(ROOT, '.env'), 'utf8').split('\n')) {
		const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/)
		if (m) env[m[1]] ??= m[2].replace(/^["']|["']$/g, '')
	}
}

const argv = process.argv.slice(2)
const fileIdx = argv.findIndex((a) => a === '--file' || a.startsWith('--file='))
const filePath = fileIdx === -1 ? null : argv[fileIdx].includes('=') ? argv[fileIdx].split('=')[1] : argv[fileIdx + 1]
let raw = argv.filter((a, i) => !a.startsWith('--') && i !== fileIdx + 1)
if (filePath) raw = raw.concat(readFileSync(resolve(filePath), 'utf8').split(/[\n,;]+/))

const emails = [...new Set(raw.map((e) => e.trim().toLowerCase()).filter((e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)))]
const rejected = raw.map((e) => e.trim()).filter((e) => e && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e))

if (!emails.length) {
	console.error('Usage: node scripts/add-contacts.mjs <email...> [--file emails.txt]')
	process.exit(1)
}
if (!env.RESEND_FULL_API_KEY || !env.RESEND_AUDIENCE_ID) {
	console.error('Missing env: RESEND_FULL_API_KEY and/or RESEND_AUDIENCE_ID. See docs/email-notifications.md.')
	process.exit(1)
}

const resend = new Resend(env.RESEND_FULL_API_KEY)
let ok = 0
for (const email of emails) {
	const { error } = await resend.contacts.create({ audienceId: env.RESEND_AUDIENCE_ID, email, unsubscribed: false })
	if (error) console.error(`  ✗ ${email}: ${error.message}`)
	else {
		ok++
		console.log(`  ✓ ${email}`)
	}
	await new Promise((r) => setTimeout(r, 600)) // stay under Resend's 2 req/s limit
}
console.log(`\n${ok}/${emails.length} added to the audience.`)
if (rejected.length) console.log('Skipped (not valid addresses): ' + rejected.join(', '))
