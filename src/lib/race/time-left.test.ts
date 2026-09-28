import { timeLeft } from './time-left'

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR

describe('timeLeft', () => {
	it('splits the remaining time into days, hours, minutes and seconds', () => {
		const now = 0
		const target = 3 * DAY + 4 * HOUR + 5 * MINUTE + 6 * SECOND + 500
		expect(timeLeft(target, now)).toEqual({
			days: 3,
			hours: 4,
			minutes: 5,
			seconds: 6,
			done: false
		})
	})

	it('reports done at and after the start time', () => {
		const zero = { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
		expect(timeLeft(1000, 1000)).toEqual(zero)
		expect(timeLeft(1000, 5000)).toEqual(zero)
	})
})
