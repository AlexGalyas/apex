/**
 * Spec callouts pinned to the car in the turntable footage. Positions are
 * fractions of the source frame, measured on the first and last frame of each
 * window and interpolated in between, so a dot rides the body as it turns.
 */
export interface HotspotKey {
	frame: number
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

/** The turntable sequence these were measured on (1928×1076 source, 121 frames). */
export const TURNTABLE_FRAMES = 121
export const TURNTABLE_ASPECT = 1920 / 1072

export const HOTSPOTS: Hotspot[] = [
	{
		id: 'aero',
		label: 'Front splitter',
		caption: 'Downforce at 250 km/h',
		value: 1120,
		decimals: 0,
		unit: 'kg',
		side: 'right',
		from: { frame: 18, x: 0.52, y: 0.62 },
		to: { frame: 30, x: 0.41, y: 0.63 }
	},
	{
		id: 'engine',
		label: 'Twin-turbo I6',
		caption: '2.6 L · 9,200 rpm',
		value: 720,
		decimals: 0,
		unit: 'hp',
		side: 'left',
		from: { frame: 38, x: 0.18, y: 0.46 },
		to: { frame: 50, x: 0.1, y: 0.44 }
	},
	{
		id: 'weight',
		label: 'Dry weight',
		caption: 'Carbon body panels',
		value: 1180,
		decimals: 0,
		unit: 'kg',
		side: 'right',
		from: { frame: 38, x: 0.55, y: 0.5 },
		to: { frame: 50, x: 0.34, y: 0.5 }
	},
	{
		id: 'wing',
		label: 'Swan-neck wing',
		caption: '0–100 km/h',
		value: 2.9,
		decimals: 1,
		unit: 's',
		side: 'right',
		from: { frame: 60, x: 0.57, y: 0.24 },
		to: { frame: 70, x: 0.25, y: 0.26 }
	},
	{
		id: 'tyres',
		label: 'Deep-dish wheels',
		caption: 'Rear tyre width',
		value: 295,
		decimals: 0,
		unit: 'mm',
		side: 'right',
		from: { frame: 80, x: 0.72, y: 0.57 },
		to: { frame: 92, x: 0.56, y: 0.58 }
	},
	{
		id: 'top-speed',
		label: 'Top speed',
		caption: 'Tokyo, Neon Loop',
		value: 318,
		decimals: 0,
		unit: 'km/h',
		side: 'left',
		from: { frame: 80, x: 0.57, y: 0.5 },
		to: { frame: 92, x: 0.44, y: 0.5 }
	}
]

const FADE_FRAMES = 2

/** Where a hotspot sits (source fractions) and how visible it is on a given frame. */
export function hotspotAt(hotspot: Hotspot, frame: number) {
	const { from, to } = hotspot
	const span = to.frame - from.frame
	const t = Math.min(1, Math.max(0, (frame - from.frame) / span))
	const fadeIn = (frame - from.frame + 1) / FADE_FRAMES
	const fadeOut = (to.frame - frame + 1) / FADE_FRAMES
	const opacity = Math.min(1, Math.max(0, Math.min(fadeIn, fadeOut)))
	return {
		x: from.x + (to.x - from.x) * t,
		y: from.y + (to.y - from.y) * t,
		opacity
	}
}
