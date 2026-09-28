import type Lenis from 'lenis'

let lenis: Lenis | null = null

export function registerLenis(instance: Lenis | null) {
	lenis = instance
}

const JUMP_DURATION = 1.6

/** Smooth-scrolls through Lenis when it runs; jumps natively under reduced motion. */
export function scrollToY(y: number) {
	if (lenis) {
		lenis.scrollTo(y, { duration: JUMP_DURATION })
		return
	}
	window.scrollTo({ top: y, behavior: 'auto' })
}
