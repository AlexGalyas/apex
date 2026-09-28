import {
	coverRect,
	frameUrl,
	lerp,
	nearestLoaded,
	pickVariant,
	preloadOrder,
	progressToFrame,
	scaleRect
} from './frames'

describe('frameUrl', () => {
	it('builds a 1-based, zero-padded, versioned path per variant', () => {
		expect(frameUrl('garage', 'desktop', 0, 'webp', 'a1b2')).toBe(
			'/sequences/garage/desktop/0001.webp?v=a1b2'
		)
		expect(frameUrl('race', 'mobile', 149, 'webp', 'c3d4')).toBe(
			'/sequences/race/mobile/0150.webp?v=c3d4'
		)
	})
})

describe('progressToFrame', () => {
	it('maps the ends of the scroll range to the first and last frame', () => {
		expect(progressToFrame(0, 150)).toBe(0)
		expect(progressToFrame(1, 150)).toBe(149)
	})

	it('rounds to the nearest frame in between', () => {
		expect(progressToFrame(0.5, 101)).toBe(50)
		expect(progressToFrame(0.504, 101)).toBe(50)
		expect(progressToFrame(0.506, 101)).toBe(51)
	})

	it('clamps progress outside 0..1', () => {
		expect(progressToFrame(-0.2, 10)).toBe(0)
		expect(progressToFrame(1.3, 10)).toBe(9)
	})
})

describe('preloadOrder', () => {
	it('is a permutation of every frame index', () => {
		const order = preloadOrder(150)
		expect(order).toHaveLength(150)
		expect([...order].sort((a, b) => a - b)).toEqual(Array.from({ length: 150 }, (_, i) => i))
	})

	it('loads the first and last frame before anything else', () => {
		expect(preloadOrder(150).slice(0, 2)).toEqual([0, 149])
	})

	it('goes coarse to fine so an early scrub already has frames spread across the range', () => {
		const order = preloadOrder(33, 16)
		expect(order.slice(0, 3)).toEqual([0, 32, 16])
		expect(order.slice(3, 5)).toEqual([8, 24])
	})

	it('handles a single frame', () => {
		expect(preloadOrder(1)).toEqual([0])
	})
})

describe('nearestLoaded', () => {
	const loadedSet = (indices: number[]) => (i: number) => indices.includes(i)

	it('returns the target itself when it is loaded', () => {
		expect(nearestLoaded(5, 10, loadedSet([2, 5, 8]))).toBe(5)
	})

	it('falls back to the closest loaded frame, preferring the earlier one on a tie', () => {
		expect(nearestLoaded(5, 10, loadedSet([2, 7]))).toBe(7)
		expect(nearestLoaded(5, 10, loadedSet([3, 7]))).toBe(3)
	})

	it('returns -1 when nothing is loaded yet', () => {
		expect(nearestLoaded(5, 10, loadedSet([]))).toBe(-1)
	})
})

describe('coverRect', () => {
	const expectRect = (actual: ReturnType<typeof coverRect>, expected: number[]) => {
		const [x, y, width, height] = expected
		expect(actual.x).toBeCloseTo(x)
		expect(actual.y).toBeCloseTo(y)
		expect(actual.width).toBeCloseTo(width)
		expect(actual.height).toBeCloseTo(height)
	}

	it('fills a wider box by cropping top and bottom', () => {
		expectRect(coverRect(1920, 1080, 2000, 1000), [0, -62.5, 2000, 1125])
	})

	it('fills a taller box by cropping the sides', () => {
		expectRect(coverRect(1920, 1080, 1080, 1920), [-1166.667, 0, 3413.333, 1920])
	})
})

describe('pickVariant', () => {
	it('serves the mobile set below the tablet breakpoint', () => {
		expect(pickVariant(390)).toBe('mobile')
		expect(pickVariant(767)).toBe('mobile')
		expect(pickVariant(768)).toBe('desktop')
	})
})

describe('scaleRect', () => {
	it('keeps the rect when the scale is 1', () => {
		const rect = { x: 0, y: -62.5, width: 2000, height: 1125 }
		expect(scaleRect(rect, 2000, 1000, 1)).toEqual(rect)
	})

	it('grows about the centre of the box', () => {
		expect(scaleRect({ x: 0, y: 0, width: 100, height: 50 }, 100, 50, 1.2)).toEqual({
			x: -10,
			y: -5,
			width: 120,
			height: 60
		})
	})
})

describe('lerp', () => {
	it('interpolates between the ends', () => {
		expect(lerp(1, 1.12, 0)).toBe(1)
		expect(lerp(1, 1.12, 1)).toBeCloseTo(1.12)
		expect(lerp(0, 10, 0.25)).toBe(2.5)
	})
})
