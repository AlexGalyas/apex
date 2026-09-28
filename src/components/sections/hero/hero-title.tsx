'use client'

import { useRef } from 'react'

import { useSplitTitle } from '@/hooks/use-split-title'

const WORD = 'APEX'

export function HeroTitle() {
	const titleRef = useRef<HTMLHeadingElement>(null)
	useSplitTitle(titleRef)

	return (
		<h1
			ref={titleRef}
			aria-label={WORD}
			className="flex overflow-y-clip font-display text-[clamp(4rem,16vw,14rem)] leading-none font-black"
		>
			{[...WORD].map((letter, index) => (
				// Outer span: GSAP spreads it on scroll. Inner span: CSS rise-in on load.
				// Kept on separate elements — GSAP folds a running CSS `translate` into
				// its own transform, which would freeze the letter mid-rise.
				<span
					key={index}
					data-letter
					aria-hidden
					className="inline-block will-change-transform"
				>
					<span
						className="inline-block animate-rise px-[0.1em] motion-reduce:animate-none"
						style={{ animationDelay: `${200 + index * 80}ms` }}
					>
						{letter}
					</span>
				</span>
			))}
		</h1>
	)
}
