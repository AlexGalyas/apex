export const TOP_SPEED = 318

/** Scroll px/s at which the car hits top speed. */
const VELOCITY_AT_TOP = 4000
const NEUTRAL_BELOW = 5
const IDLE_RPM = 0.12
const SHIFT_RPM_FLOOR = 0.35

/** [low, high] km/h per gear; neighbours overlap so a gear holds instead of hunting. */
const BANDS: ReadonlyArray<readonly [number, number]> = [
	[0, 60],
	[45, 110],
	[95, 165],
	[150, 220],
	[205, 275],
	[260, TOP_SPEED]
]

export function speedFromVelocity(velocity: number): number {
	const ratio = Math.min(1, Math.abs(velocity) / VELOCITY_AT_TOP)
	// Ease-out so a gentle scroll already reads as moving.
	return Math.round(TOP_SPEED * (1 - (1 - ratio) ** 2))
}

/** 0 is neutral, 1–6 the gears. */
export function gearFor(speed: number, current: number): number {
	if (speed < NEUTRAL_BELOW) return 0

	let gear = Math.max(1, current)
	while (gear < BANDS.length && speed > BANDS[gear - 1][1]) gear++
	while (gear > 1 && speed < BANDS[gear - 1][0]) gear--
	return gear
}

/** Tachometer needle, 0..1. */
export function rpmRatio(speed: number, gear: number): number {
	if (gear === 0) return IDLE_RPM
	const [low, high] = BANDS[gear - 1]
	const t = Math.min(1, Math.max(0, (speed - low) / (high - low)))
	return SHIFT_RPM_FLOOR + (1 - SHIFT_RPM_FLOOR) * t
}
