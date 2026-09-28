'use client'

import type { RefObject } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { HOTSPOTS, hotspotAt, TURNTABLE_ASPECT, TURNTABLE_HOLD } from '@/lib/machine/hotspots'
import { coverRect, holdProgress } from '@/lib/sequence/frames'
import { trackTrigger } from '@/lib/sequence/track-trigger'

const COUNT_DURATION = 0.9
/** Room a pin needs beside it for its line and label before it falls back to a card. */
const LABEL_SPACE = 330
const EDGE = 24

/**
 * Projects each callout from source-frame fractions onto the cover-fitted
 * canvas and shows it only on the frames where that part of the car faces us.
 * A pin whose label would leave the screen (always, on phones) shows as a
 * spec card along the bottom instead.
 */
export function useMachineHotspots(containerRef: RefObject<HTMLElement | null>) {
	useGSAP(
		() => {
			const container = containerRef.current
			if (!container) return

			const mm = gsap.matchMedia()
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				const pins = gsap.utils.toArray<HTMLElement>('[data-hotspot]', container)
				const cards = gsap.utils.toArray<HTMLElement>('[data-hotspot-card]', container)
				const compact = window.matchMedia('(max-width: 767px)')
				const shown = HOTSPOTS.map(() => false)

				const countUp = (index: number) => {
					const { value, decimals } = HOTSPOTS[index]
					const targets = container.querySelectorAll<HTMLElement>(
						`[data-hotspot-value="${HOTSPOTS[index].id}"]`
					)
					const tally = { value: 0 }
					gsap.to(tally, {
						value,
						duration: COUNT_DURATION,
						ease: 'power2.out',
						onUpdate: () => {
							targets.forEach(
								(el) => (el.textContent = tally.value.toFixed(decimals))
							)
						}
					})
				}

				const render = (scrollProgress: number) => {
					const progress = holdProgress(scrollProgress, TURNTABLE_HOLD)
					const width = container.clientWidth
					const height = container.clientHeight
					const rect = coverRect(TURNTABLE_ASPECT * 1000, 1000, width, height)

					HOTSPOTS.forEach((hotspot, index) => {
						const { x, y, opacity } = hotspotAt(hotspot, progress)
						const pinX = rect.x + x * rect.width
						const fits =
							hotspot.side === 'right'
								? pinX > EDGE && pinX + LABEL_SPACE < width
								: pinX - LABEL_SPACE > 0 && pinX < width - EDGE
						const asCard = compact.matches || !fits

						const pin = pins[index]
						const card = cards[index]
						if (pin) {
							pin.style.opacity = String(asCard ? 0 : opacity)
							pin.style.transform = `translate3d(${pinX}px, ${rect.y + y * rect.height}px, 0)`
						}
						if (card) {
							card.style.opacity = String(asCard ? opacity : 0)
							card.style.display = asCard && opacity > 0 ? '' : 'none'
						}

						if (opacity > 0 && !shown[index]) {
							shown[index] = true
							countUp(index)
						}
						if (opacity === 0) shown[index] = false
					})
				}

				const trigger = trackTrigger(container, {
					onUpdate: (self) => render(self.progress),
					onRefresh: (self) => render(self.progress)
				})
				render(trigger?.progress ?? 0)
			})
		},
		{ scope: containerRef }
	)
}
