import { ecgPath, nextBpm } from './heart-rate'

describe('nextBpm', () => {
	it('drifts by at most three beats per tick', () => {
		expect(nextBpm(150, 150, 0)).toBe(147)
		expect(nextBpm(150, 150, 0.5)).toBe(150)
		expect(nextBpm(150, 150, 0.999)).toBe(153)
	})

	it('stays within eight beats of the base rate', () => {
		expect(nextBpm(158, 150, 0.999)).toBe(158)
		expect(nextBpm(142, 150, 0)).toBe(142)
	})
})

describe('ecgPath', () => {
	it('repeats one heartbeat per 100 units and starts on the baseline', () => {
		const path = ecgPath(2)
		expect(path.startsWith('M0 20')).toBe(true)
		expect(path).toContain('L100 20')
		expect(path.endsWith('L200 20')).toBe(true)
	})
})
