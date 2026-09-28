'use client'

import Lenis from 'lenis'
import { useEffect } from 'react'

import { gsap, ScrollTrigger } from '@/lib/gsap'

import { useReducedMotion } from './use-reduced-motion'

export function useLenis() {
	const reducedMotion = useReducedMotion()

	useEffect(() => {
		if (reducedMotion) return

		const lenis = new Lenis({ autoRaf: false, lerp: 0.1 })
		const tick = (time: number) => lenis.raf(time * 1000)

		// One clock for everything: Lenis advances on GSAP's ticker so scrubbed
		// timelines and the smoothed scroll position never drift a frame apart.
		lenis.on('scroll', ScrollTrigger.update)
		gsap.ticker.add(tick)
		gsap.ticker.lagSmoothing(0)

		return () => {
			gsap.ticker.remove(tick)
			lenis.destroy()
		}
	}, [reducedMotion])
}
