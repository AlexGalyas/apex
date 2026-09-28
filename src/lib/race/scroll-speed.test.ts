import { createScrollSpeed } from './scroll-speed'

describe('createScrollSpeed', () => {
	it('idles in neutral while the page is still', () => {
		const meter = createScrollSpeed(0, 0)
		const reading = meter.sample(1000, 0)
		expect(reading.speed).toBe(0)
		expect(reading.gear).toBe(0)
	})

	it('builds speed and climbs through the gears under a sustained fast scroll', () => {
		const meter = createScrollSpeed(0, 0)
		let reading = meter.sample(16, 60)
		for (let frame = 2; frame <= 120; frame++) reading = meter.sample(frame * 16, frame * 60)
		expect(reading.speed).toBeGreaterThan(250)
		expect(reading.gear).toBeGreaterThanOrEqual(5)
	})

	it('coasts back down once the scrolling stops', () => {
		const meter = createScrollSpeed(0, 0)
		for (let frame = 1; frame <= 120; frame++) meter.sample(frame * 16, frame * 60)
		const fast = meter.sample(121 * 16, 120 * 60).speed
		let reading = meter.sample(122 * 16, 120 * 60)
		for (let frame = 123; frame <= 400; frame++) reading = meter.sample(frame * 16, 120 * 60)
		expect(reading.speed).toBeLessThan(fast / 10)
	})

	it('can be re-anchored so a jump in position is not read as speed', () => {
		const meter = createScrollSpeed(0, 0)
		meter.reset(1000, 50000)
		expect(meter.sample(1016, 50000).speed).toBe(0)
	})
})
