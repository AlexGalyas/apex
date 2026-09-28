import { gearFor, rpmRatio, speedFromVelocity } from './gearbox'

// Throttle bites fast, lift-off coasts down slowly.
const ACCELERATE = 0.14
const COAST = 0.035
const VELOCITY_SMOOTHING = 0.25

export interface SpeedReading {
	speed: number
	gear: number
	rpm: number
}

/**
 * Turns successive scroll positions into a car's speed, gear and revs.
 * Shared by the race HUD and the engine sound so they always agree.
 */
export function createScrollSpeed(startTime: number, startY: number) {
	let lastTime = startTime
	let lastY = startY
	let velocity = 0
	let speed = 0
	let gear = 0

	return {
		reset(time: number, y: number) {
			lastTime = time
			lastY = y
			velocity = 0
		},
		sample(time: number, y: number): SpeedReading {
			const dt = Math.max(1, time - lastTime) / 1000
			velocity += ((y - lastY) / dt - velocity) * VELOCITY_SMOOTHING
			lastTime = time
			lastY = y

			const target = speedFromVelocity(velocity)
			speed += (target - speed) * (target > speed ? ACCELERATE : COAST)
			if (speed < 0.5) speed = 0
			gear = gearFor(speed, gear)
			return { speed, gear, rpm: rpmRatio(speed, gear) }
		}
	}
}
