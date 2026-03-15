// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'The Ensemble Edit'
export const SITE_DESCRIPTION =
	'Where disciplines converge and ideas diverge'

export const SITE_BASE = ''

export const TRACKS = [
	{ slug: 'phd-tips', label: 'PhD Tips' },
	{ slug: 'events', label: 'Events' },
	{ slug: 'discussion', label: 'Discussion' },
	{ slug: 'research', label: 'Research' },
] as const

export const WebsiteLinks = [
	{
		name: 'Home',
		url: '',
	},
	{
		name: 'Blog',
		url: 'blog',
	},
	{
		name: 'Agenda',
		url: 'agenda',
	},
	{
		name: 'The Ensemble',
		url: 'authors',
	},
	{
		name: 'About',
		url: 'about',
	},
	{
		name: 'Contribute',
		url: 'blog/instructions-for-authors',
	},
]
