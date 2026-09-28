'use client'

import type { RefObject } from 'react'

import { activeIndex, drawRange, slideRange } from '@/lib/circuits/reel'
import { gsap, useGSAP } from '@/lib/gsap'

/** Screens of scroll the reel spans once pinned (the tail after it is the next scene's curtain). */
export const REEL_SCREENS = 3.5
const PARALLAX_PERCENT = 6

interface Options {
	sectionRef: RefObject<HTMLElement | null>
	wrapperRef: RefObject<HTMLElement | null>
	trackRef: RefObject<HTMLElement | null>
	accents: readonly string[]
}

function formatCount(value: number, decimals: number) {
	return value.toFixed(decimals)
}

/**
 * Desktop: panels sit side by side and the track slides left.
 * Mobile: panels are stacked and each one slides up over the last.
 * Either way every circuit draws its track and counts up its stats in its own
 * step, and the section's accent follows the circuit in view.
 */
export function useCircuitsReel({ sectionRef, wrapperRef, trackRef, accents }: Options) {
	useGSAP(
		() => {
			const section = sectionRef.current
			const wrapper = wrapperRef.current
			const track = trackRef.current
			if (!section || !wrapper || !track) return

			const mm = gsap.matchMedia()
			mm.add(
				{
					desktop: '(min-width: 768px) and (prefers-reduced-motion: no-preference)',
					mobile: '(max-width: 767px) and (prefers-reduced-motion: no-preference)'
				},
				(context) => {
					const { desktop } = context.conditions ?? {}
					const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', track)
					const count = panels.length
					const progressBar = section.querySelector<HTMLElement>('[data-reel-progress]')
					const counter = section.querySelector<HTMLElement>('[data-reel-counter]')
					let current = -1

					const setActive = (index: number) => {
						if (index === current) return
						current = index
						section.dataset.accent = accents[index]
						if (counter) counter.textContent = String(index + 1).padStart(2, '0')
					}

					const reel = gsap.timeline({
						defaults: { ease: 'none' },
						scrollTrigger: {
							trigger: wrapper,
							start: 'top top',
							end: () => `+=${window.innerHeight * REEL_SCREENS}`,
							scrub: true,
							invalidateOnRefresh: true,
							onUpdate: (self) => setActive(activeIndex(self.progress, count))
						}
					})
					// Pin the timeline to exactly 0..1 so the ranges below read as progress.
					reel.set({}, {}, 1)
					setActive(0)

					if (progressBar) reel.fromTo(progressBar, { scaleX: 0 }, { scaleX: 1 }, 0)

					panels.forEach((panel, index) => {
						const [drawStart, drawEnd] = drawRange(index, count)
						const drawDuration = drawEnd - drawStart

						const path = panel.querySelector<SVGPathElement>('[data-track]')
						if (path)
							reel.fromTo(
								path,
								{ strokeDashoffset: 1 },
								// pathLength is 1, so GSAP's default px rounding would snap 1 → 0.
								{ strokeDashoffset: 0, duration: drawDuration, autoRound: false },
								drawStart
							)

						panel.querySelectorAll<HTMLElement>('[data-count]').forEach((el) => {
							const target = Number(el.dataset.count)
							const decimals = Number(el.dataset.decimals ?? 0)
							const tally = { value: 0 }
							el.textContent = formatCount(0, decimals)
							reel.to(
								tally,
								{
									value: target,
									duration: drawDuration,
									onUpdate: () => {
										el.textContent = formatCount(tally.value, decimals)
									}
								},
								drawStart
							)
						})

						const image = panel.querySelector<HTMLElement>('[data-parallax]')
						const slide = slideRange(index, count)

						if (desktop) {
							if (image)
								reel.fromTo(
									image,
									{ xPercent: PARALLAX_PERCENT },
									{ xPercent: -PARALLAX_PERCENT, duration: 1 },
									0
								)
							if (slide)
								reel.to(
									track,
									{
										x: () => -window.innerWidth * index,
										duration: slide[1] - slide[0]
									},
									slide[0]
								)
							return
						}

						if (!slide) return
						// Hidden by CSS until JS takes over, so the last card never flashes on top.
						gsap.set(panel, { visibility: 'visible' })
						reel.fromTo(
							panel,
							{ yPercent: 100 },
							{ yPercent: 0, duration: slide[1] - slide[0] },
							slide[0]
						)
						if (image)
							reel.fromTo(
								image,
								{ scale: 1.15 },
								{ scale: 1, duration: slide[1] - slide[0] },
								slide[0]
							)
					})

					return () => {
						section.dataset.accent = accents[0]
					}
				}
			)
		},
		{ scope: sectionRef, dependencies: [accents] }
	)
}
