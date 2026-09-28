'use client'

import type { RefObject } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'
import { TOP_SPEED } from '@/lib/race/gearbox'
import { createScrollSpeed } from '@/lib/race/scroll-speed'
import { trackTrigger } from '@/lib/sequence/track-trigger'

const SHIFT_LIGHT_AT = 0.9

/**
 * Drives the speedometer from how fast the page is being scrolled, not where
 * it is: flick the wheel and the car tops out, stop and it coasts to idle.
 * Runs on GSAP's ticker only while the race scene is on screen and writes
 * straight to the DOM — no React renders per frame.
 */
export function useRaceHud(hudRef: RefObject<HTMLElement | null>) {
	useGSAP(
		() => {
			const hud = hudRef.current
			if (!hud) return

			const mm = gsap.matchMedia()
			mm.add('(prefers-reduced-motion: no-preference)', () => {
				const speedEl = hud.querySelector<HTMLElement>('[data-hud-speed]')
				const gearEl = hud.querySelector<HTMLElement>('[data-hud-gear]')
				const arcEl = hud.querySelector<SVGPathElement>('[data-hud-arc]')
				const rpmEl = hud.querySelector<HTMLElement>('[data-hud-rpm]')

				const meter = createScrollSpeed(performance.now(), window.scrollY)

				const tick = () => {
					const { speed, gear, rpm } = meter.sample(performance.now(), window.scrollY)

					if (speedEl) speedEl.textContent = String(Math.round(speed)).padStart(3, '0')
					if (gearEl) gearEl.textContent = gear === 0 ? 'N' : String(gear)
					if (arcEl) arcEl.style.strokeDashoffset = String(1 - speed / TOP_SPEED)
					if (rpmEl) {
						rpmEl.style.transform = `scaleX(${rpm})`
						rpmEl.dataset.redline = String(rpm >= SHIFT_LIGHT_AT)
					}
					hud.style.setProperty('--race-speed', (speed / TOP_SPEED).toFixed(3))
				}

				const start = () => {
					meter.reset(performance.now(), window.scrollY)
					gsap.ticker.add(tick)
				}
				const stop = () => gsap.ticker.remove(tick)

				const trigger = trackTrigger(hud, {
					onToggle: (self) => (self.isActive ? start() : stop())
				})
				if (trigger?.isActive) start()

				return stop
			})
		},
		{ scope: hudRef }
	)
}
