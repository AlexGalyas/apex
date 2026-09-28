import { type Beat, SceneBeats } from '@/components/scene'
import { ImageSequence } from '@/components/sequence'
import { TURNTABLE_HOLD } from '@/lib/machine/hotspots'

import { MachineHotspots } from './machine-hotspots'

// Scroll progress: the callouts run from ~0.03 to 0.6, the profile holds from 0.7.
const BEATS: Beat[] = [
	{
		from: 0,
		to: 0.22,
		eyebrow: 'Chassis 07',
		text: 'Built, not bought. An S-chassis shell, fourteen months in the garage, every panel hand-fitted.'
	},
	{
		from: 0.62,
		to: 1,
		text: 'One car, one driver, one night a month.'
	}
]

export function Machine() {
	return (
		<section id="machine" data-rain="0.45" aria-labelledby="machine-title">
			<ImageSequence
				scene="turntable"
				label="The car rolls out, turns and stops side-on, showing its profile"
				length={400}
				hold={TURNTABLE_HOLD}
			>
				<MachineHotspots />
				{/* The car never rises above its roofline; phones keep the bottom for spec cards. */}
				<SceneBeats
					beats={BEATS}
					className="inset-x-6 top-16 md:right-auto md:left-16 md:squarish:top-8"
					scrimClassName="top-0 h-2/5 bg-linear-to-b"
				>
					<h2
						id="machine-title"
						className="font-display text-4xl font-bold md:text-6xl md:squarish:text-4xl"
					>
						The Machine
					</h2>
				</SceneBeats>
			</ImageSequence>
		</section>
	)
}
