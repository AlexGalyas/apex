const FADE_IN_END = 0.12
const FADE_OUT_START = 0.85

const clamp01 = (value: number) => Math.min(1, Math.max(0, value))

/** Overlay copy over a scrubbed scene: in over the first stretch, out before the hand-over. */
export function overlayOpacity(progress: number, fadeIn: boolean): number {
	const fadeOut = clamp01((1 - progress) / (1 - FADE_OUT_START))
	if (!fadeIn) return fadeOut
	return Math.min(clamp01(progress / FADE_IN_END), fadeOut)
}
