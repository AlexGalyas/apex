import type { StaticImageData } from 'next/image'

import kaiMori from '@/assets/drivers/kai-mori.webp'
import lenaVoss from '@/assets/drivers/lena-voss.webp'

export interface Telemetry {
	label: string
	value: string
	unit?: string
}

export interface Driver {
	id: string
	name: string
	country: string
	age: number
	stint: string
	bio: string
	image: StaticImageData
	imageAlt: string
	/** Resting race heart rate the live readout wanders around. */
	bpm: number
	telemetry: Telemetry[]
}

export const CAR_NUMBER = '07'

export const DRIVERS: Driver[] = [
	{
		id: 'kai-mori',
		name: 'Kai Mori',
		country: 'Japan',
		age: 27,
		stint: 'Night stint',
		bio: 'Grew up on the Wangan after midnight. Takes the car from dusk to 3 a.m.',
		image: kaiMori,
		imageAlt: 'Kai Mori in a matte black helmet, visor reflecting cyan and magenta neon',
		bpm: 156,
		telemetry: [
			{ label: 'Top speed', value: '318', unit: 'km/h' },
			{ label: 'Reaction', value: '0.182', unit: 's' },
			{ label: 'Best lap', value: '1:48.317' },
			{ label: 'Wins / podiums', value: '6 / 14' }
		]
	},
	{
		id: 'lena-voss',
		name: 'Lena Voss',
		country: 'Germany',
		age: 29,
		stint: 'Dawn stint',
		bio: 'Former rally co-driver. Brings the car home through the last, coldest hours.',
		image: lenaVoss,
		imageAlt: 'Lena Voss in a matte black helmet with a magenta pinstripe, gold visor',
		bpm: 148,
		telemetry: [
			{ label: 'Top speed', value: '309', unit: 'km/h' },
			{ label: 'Reaction', value: '0.176', unit: 's' },
			{ label: 'Best lap', value: '1:14.902' },
			{ label: 'Wins / podiums', value: '4 / 17' }
		]
	}
]
