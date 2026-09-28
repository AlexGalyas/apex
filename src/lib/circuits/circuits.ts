import type { StaticImageData } from 'next/image'

import dubai from '@/assets/circuits/dubai.webp'
import monaco from '@/assets/circuits/monaco.webp'
import tokyo from '@/assets/circuits/tokyo.webp'

import { type Track, TRACKS } from './tracks'

export type Accent = 'magenta' | 'cyan' | 'gold'

export interface CircuitStat {
	label: string
	value: number
	decimals: number
	unit?: string
}

export interface Circuit {
	id: keyof typeof TRACKS
	round: number
	city: string
	country: string
	name: string
	date: string
	accent: Accent
	image: StaticImageData
	imageAlt: string
	track: Track
	stats: CircuitStat[]
	lapRecord: string
}

export const CIRCUITS: Circuit[] = [
	{
		id: 'tokyo',
		round: 1,
		city: 'Tokyo',
		country: 'Japan',
		name: 'Neon Loop',
		date: '14 Nov',
		accent: 'magenta',
		image: tokyo,
		imageAlt: 'Rain-soaked Tokyo streets under elevated expressways, lit magenta',
		track: TRACKS.tokyo,
		stats: [
			{ label: 'Length', value: 4.82, decimals: 2, unit: 'km' },
			{ label: 'Turns', value: 17, decimals: 0 },
			{ label: 'Top speed', value: 287, decimals: 0, unit: 'km/h' }
		],
		lapRecord: '1:48.317'
	},
	{
		id: 'monaco',
		round: 2,
		city: 'Monaco',
		country: 'Monaco',
		name: 'Harbour Run',
		date: '05 Dec',
		accent: 'cyan',
		image: monaco,
		imageAlt: 'A harbour town at night with yacht lights and a seafront tunnel in the rain',
		track: TRACKS.monaco,
		stats: [
			{ label: 'Length', value: 3.34, decimals: 2, unit: 'km' },
			{ label: 'Turns', value: 21, decimals: 0 },
			{ label: 'Top speed', value: 262, decimals: 0, unit: 'km/h' }
		],
		lapRecord: '1:14.902'
	},
	{
		id: 'dubai',
		round: 3,
		city: 'Dubai',
		country: 'UAE',
		name: 'Gold Mile',
		date: '09 Jan',
		accent: 'gold',
		image: dubai,
		imageAlt: 'A multi-lane highway between glass towers glowing gold through the rain',
		track: TRACKS.dubai,
		stats: [
			{ label: 'Length', value: 5.61, decimals: 2, unit: 'km' },
			{ label: 'Turns', value: 12, decimals: 0 },
			{ label: 'Top speed', value: 318, decimals: 0, unit: 'km/h' }
		],
		lapRecord: '1:39.054'
	}
]
