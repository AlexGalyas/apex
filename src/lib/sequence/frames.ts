import type { Rect, SequenceVariantName } from './types'

const MOBILE_MAX_WIDTH = 767

export function frameUrl(
	scene: string,
	variant: SequenceVariantName,
	index: number,
	ext: string
): string {
	const file = String(index + 1).padStart(4, '0')
	return `/sequences/${scene}/${variant}/${file}.${ext}`
}

export function progressToFrame(progress: number, frameCount: number): number {
	const clamped = Math.min(1, Math.max(0, progress))
	return Math.round(clamped * (frameCount - 1))
}

/**
 * First and last frame, then every `stride`-th, halving the stride each pass.
 * A fast scrub before loading finishes still lands on a nearby frame instead of
 * freezing on frame 0.
 */
export function preloadOrder(frameCount: number, stride = 16): number[] {
	const last = frameCount - 1
	const seen = new Set<number>([0, last])
	const order = last === 0 ? [0] : [0, last]

	for (let step = stride; step >= 1; step = Math.floor(step / 2)) {
		for (let i = 0; i <= last; i += step) {
			if (seen.has(i)) continue
			seen.add(i)
			order.push(i)
		}
	}

	return order
}

export function nearestLoaded(
	target: number,
	frameCount: number,
	isLoaded: (index: number) => boolean
): number {
	for (let distance = 0; distance < frameCount; distance++) {
		const before = target - distance
		const after = target + distance
		if (before >= 0 && isLoaded(before)) return before
		if (after < frameCount && isLoaded(after)) return after
	}
	return -1
}

export function coverRect(
	srcWidth: number,
	srcHeight: number,
	boxWidth: number,
	boxHeight: number
): Rect {
	const scale = Math.max(boxWidth / srcWidth, boxHeight / srcHeight)
	const width = srcWidth * scale
	const height = srcHeight * scale
	return { x: (boxWidth - width) / 2, y: (boxHeight - height) / 2, width, height }
}

export function pickVariant(viewportWidth: number): SequenceVariantName {
	if (viewportWidth <= MOBILE_MAX_WIDTH) return 'mobile'
	return 'desktop'
}
