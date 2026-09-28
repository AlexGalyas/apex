const SNAP = 0.001

export function approach(current: number, target: number, rate: number): number {
	const next = current + (target - current) * rate
	if (Math.abs(target - next) < SNAP) return target
	return next
}
