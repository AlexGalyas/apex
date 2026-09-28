import { ScrollTrigger } from '@/lib/gsap'

/**
 * A ScrollTrigger spanning the same scroll range as the image sequence that
 * `element` sits inside, so overlays stay locked to the frame on screen.
 */
export function trackTrigger(element: HTMLElement, vars: ScrollTrigger.StaticVars = {}) {
	const track = element.closest<HTMLElement>('[data-sequence-track]')
	if (!track) return null
	return ScrollTrigger.create({ trigger: track, start: 'top top', end: 'bottom bottom', ...vars })
}
