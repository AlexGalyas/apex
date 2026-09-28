import type { Metadata, Viewport } from 'next'

import { Grain, Rain, Reveals } from '@/components/fx'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { config } from '@/core/config'
import { jetbrainsMono, unbounded } from '@/core/fonts'

import './globals.css'

// OpenGraph/Twitter images come from app/opengraph-image.png and app/twitter-image.png.
export const metadata: Metadata = {
	metadataBase: config.siteUrl,
	title: config.title,
	description: config.description,
	alternates: { canonical: '/' },
	openGraph: {
		type: 'website',
		url: '/',
		siteName: config.siteName,
		title: config.title,
		description: config.description
	},
	twitter: { card: 'summary_large_image', title: config.title, description: config.description }
}

export const viewport: Viewport = {
	themeColor: '#07080a'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={`${unbounded.variable} ${jetbrainsMono.variable}`}>
			<body className="bg-bg text-text">
				<SmoothScroll />
				{children}
				<Rain />
				<Grain />
				<Reveals />
			</body>
		</html>
	)
}
