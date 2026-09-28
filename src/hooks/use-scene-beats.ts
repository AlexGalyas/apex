'use client'

import type { RefObject } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { type BeatRange, beatOpacity } from '@/lib/scene/beats'
import { trackTrigger } from '@/lib/sequence/track-trigger'

/** How far a beat rises as it comes in, in px. */
const RISE = 16

/** Swaps the scene's beats in place, locked to the same progress as the canvas. */
export function useSceneBeats(
	containerRef: RefObject<HTMLElement | null>,
	ranges: readonly BeatRange[]
) {
	useGSAP(
		() => {
			const container = containerRef.current
			if (!container) return

			const mm = gsap.matchMedia()
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				const beats = gsap.utils.toArray<HTMLElement>('[data-beat]', container)

				const render = (progress: number) => {
					ranges.forEach((range, index) => {
						const beat = beats[index]
						if (!beat) return
						const opacity = beatOpacity(progress, range)
						beat.style.opacity = String(opacity)
						beat.style.transform = `translate3d(0, ${(1 - opacity) * RISE}px, 0)`
					})
				}

				const trigger = trackTrigger(container, {
					onUpdate: (self) => render(self.progress),
					onRefresh: (self) => render(self.progress)
				})
				render(trigger?.progress ?? 0)
			})
		},
		{ scope: containerRef, dependencies: [ranges] }
	)
}
