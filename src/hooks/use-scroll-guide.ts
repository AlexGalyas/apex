'use client'

import { type RefObject, useCallback, useEffect, useRef, useState } from 'react'

import { ScrollTrigger } from '@/lib/gsap'
import {
	activeSectionIndex,
	type EnterMode,
	NAV_SECTIONS,
	sectionThreshold
} from '@/lib/navigation/sections'
import { scrollToY } from '@/lib/scroll'

const IDLE_MS = 4000
/** A `continue` scene is still fading in at its top; land just past the fade. */
const CONTINUE_LANDING = 0.2
/** Sequence overlays (titles, HUD) fade in over the first 12% of the scrub — land after that. */
const OVERLAY_READY = 0.13

interface Layout {
	thresholds: number[]
	targets: number[]
}

function measure(): Layout {
	const viewport = window.innerHeight
	const thresholds: number[] = []
	const targets: number[] = []
	for (const { id } of NAV_SECTIONS) {
		const section = document.getElementById(id)
		if (!section) continue
		const top = section.getBoundingClientRect().top + window.scrollY
		const mode = (section.closest<HTMLElement>('[data-enter]')?.dataset.enter ??
			'none') as EnterMode
		thresholds.push(sectionThreshold(top, mode, viewport))

		const track = section.querySelector<HTMLElement>('[data-sequence-track]')
		const overlayOffset = track ? (track.offsetHeight - viewport) * OVERLAY_READY : 0
		const fadeOffset = mode === 'continue' ? viewport * CONTINUE_LANDING + 1 : 0
		targets.push(top + Math.max(overlayOffset, fadeOffset))
	}
	return { thresholds, targets }
}

/**
 * Tracks which scene is on screen and how far through the page we are, and
 * flags the reader as idle after a few seconds without scrolling. Progress is
 * written straight to `progressRef` — the only React state is the active index
 * and the idle flag, which change rarely.
 */
export function useScrollGuide(progressRef: RefObject<HTMLElement | null>) {
	const [active, setActive] = useState(0)
	const [idle, setIdle] = useState(false)
	const layout = useRef<Layout>({ thresholds: [], targets: [] })

	useEffect(() => {
		let timer = 0

		const update = () => {
			const y = window.scrollY
			setActive(activeSectionIndex(layout.current.thresholds, y))
			const max = document.documentElement.scrollHeight - window.innerHeight
			const progress = max > 0 ? Math.min(1, y / max) : 0
			if (progressRef.current) progressRef.current.style.transform = `scaleY(${progress})`
		}

		const onScroll = () => {
			update()
			setIdle(false)
			window.clearTimeout(timer)
			timer = window.setTimeout(() => setIdle(true), IDLE_MS)
		}

		const remeasure = () => {
			layout.current = measure()
			update()
		}

		remeasure()
		timer = window.setTimeout(() => setIdle(true), IDLE_MS)
		window.addEventListener('scroll', onScroll, { passive: true })
		ScrollTrigger.addEventListener('refresh', remeasure)

		return () => {
			window.clearTimeout(timer)
			window.removeEventListener('scroll', onScroll)
			ScrollTrigger.removeEventListener('refresh', remeasure)
		}
	}, [progressRef])

	const jumpTo = useCallback((index: number) => {
		const target = layout.current.targets[index]
		if (target !== undefined) scrollToY(target)
	}, [])

	return { active, idle, jumpTo }
}
