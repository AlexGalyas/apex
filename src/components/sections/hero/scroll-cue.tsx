'use client'

import { useRef } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { trackTrigger } from '@/lib/sequence/track-trigger'

/** Share of a viewport of scrolling over which the cue fades away. */
const FADE_SCREENS = 0.3

export function ScrollCue() {
	const cueRef = useRef<HTMLDivElement>(null)

	useGSAP(
		() => {
			const cue = cueRef.current
			if (!cue) return
			// Opacity only: the cue is centred with Tailwind's `translate`, which GSAP
			// would fold into its own transform if it animated position here.
			const fade = gsap.to(cue, { autoAlpha: 0, ease: 'none', paused: true })
			trackTrigger(cue, {
				animation: fade,
				scrub: true,
				end: () => `+=${window.innerHeight * FADE_SCREENS}`,
				invalidateOnRefresh: true
			})
		},
		{ scope: cueRef }
	)

	return (
		<div
			ref={cueRef}
			aria-hidden
			className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 md:bottom-12"
		>
			<span className="font-mono text-[10px] tracking-[0.4em] text-muted uppercase">
				Scroll to ignite
			</span>
			<span className="relative h-12 w-px overflow-hidden bg-text/20">
				<span className="absolute inset-x-0 top-0 h-4 animate-cue bg-linear-to-b from-transparent to-accent motion-reduce:hidden" />
			</span>
		</div>
	)
}
