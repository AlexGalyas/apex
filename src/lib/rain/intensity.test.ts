import { approach } from './intensity'

describe('approach', () => {
	it('moves part of the way toward the target each step', () => {
		expect(approach(0, 1, 0.1)).toBeCloseTo(0.1)
		expect(approach(1, 0, 0.5)).toBeCloseTo(0.5)
	})

	it('snaps once it is close enough, so the loop can go idle', () => {
		expect(approach(0.9995, 1, 0.1)).toBe(1)
		expect(approach(0.0004, 0, 0.1)).toBe(0)
	})
})
