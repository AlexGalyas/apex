import type { Metadata, Viewport } from 'next'

import { Grain, Rain, Reveals } from '@/components/fx'
import { SmoothScroll } from '@/components/providers/smooth-scroll'
import { jetbrainsMono, unbounded } from '@/core/fonts'

import './globals.css'

export const metadata: Metadata = {
	title: 'APEX Racing — The night belongs to us',
	description:
		'APEX Racing in the NOCTURNE series: night street races through Tokyo, Monaco and Dubai.'
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
