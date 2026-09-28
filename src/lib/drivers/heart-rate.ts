const MAX_STEP = 3
const MAX_DRIFT = 8

/** Random walk around the driver's base rate; `random` is injected so it can be tested. */
export function nextBpm(current: number, base: number, random: number): number {
	const step = Math.round((random * 2 - 1) * MAX_STEP)
	const next = current + step
	return Math.min(base + MAX_DRIFT, Math.max(base - MAX_DRIFT, next))
}

/** One stylised heartbeat (P wave, QRS spike, T wave) per 100 units on a 40-unit-high baseline. */
const BEAT = [
	'L20 20',
	'Q24 15 28 20',
	'L34 20',
	'L37 25',
	'L41 3',
	'L45 36',
	'L48 20',
	'L60 20',
	'Q66 12 72 20',
	'L100 20'
]

export function ecgPath(beats: number): string {
	const segments = Array.from({ length: beats }, (_, beat) =>
		BEAT.map((segment) =>
			segment.replace(
				/(-?\d+(?:\.\d+)?) (-?\d+(?:\.\d+)?)/g,
				(_, x: string, y: string) => `${Number(x) + beat * 100} ${y}`
			)
		).join(' ')
	)
	return `M0 20 ${segments.join(' ')}`
}
