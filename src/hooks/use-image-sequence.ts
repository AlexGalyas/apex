'use client'

import { type RefObject, useEffect, useRef } from 'react'

import { ScrollTrigger } from '@/lib/gsap'
import {
	coverRect,
	frameUrl,
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
const PRELOAD_MARGIN = '150% 0px'

interface Options {
	manifest: SequenceManifest
	canvasRef: RefObject<HTMLCanvasElement | null>
	triggerRef: RefObject<HTMLElement | null>
	priority: boolean
	/** Canvas scale at the start and end of the scrub, e.g. [1, 1.12] for a push-in. */
	zoom?: readonly [number, number]
	onProgress?: (progress: number) => void
}

export function useImageSequence({
	manifest,
	canvasRef,
	triggerRef,
	priority,
	zoom,
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

		const order = preloadOrder(frameCount)
		store.request(priority ? order : [0])

		const proximity = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return
				store.request(order)
				proximity.disconnect()
			},
			{ rootMargin: PRELOAD_MARGIN }
		)
		proximity.observe(trigger)

		const scrub = ScrollTrigger.create({
			trigger,
			start: 'top top',
			end: 'bottom bottom',
			onUpdate: (self) => {
				target = progressToFrame(self.progress, frameCount)
				onProgressRef.current?.(self.progress)
				scheduleDraw()
			}
		})

		return () => {
			scrub.kill()
			proximity.disconnect()
			resizeObserver.disconnect()
			cancelAnimationFrame(rafId)
			store.dispose()
		}
	}, [manifest, canvasRef, triggerRef, priority, zoomFrom, zoomTo, reducedMotion])
}
