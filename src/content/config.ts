import { defineCollection, z } from 'astro:content'

const blog = defineCollection({
	schema: z.object({
		title: z.string(),
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		coverImageCredit: z.string().optional(),
		featured: z.boolean().optional().default(false),
		authors: z.array(z.string()).default([]),
		track: z.enum(['phd-tips', 'events', 'discussion', 'research']),
		tags: z.array(z.string()).default([]),
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
		linkedin: z.string().optional(),
		orcid: z.string().optional(),
		website: z.string().optional(),
		github: z.string().optional(),
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

const events = defineCollection({
	schema: z.object({
		title: z.string(),
		dateStart: z.coerce.date(),
		dateEnd: z.coerce.date().optional(),
		type: z.enum(['seminar', 'meeting', 'social', 'conference', 'training', 'deadline']),
		location: z.string().optional(),
		link: z.string().optional(),
		description: z.string().optional(),
	}),
})

export const collections = { blog, authors, events }
