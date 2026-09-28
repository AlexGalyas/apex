export interface TimeLeft {
	days: number
	hours: number
	minutes: number
	seconds: number
	done: boolean
}

export function timeLeft(target: number, now: number): TimeLeft {
	const remaining = Math.max(0, target - now)
	const totalSeconds = Math.floor(remaining / 1000)
	return {
		days: Math.floor(totalSeconds / 86400),
		hours: Math.floor(totalSeconds / 3600) % 24,
		minutes: Math.floor(totalSeconds / 60) % 60,
		seconds: totalSeconds % 60,
		done: remaining === 0
	}
}
