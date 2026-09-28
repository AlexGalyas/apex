'use client'

import { useEffect, useState } from 'react'

import { timeLeft, type TimeLeft } from '@/lib/race/time-left'

/** `null` until mounted, so server and first client render agree and nothing hydrates stale. */
export function useCountdown(target: string): TimeLeft | null {
	const [left, setLeft] = useState<TimeLeft | null>(null)

	useEffect(() => {
		const at = Date.parse(target)
		const tick = () => setLeft(timeLeft(at, Date.now()))
		tick()
		const id = setInterval(tick, 1000)
		return () => clearInterval(id)
	}, [target])

	return left
}
