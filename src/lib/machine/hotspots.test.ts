import { type Hotspot, hotspotAt } from './hotspots'

const spot: Hotspot = {
	id: 'test',
	label: 'Test',
	caption: '',
	value: 1,
	decimals: 0,
	unit: '',
	side: 'right',
	from: { frame: 10, x: 0.2, y: 0.4 },
	to: { frame: 20, x: 0.6, y: 0.5 }
}

describe('hotspotAt', () => {
	it('is hidden outside its window', () => {
		expect(hotspotAt(spot, 5).opacity).toBe(0)
		expect(hotspotAt(spot, 25).opacity).toBe(0)
	})

	it('fades in over the first two frames and out over the last two', () => {
		expect(hotspotAt(spot, 10).opacity).toBe(0.5)
		expect(hotspotAt(spot, 11).opacity).toBe(1)
		expect(hotspotAt(spot, 19).opacity).toBe(1)
		expect(hotspotAt(spot, 20).opacity).toBe(0.5)
	})

	it('interpolates the position across the window and clamps outside it', () => {
		expect(hotspotAt(spot, 15)).toMatchObject({ x: 0.4, y: 0.45 })
		expect(hotspotAt(spot, 0)).toMatchObject({ x: 0.2, y: 0.4 })
		expect(hotspotAt(spot, 30)).toMatchObject({ x: 0.6, y: 0.5 })
	})
})
