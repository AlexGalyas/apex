'use client'

import { gsap, useGSAP } from '@/lib/gsap'

/**
 * Anything marked `data-reveal` rises into place the first time it scrolls
 * into view; `data-reveal-delay` staggers siblings. One mount for the page.
 */
export function Reveals() {
	useGSAP(() => {
		const mm = gsap.matchMedia()
		mm.add('(prefers-reduced-motion: no-preference)', () => {
			gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
				gsap.from(element, {
					y: 40,
					opacity: 0,
					duration: 1.1,
					ease: 'expo.out',
					delay: Number(element.dataset.revealDelay) || 0,
					scrollTrigger: { trigger: element, start: 'top 88%', once: true }
				})
			})
		})
	})

	return null
}
