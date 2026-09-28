import { type Hotspot, hotspotAt } from './hotspots'

const spot: Hotspot = {
	id: 'test',
	label: 'Test',
	caption: '',
	value: 1,
	decimals: 0,
	unit: '',
	side: 'right',
	from: { at: 0.2, x: 0.2, y: 0.4 },
	to: { at: 0.4, x: 0.6, y: 0.5 }
}

describe('hotspotAt', () => {
	it('is hidden outside its window', () => {
		expect(hotspotAt(spot, 0.1).opacity).toBe(0)
		expect(hotspotAt(spot, 0.5).opacity).toBe(0)
	})

	it('fades in and out over the edges of its window', () => {
		expect(hotspotAt(spot, 0.2).opacity).toBe(0)
		expect(hotspotAt(spot, 0.21).opacity).toBeCloseTo(0.5)
		expect(hotspotAt(spot, 0.3).opacity).toBe(1)
		expect(hotspotAt(spot, 0.39).opacity).toBeCloseTo(0.5)
	})

	it('interpolates the position across the window and clamps outside it', () => {
		const middle = hotspotAt(spot, 0.3)
		expect(middle.x).toBeCloseTo(0.4)
		expect(middle.y).toBeCloseTo(0.45)
		expect(hotspotAt(spot, 0)).toMatchObject({ x: 0.2, y: 0.4 })
		expect(hotspotAt(spot, 1)).toMatchObject({ x: 0.6, y: 0.5 })
	})
})
