'use client'

import { useEffect, useState } from 'react'

import { nextBpm } from '@/lib/drivers/heart-rate'

const TICK_MS = 900

/** A live-looking heart rate that only ticks while the readout is on screen. */
export function useBpm(base: number, active: boolean): number {
	const [bpm, setBpm] = useState(base)

	useEffect(() => {
		if (!active) return
		const id = setInterval(
			() => setBpm((current) => nextBpm(current, base, Math.random())),
			TICK_MS
		)
		return () => clearInterval(id)
	}, [active, base])

	return bpm
}
