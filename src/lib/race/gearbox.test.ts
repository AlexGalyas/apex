import { gearFor, rpmRatio, speedFromVelocity, TOP_SPEED } from './gearbox'

describe('speedFromVelocity', () => {
	it('maps scroll speed in either direction to road speed', () => {
		expect(speedFromVelocity(0)).toBe(0)
		expect(speedFromVelocity(1000)).toBeCloseTo(speedFromVelocity(-1000))
		expect(speedFromVelocity(1000)).toBeGreaterThan(speedFromVelocity(400))
	})

	it('tops out at the car top speed', () => {
		expect(speedFromVelocity(100000)).toBe(TOP_SPEED)
	})
})

describe('gearFor', () => {
	it('is neutral when crawling', () => {
		expect(gearFor(2, 1)).toBe(0)
	})

	it('shifts up past the top of the current band', () => {
		expect(gearFor(65, 1)).toBe(2)
		expect(gearFor(330, 5)).toBe(6)
	})

	it('holds a gear inside the overlap instead of hunting', () => {
		expect(gearFor(55, 2)).toBe(2)
		expect(gearFor(55, 1)).toBe(1)
	})

	it('shifts down below the bottom of the current band', () => {
		expect(gearFor(40, 2)).toBe(1)
	})

	it('can skip gears on a big jump', () => {
		expect(gearFor(250, 1)).toBe(5)
	})
})

describe('rpmRatio', () => {
	it('idles in neutral', () => {
		expect(rpmRatio(0, 0)).toBeCloseTo(0.12)
	})

	it('climbs through each band and drops after a shift', () => {
		expect(rpmRatio(10, 1)).toBeLessThan(rpmRatio(55, 1))
		expect(rpmRatio(60, 1)).toBeCloseTo(1)
		expect(rpmRatio(60, 2)).toBeLessThan(0.6)
	})
})
