'use client'

import { type RefObject, useEffect, useRef } from 'react'

import { ScrollTrigger } from '@/lib/gsap'
import { whenIdle } from '@/lib/idle'
import { overlayOpacity } from '@/lib/scene/fades'
import {
	coverRect,
	frameUrl,
	holdProgress,
	lerp,
	nearestLoaded,
	pickVariant,
	preloadOrder,
	progressToFrame,
	scaleRect
} from '@/lib/sequence/frames'
import { FrameStore } from '@/lib/sequence/frame-store'
import type { SequenceManifest } from '@/lib/sequence/types'

import { useReducedMotion } from './use-reduced-motion'

const MAX_PIXEL_RATIO = 2
/** Matches preloadOrder's first pass: every 16th frame plus the ends. */
const COARSE_STRIDE = 16
// Scenes overlap (see scene-enter), so a wide margin would preload the next scene on page load.
const PRELOAD_MARGIN = '50% 0px'

interface Options {
	manifest: SequenceManifest
	canvasRef: RefObject<HTMLCanvasElement | null>
	triggerRef: RefObject<HTMLElement | null>
	overlayRef: RefObject<HTMLElement | null>
	/** Overlay copy is visible from the first frame instead of fading in (the opening scene). */
	overlayFromStart: boolean
	priority: boolean
	/** Canvas scale at the start and end of the scrub, e.g. [1, 1.12] for a push-in. */
	zoom?: readonly [number, number]
	/** Share of the scroll at the end that holds on the last frame. */
	hold?: number
	onProgress?: (progress: number) => void
}

export function useImageSequence({
	manifest,
	canvasRef,
	triggerRef,
	overlayRef,
	overlayFromStart,
	priority,
	zoom,
	hold = 0,
	onProgress
}: Options) {
	const reducedMotion = useReducedMotion()
	const [zoomFrom, zoomTo] = zoom ?? [1, 1]
	const onProgressRef = useRef(onProgress)

	useEffect(() => {
		onProgressRef.current = onProgress
	}, [onProgress])

	useEffect(() => {
		const canvas = canvasRef.current
		const trigger = triggerRef.current
		const context = canvas?.getContext('2d', { alpha: false })
		if (!canvas || !trigger || !context) return

		const { scene, frameCount, ext, version } = manifest
		const last = frameCount - 1
		const variant = pickVariant(window.innerWidth)
		const urls = Array.from({ length: frameCount }, (_, i) =>
			frameUrl(scene, variant, i, ext, version)
		)

		let target = reducedMotion ? last : 0
		let drawn = -1
		let rafId = 0

		const draw = () => {
			rafId = 0
			const index = nearestLoaded(target, frameCount, store.isLoaded)
			const image = index >= 0 ? store.get(index) : null
			if (!image || index === drawn) return

			const cover = coverRect(
				image.naturalWidth,
				image.naturalHeight,
				canvas.width,
				canvas.height
			)
			const scale = lerp(zoomFrom, zoomTo, index / Math.max(1, last))
			const rect = scaleRect(cover, canvas.width, canvas.height, scale)
			context.drawImage(image, rect.x, rect.y, rect.width, rect.height)
			drawn = index
		}

		const scheduleDraw = () => {
			if (rafId) return
			rafId = requestAnimationFrame(draw)
		}

		const store = new FrameStore(urls, { onFrame: scheduleDraw })

		const resize = () => {
			const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
			canvas.width = Math.round(canvas.clientWidth * ratio)
			canvas.height = Math.round(canvas.clientHeight * ratio)
			drawn = -1
			scheduleDraw()
		}
		const resizeObserver = new ResizeObserver(resize)
		resizeObserver.observe(canvas)

		if (reducedMotion) {
			store.request([last])
			return () => {
				resizeObserver.disconnect()
				cancelAnimationFrame(rafId)
				store.dispose()
			}
		}

		const order = preloadOrder(frameCount, COARSE_STRIDE)
		let cancelIdle = () => {}
		const proximity = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return
				store.request(order)
				proximity.disconnect()
			},
			{ rootMargin: PRELOAD_MARGIN }
		)

		if (priority) {
			// The opening scene gets a coarse pass straight away (enough to scrub
			// through) and the rest once the page has loaded, so its frames don't
			// compete with fonts and the first paint.
			store.request(order.slice(0, Math.ceil(frameCount / COARSE_STRIDE) + 1))
			cancelIdle = whenIdle(() => store.request(order))
		} else {
			store.request([0])
			proximity.observe(trigger)
		}

		const overlay = overlayRef.current
		const update = (progress: number) => {
			target = progressToFrame(holdProgress(progress, hold), frameCount)
			if (overlay) overlay.style.opacity = String(overlayOpacity(progress, !overlayFromStart))
			onProgressRef.current?.(progress)
			scheduleDraw()
		}

		const scrub = ScrollTrigger.create({
			trigger,
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (self) => update(self.progress)
		})
		// A reload mid-page restores scroll without an update event — sync to it once.
		update(scrub.progress)

		return () => {
			scrub.kill()
			cancelIdle()
			proximity.disconnect()
			resizeObserver.disconnect()
			cancelAnimationFrame(rafId)
			store.dispose()
		}
	}, [
		manifest,
		canvasRef,
		triggerRef,
		overlayRef,
		overlayFromStart,
		priority,
		zoomFrom,
		zoomTo,
		hold,
		reducedMotion
	])
}
