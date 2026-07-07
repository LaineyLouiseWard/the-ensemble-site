import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'
import { getImage } from 'astro:assets'

// Display labels for the track pill shown on the GitHub profile card.
// Underscores render as spaces on shields.io badges.
const TRACK_LABEL = {
	research: 'Research',
	events: 'Events',
	discussion: 'Discussion',
	'phd-tips': 'PhD_Tips',
}

// Post cover images, resolved by slug (same convention as the site cards).
const covers = import.meta.glob('/src/assets/blogimages/**/cover.{jpg,jpeg,png,gif}', {
	eager: true,
})

function coverMeta(slug) {
	const base = `/src/assets/blogimages/${slug}/`
	const jpg = `${base}cover.jpg`
	if (covers[jpg]) return covers[jpg].default
	const key = Object.keys(covers).find((k) => k.startsWith(base))
	return key ? covers[key].default : null
}

export async function GET(context) {
	const blog = await getCollection('blog')
	const posts = blog
		.slice()
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())

	const items = await Promise.all(
		posts.map(async (post) => {
			const slug = post.id.replace(/\.md$/, '')
			const track = post.data.track
			const meta = coverMeta(slug)
			let cover
			if (meta) {
				// Uniform 16:9 crop of the real post cover for the GitHub profile card.
				const thumb = await getImage({
					src: meta,
					width: 480,
					height: 270,
					fit: 'cover',
					position: 'center',
					format: 'webp',
				})
				cover = new URL(thumb.src, context.site).href
			} else {
				cover = new URL(`banners/${track}/1.png`, context.site).href
			}
			return {
				title: post.data.title,
				pubDate: post.data.pubDate,
				description: post.data.description,
				link: `/blog/${slug}/`,
				categories: [TRACK_LABEL[track] ?? track],
				customData: `<ee:coverImage>${cover}</ee:coverImage>`,
			}
		})
	)

	return rss({
		title: 'The Ensemble Edit',
		description:
			'A PhD student-led interdisciplinary blog on AI and climate research.',
		site: context.site,
		xmlns: { ee: 'https://the-ensemble-edit.com/ns/rss' },
		items,
	})
}
