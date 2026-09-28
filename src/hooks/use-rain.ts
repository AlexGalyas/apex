'use client'

import type { RefObject } from 'react'

import { gsap, ScrollTrigger, useGSAP } from '@/lib/gsap'
import { approach } from '@/lib/rain/intensity'
import { RainRenderer } from '@/lib/rain/rain-renderer'

/** Share of CSS pixels the shader renders at (then upscaled). */
const RENDER_SCALE = 0.5
const RENDER_SCALE_COMPACT = 0.4
const EASE_RATE = 0.03

/**
 * Lens rain over the whole page. Each section says how hard it rains with
 * `data-rain` (0..1); the shader eases between them as sections take over.
 * Skipped entirely without WebGL or with reduced motion.
 */
export function useRain(canvasRef: RefObject<HTMLCanvasElement | null>) {
	useGSAP(() => {
		const canvas = canvasRef.current
		if (!canvas) return

		const mm = gsap.matchMedia()
		mm.add('(prefers-reduced-motion: no-preference)', () => {
			let renderer: RainRenderer
			try {
				renderer = new RainRenderer(canvas)
			} catch (error) {
				console.warn('[rain] disabled', error)
				return
			}

			const resize = () => {
				const compact = window.innerWidth < 768
				const scale =
					(compact ? RENDER_SCALE_COMPACT : RENDER_SCALE) *
					Math.min(window.devicePixelRatio || 1, 2)
				renderer.resize(window.innerWidth * scale, window.innerHeight * scale)
			}
			resize()
			window.addEventListener('resize', resize)

			let current = 0
			let target = 0
			let idle = false

			const zones = gsap.utils.toArray<HTMLElement>('[data-rain]').map((zone) =>
				ScrollTrigger.create({
					trigger: zone,
					start: 'top 60%',
					end: 'bottom 40%',
					onToggle: (self) => {
						if (self.isActive) target = Number(zone.dataset.rain) || 0
					}
				})
			)
			const active = zones.find((zone) => zone.isActive)
			if (active) target = Number((active.trigger as HTMLElement).dataset.rain) || 0

			const tick = (time: number) => {
				current = approach(current, target, EASE_RATE)
				if (current === 0 && target === 0) {
					if (!idle) renderer.clear()
					idle = true
					return
				}
				idle = false
				renderer.render(time, current)
			}
			gsap.ticker.add(tick)

			return () => {
				gsap.ticker.remove(tick)
				window.removeEventListener('resize', resize)
				renderer.dispose()
			}
		})
	})
}
