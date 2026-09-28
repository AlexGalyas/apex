/**
 * The only module that reads `process.env`. Nothing here is secret — the site
 * URL only anchors absolute links in metadata (OpenGraph, sitemap).
 * On Vercel the production domain is provided automatically.
 */
function siteUrl(): URL {
	const explicit = process.env.NEXT_PUBLIC_SITE_URL
	if (explicit) return new URL(explicit)
	const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL
	if (vercel) return new URL(`https://${vercel}`)
	return new URL('http://localhost:3000')
}

export const config = {
	siteUrl: siteUrl(),
	siteName: 'APEX Racing',
	title: 'APEX Racing — The night belongs to us',
	description:
		'APEX Racing in the NOCTURNE series: night street races through Tokyo, Monaco and Dubai.'
} as const
