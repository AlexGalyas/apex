import { ImageSequence } from '@/components/sequence'

import { RaceHud } from './race-hud'

export function Race() {
	return (
		<section id="race" data-rain="0.35" aria-labelledby="race-title">
			<ImageSequence
				scene="race"
				label="Chase camera flying through a neon tunnel at extreme speed"
				length={400}
			>
				<RaceHud />
				<div className="absolute inset-x-0 top-16 px-6 md:px-16">
					<h2 id="race-title" className="font-display text-4xl font-bold md:text-6xl">
						Race
					</h2>
				</div>
			</ImageSequence>
		</section>
	)
}
