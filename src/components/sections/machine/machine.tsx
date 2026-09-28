import { ImageSequence } from '@/components/sequence'
import { TURNTABLE_HOLD } from '@/lib/machine/hotspots'

import { MachineHotspots } from './machine-hotspots'

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
				<div className="absolute inset-x-0 top-16 px-6 md:px-16">
					<h2 id="machine-title" className="font-display text-4xl font-bold md:text-6xl">
						The Machine
					</h2>
				</div>
			</ImageSequence>
		</section>
	)
}
