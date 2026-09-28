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
import { preloader } from '@/lib/sequence/preloader'
import type { SequenceManifest, SequenceVariantName } from '@/lib/sequence/types'

import { useReducedMotion } from './use-reduced-motion'

const MAX_PIXEL_RATIO = 2
/** Matches preloadOrder's first pass: every 16th frame plus the ends. */
const COARSE_STRIDE = 16

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
		const urls = (variant: SequenceVariantName) =>
			Array.from({ length: frameCount }, (_, i) => frameUrl(scene, variant, i, ext, version))

		let target = reducedMotion ? last : 0
		let drawn: HTMLImageElement | null = null
		let rafId = 0

		// Phones get the light frames only; wider screens scrub on them first and
		// swap in full-resolution frames around the playhead as they arrive.
		const sharpVariant = pickVariant(window.innerWidth)
		const draft = new FrameStore(urls('mobile'), { onFrame: () => scheduleDraw() })
		const sharp =
			sharpVariant === 'mobile'
				? null
				: new FrameStore(urls(sharpVariant), { onFrame: () => scheduleDraw() })
		const top = sharp ?? draft

		const isLoaded = (i: number) => draft.isLoaded(i) || !!sharp?.isLoaded(i)
		const frameAt = (i: number) => (sharp?.isLoaded(i) ? sharp.get(i) : draft.get(i))

		const draw = () => {
			rafId = 0
			const index = nearestLoaded(target, frameCount, isLoaded)
			const image = index >= 0 ? frameAt(index) : null
			if (!image || image === drawn) return

			const cover = coverRect(
				image.naturalWidth,
				image.naturalHeight,
				canvas.width,
				canvas.height
			)
			const scale = lerp(zoomFrom, zoomTo, index / Math.max(1, last))
			const rect = scaleRect(cover, canvas.width, canvas.height, scale)
			// Resizing a canvas resets its context state, so this is set on every draw.
			context.imageSmoothingQuality = 'high'
			context.drawImage(image, rect.x, rect.y, rect.width, rect.height)
			drawn = image
		}

		const scheduleDraw = () => {
			if (rafId) return
			rafId = requestAnimationFrame(draw)
		}

		const resize = () => {
			const ratio = Math.min(window.devicePixelRatio || 1, MAX_PIXEL_RATIO)
			canvas.width = Math.round(canvas.clientWidth * ratio)
			canvas.height = Math.round(canvas.clientHeight * ratio)
			drawn = null
			scheduleDraw()
		}
		const resizeObserver = new ResizeObserver(resize)
		resizeObserver.observe(canvas)

		const dispose = () => {
			resizeObserver.disconnect()
			cancelAnimationFrame(rafId)
			draft.dispose()
			sharp?.dispose()
		}

		if (reducedMotion) {
			preloader.urgent(top, [last])
			return dispose
		}

		const order = preloadOrder(frameCount, COARSE_STRIDE)
		if (priority) {
			// The opening frame at full resolution plus a coarse pass of drafts, enough
			// to scrub through; everything else waits until the page has loaded.
			preloader.urgent(top, [0])
			preloader.urgent(draft, order.slice(0, Math.ceil(frameCount / COARSE_STRIDE) + 1))
		} else {
			preloader.urgent(draft, [0])
		}
		const track = { element: trigger, draft, draftOrder: order, sharp, target: () => target }
		const unregister = preloader.register(track)
		const cancelIdle = whenIdle(() => preloader.start())

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
			onUpdate: (self) => update(self.progress),
			onToggle: (self) => preloader.setActive(track, self.isActive)
		})
		preloader.setActive(track, scrub.isActive)
		// A reload mid-page restores scroll without an update event — sync to it once.
		update(scrub.progress)

		return () => {
			scrub.kill()
			cancelIdle()
			unregister()
			dispose()
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
