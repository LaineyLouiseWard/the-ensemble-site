import { defineConfig } from 'astro/config'
import vercel from '@astrojs/vercel'
import tailwindcss from '@tailwindcss/vite'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import partytown from '@astrojs/partytown'
import icon from 'astro-icon'
import rehypeFigureTitle from 'rehype-figure-title'
import { rehypeAccessibleEmojis } from 'rehype-accessible-emojis'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { remarkReadingTime } from './src/plugins/remark-reading-time.mjs'
import { remarkModifiedTime } from './src/plugins/remark-modified-time.mjs'

// Permanently redirect the old *.vercel.app domain to the custom domain, path preserved.
// Injected at the top of Vercel's route config (before the filesystem handler) because a
// static site serves pages directly — vercel.json and middleware never see those requests.
function vercelOldDomainRedirect() {
	const OLD_HOST = 'the-ensemble-site.vercel.app'
	const NEW_ORIGIN = 'https://the-ensemble-edit.com'
	const CONFIG = './.vercel/output/config.json'
	return {
		name: 'vercel-old-domain-redirect',
		hooks: {
			'astro:build:done': () => {
				if (!existsSync(CONFIG)) return
				const cfg = JSON.parse(readFileSync(CONFIG, 'utf8'))
				if (JSON.stringify(cfg.routes).includes(NEW_ORIGIN)) return
				cfg.routes.unshift({
					src: '^/(.*)$',
					has: [{ type: 'host', value: OLD_HOST }],
					headers: { Location: `${NEW_ORIGIN}/$1` },
					status: 308,
				})
				writeFileSync(CONFIG, JSON.stringify(cfg, null, 2))
			},
		},
	}
}

// https://astro.build/config
export default defineConfig({
	site: 'https://the-ensemble-edit.com',
	adapter: vercel(),
	output: 'static',
	integrations: [
		mdx(),
		sitemap(),
		icon(),
		partytown({
			config: {
				forward: ['dataLayer.push'],
			},
		}),
		vercelOldDomainRedirect(),
	],
	vite: {
		plugins: [tailwindcss()],
	},
	markdown: {
		remarkPlugins: [remarkReadingTime, remarkModifiedTime],
		rehypePlugins: [rehypeFigureTitle, rehypeAccessibleEmojis],
	},
})
