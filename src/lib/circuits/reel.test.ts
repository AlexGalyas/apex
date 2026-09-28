import { activeIndex, drawRange, slideRange } from './reel'

describe('reel ranges for three circuits (draw, slide, draw, slide, draw)', () => {
	it('draws each circuit in its own fifth of the scroll', () => {
		expect(drawRange(0, 3)).toEqual([0, 0.2])
		expect(drawRange(1, 3)).toEqual([0.4, 0.6])
		expect(drawRange(2, 3)).toEqual([0.8, 1])
	})

	it('slides to the next circuit between the draws', () => {
		expect(slideRange(1, 3)).toEqual([0.2, 0.4])
		expect(slideRange(2, 3)).toEqual([0.6, 0.8])
	})

	it('has no slide into the first circuit', () => {
		expect(slideRange(0, 3)).toBeNull()
	})
})

describe('activeIndex', () => {
	it('switches circuit halfway through each slide', () => {
		expect(activeIndex(0, 3)).toBe(0)
		expect(activeIndex(0.29, 3)).toBe(0)
		expect(activeIndex(0.31, 3)).toBe(1)
		expect(activeIndex(0.69, 3)).toBe(1)
		expect(activeIndex(0.71, 3)).toBe(2)
		expect(activeIndex(1, 3)).toBe(2)
	})

	it('handles a single circuit', () => {
		expect(drawRange(0, 1)).toEqual([0, 1])
		expect(activeIndex(0.5, 1)).toBe(0)
	})
})
