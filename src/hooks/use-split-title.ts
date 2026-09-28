'use client'

import type { RefObject } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { trackTrigger } from '@/lib/sequence/track-trigger'

/** How far the outermost letters travel, as a share of the viewport width. */
const SPREAD = 0.11

/**
 * Letters drift apart from the centre as the garage scene is scrubbed — the
 * title "opens up" as the lights come on. The rise-in on load is CSS
 * (`animate-rise`) so it starts with first paint instead of after hydration.
 */
export function useSplitTitle(titleRef: RefObject<HTMLElement | null>) {
	useGSAP(
		() => {
			const title = titleRef.current
			if (!title) return

			const mm = gsap.matchMedia()
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				const letters = gsap.utils.toArray<HTMLElement>('[data-letter]', title)
				const centre = (letters.length - 1) / 2

				const spread = gsap.timeline({ defaults: { ease: 'power1.in' } })
				letters.forEach((letter, index) => {
					spread.to(letter, { x: () => (index - centre) * window.innerWidth * SPREAD }, 0)
				})
				trackTrigger(title, { animation: spread, scrub: true, invalidateOnRefresh: true })
			})
		},
		{ scope: titleRef }
	)
}
