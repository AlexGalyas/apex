import { overlayOpacity } from './fades'

describe('overlayOpacity', () => {
	it('fades in over the opening stretch when asked to', () => {
		expect(overlayOpacity(0, true)).toBe(0)
		expect(overlayOpacity(0.06, true)).toBeCloseTo(0.5)
		expect(overlayOpacity(0.12, true)).toBe(1)
	})

	it('is fully visible from the start otherwise', () => {
		expect(overlayOpacity(0, false)).toBe(1)
	})

	it('fades out before the scene hands over', () => {
		expect(overlayOpacity(0.5, true)).toBe(1)
		expect(overlayOpacity(0.85, false)).toBe(1)
		expect(overlayOpacity(0.925, false)).toBeCloseTo(0.5)
		expect(overlayOpacity(1, false)).toBe(0)
	})
})
