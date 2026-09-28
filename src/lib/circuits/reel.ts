/**
 * The circuits reel alternates equal-length steps — draw circuit 0, slide to 1,
 * draw 1, slide to 2, draw 2 — laid out on a 0..1 scroll progress.
 */
export type Range = [start: number, end: number]

const steps = (count: number) => count * 2 - 1

export function drawRange(index: number, count: number): Range {
	const total = steps(count)
	return [(index * 2) / total, (index * 2 + 1) / total]
}

export function slideRange(index: number, count: number): Range | null {
	if (index === 0) return null
	const total = steps(count)
	return [(index * 2 - 1) / total, (index * 2) / total]
}

export function activeIndex(progress: number, count: number): number {
	const step = 1 / steps(count)
	const index = Math.floor((progress + step / 2) / (2 * step))
	return Math.min(count - 1, Math.max(0, index))
}
