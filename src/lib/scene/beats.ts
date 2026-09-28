/** A line of overlay copy shown over one stretch of a scene's scroll (0..1). */
export interface BeatRange {
	from: number
	to: number
}

const RAMP = 0.05

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/**
 * Opacity of a beat at `progress`: it ramps in after `from` and out before `to`.
 * A beat starting at 0 is already up when the overlay fades in, and one ending
 * at 1 leaves the fade-out to the overlay (`overlayOpacity`).
 */
export function beatOpacity(progress: number, { from, to }: BeatRange): number {
	const fadeIn = from <= 0 ? 1 : clamp01((progress - from) / RAMP)
	const fadeOut = to >= 1 ? 1 : clamp01((to - progress) / RAMP)
	return progress < from || progress > to ? 0 : Math.min(fadeIn, fadeOut)
}
