import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		coverImageCredit: z.string().optional(),
		authors: z.array(z.string()).default([]),
		track: z.enum(['phd-tips', 'events', 'discussion', 'research']),
	}),
})

const authors = defineCollection({
	type: 'data',
	schema: z.object({
		name: z.string(),
		role: z.string(),
		affiliation: z.string().optional(),
		bio: z.string(),
		avatar: z.string(),
		links: z
			.array(
				z.object({
					label: z.string(),
					url: z.string(),
				})
			)
			.optional(),
	}),
})

export const collections = { blog, authors }
