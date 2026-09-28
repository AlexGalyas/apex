/**
 * Spec callouts pinned to the car in the turntable footage. Positions are
 * fractions of the source frame; `at` is the scene's scroll progress (0..1),
 * so the data survives re-cutting the video at a different fps. Each hotspot
 * is measured at the start and end of its window and interpolated between,
 * so a dot rides the body as the car turns.
 */
export interface HotspotKey {
	at: number
	x: number
	y: number
}

export interface Hotspot {
	id: string
	label: string
	caption: string
	value: number
	decimals: number
	unit: string
	side: 'left' | 'right'
	from: HotspotKey
	to: HotspotKey
}

/** Aspect of the turntable source these were measured on (Kling 5 s, upscaled). */
export const TURNTABLE_ASPECT = 1928 / 1076
/**
 * The car's final profile holds for the last 30% of the scroll while Circuits
 * slides over it. `at` values are footage progress, so the hook applies the
 * same hold.
 */
export const TURNTABLE_HOLD = 0.3

export const HOTSPOTS: Hotspot[] = [
	{
		id: 'aero',
		label: 'Front splitter',
		caption: 'Downforce at 250 km/h',
		value: 1120,
		decimals: 0,
		unit: 'kg',
		side: 'right',
		from: { at: 0.04, x: 0.59, y: 0.61 },
		to: { at: 0.2, x: 0.51, y: 0.6 }
	},
	{
		id: 'engine',
		label: 'Twin-turbo I6',
		caption: '2.6 L · 9,200 rpm',
		value: 720,
		decimals: 0,
		unit: 'hp',
		side: 'left',
		from: { at: 0.22, x: 0.49, y: 0.43 },
		to: { at: 0.38, x: 0.4, y: 0.43 }
	},
	{
		id: 'tyres',
		label: 'Deep-dish wheels',
		caption: 'Rear tyre width',
		value: 295,
		decimals: 0,
		unit: 'mm',
		side: 'right',
		from: { at: 0.4, x: 0.58, y: 0.63 },
		to: { at: 0.56, x: 0.44, y: 0.59 }
	},
	{
		id: 'top-speed',
		label: 'Top speed',
		caption: 'Tokyo, Neon Loop',
		value: 318,
		decimals: 0,
		unit: 'km/h',
		side: 'left',
		from: { at: 0.52, x: 0.56, y: 0.5 },
		to: { at: 0.7, x: 0.51, y: 0.51 }
	},
	{
		id: 'wing',
		label: 'Swan-neck wing',
		caption: '0–100 km/h',
		value: 2.9,
		decimals: 1,
		unit: 's',
		side: 'left',
		from: { at: 0.62, x: 0.81, y: 0.29 },
		to: { at: 0.8, x: 0.83, y: 0.3 }
	},
	{
		id: 'weight',
		label: 'Dry weight',
		caption: 'Carbon body panels',
		value: 1180,
		decimals: 0,
		unit: 'kg',
		side: 'right',
		from: { at: 0.73, x: 0.5, y: 0.51 },
		to: { at: 0.85, x: 0.49, y: 0.51 }
	}
]

const FADE = 0.02

/** Where a hotspot sits (source fractions) and how visible it is at a given progress. */
export function hotspotAt(hotspot: Hotspot, progress: number) {
	const { from, to } = hotspot
	const t = Math.min(1, Math.max(0, (progress - from.at) / (to.at - from.at)))
	const edge = Math.min(progress - from.at, to.at - progress) / FADE
	const opacity = Math.min(1, Math.max(0, edge))
	return {
		x: from.x + (to.x - from.x) * t,
		y: from.y + (to.y - from.y) * t,
		opacity
	}
}
