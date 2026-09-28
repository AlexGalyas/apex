import { beatOpacity } from './beats'

describe('beatOpacity', () => {
	it('is hidden outside its range', () => {
		expect(beatOpacity(0.2, { from: 0.3, to: 0.6 })).toBe(0)
		expect(beatOpacity(0.7, { from: 0.3, to: 0.6 })).toBe(0)
	})

	it('ramps in after from and out before to', () => {
		expect(beatOpacity(0.325, { from: 0.3, to: 0.6 })).toBeCloseTo(0.5)
		expect(beatOpacity(0.45, { from: 0.3, to: 0.6 })).toBe(1)
		expect(beatOpacity(0.575, { from: 0.3, to: 0.6 })).toBeCloseTo(0.5)
	})

	it('is up from the first frame when it starts at 0', () => {
		expect(beatOpacity(0, { from: 0, to: 0.3 })).toBe(1)
	})

	it('leaves the ending to the overlay when it runs to 1', () => {
		expect(beatOpacity(1, { from: 0.6, to: 1 })).toBe(1)
	})
})
