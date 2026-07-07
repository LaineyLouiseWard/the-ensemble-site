import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

// Display labels for the track pill shown on the GitHub profile card.
// Underscores render as spaces on shields.io badges.
const TRACK_LABEL = {
	research: 'Research',
	events: 'Events',
	discussion: 'Discussion',
	'phd-tips': 'PhD_Tips',
}

export async function GET(context) {
	const blog = await getCollection('blog')
	const posts = blog
		.slice()
		.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
	return rss({
		title: 'The Ensemble Edit',
		description:
			'A PhD student-led interdisciplinary blog on AI and climate research.',
		site: context.site,
		xmlns: { ee: 'https://the-ensemble-edit.com/ns/rss' },
		items: posts.map((post) => {
			const track = post.data.track
			const cover = new URL(`banners/${track}/1.png`, context.site).href
			return {
				title: post.data.title,
				pubDate: post.data.pubDate,
				description: post.data.description,
				link: `/blog/${post.id.replace('.md', '')}/`,
				categories: [TRACK_LABEL[track] ?? track],
				customData: `<ee:coverImage>${cover}</ee:coverImage>`,
			}
		}),
	})
}
