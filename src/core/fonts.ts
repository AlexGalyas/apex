import { JetBrains_Mono, Unbounded } from 'next/font/google'

export const unbounded = Unbounded({
	subsets: ['latin'],
	weight: ['400', '700', '900'],
	variable: '--font-unbounded',
	display: 'swap'
})

export const jetbrainsMono = JetBrains_Mono({
	subsets: ['latin'],
	weight: ['400', '700'],
	variable: '--font-jetbrains-mono',
	display: 'swap'
})
