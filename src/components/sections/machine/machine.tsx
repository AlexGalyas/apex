import { ImageSequence } from '@/components/sequence'

import { MachineHotspots } from './machine-hotspots'

export function Machine() {
	return (
		<section id="machine" aria-labelledby="machine-title">
			<ImageSequence
				scene="turntable"
				label="The car rotates a full 360 degrees"
				length={400}
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
