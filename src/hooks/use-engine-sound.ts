'use client'

import { useEffect, useRef } from 'react'

import { EngineSynth } from '@/lib/audio/engine-synth'
import { gsap } from '@/lib/gsap'
import { TOP_SPEED } from '@/lib/race/gearbox'
import { createScrollSpeed } from '@/lib/race/scroll-speed'

/**
 * Engine note that follows the same scroll-driven speed as the race HUD.
 * The AudioContext is only created on the first switch-on (a user gesture, as
 * browsers require) and is suspended whenever the tab is hidden.
 */
export function useEngineSound(on: boolean) {
	const synthRef = useRef<EngineSynth | null>(null)

	useEffect(() => {
		if (!on && !synthRef.current) return
		if (!synthRef.current) {
			try {
				synthRef.current = new EngineSynth()
			} catch (error) {
				console.warn('[engine] Web Audio unavailable', error)
				return
			}
		}
		const synth = synthRef.current
		synth.setOn(on).catch((error) => console.warn('[engine] could not start audio', error))
		if (!on) return

		const meter = createScrollSpeed(performance.now(), window.scrollY)
		const tick = () => {
			const { speed, rpm } = meter.sample(performance.now(), window.scrollY)
			synth.update(rpm, speed / TOP_SPEED)
		}
		const onVisibility = () => {
			if (document.visibilityState === 'hidden') {
				synth.suspend()
				return
			}
			meter.reset(performance.now(), window.scrollY)
			synth.resume()
		}

		gsap.ticker.add(tick)
		document.addEventListener('visibilitychange', onVisibility)
		return () => {
			gsap.ticker.remove(tick)
			document.removeEventListener('visibilitychange', onVisibility)
		}
	}, [on])

	useEffect(
		() => () => {
			synthRef.current?.dispose()
			synthRef.current = null
		},
		[]
	)
}
