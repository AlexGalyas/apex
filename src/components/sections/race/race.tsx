import { type Beat, SceneBeats } from '@/components/scene'
import { ImageSequence } from '@/components/sequence'

import { RaceHud } from './race-hud'

const BEATS: Beat[] = [
	{
		from: 0,
		to: 0.32,
		eyebrow: 'Tunnel · closed at 02:00',
		text: 'Seven blocks of closed tunnel. Lights off at the exit.'
	},
	{
		from: 0.36,
		to: 0.6,
		stat: '4.2 km · 7 turns · 1 rule',
		text: 'Nobody brakes first.'
	},
	{
		from: 0.64,
		to: 1,
		text: 'Lose the lights, keep the line.'
	}
]

export function Race() {
	return (
		<section id="race" data-rain="0.35" aria-labelledby="race-title">
			<ImageSequence
				scene="race"
				label="Chase camera flying through a neon tunnel at extreme speed"
				length={400}
			>
				<RaceHud />
				{/* Opposite the speedometer on desktop; on phones the gauge fills the
				    bottom, so the copy moves up under the title. */}
				<SceneBeats
					beats={BEATS}
					className="inset-x-6 top-36 md:top-auto md:right-auto md:bottom-12 md:left-16"
					scrimClassName="top-0 h-2/5 bg-linear-to-b md:top-auto md:bottom-0 md:bg-linear-to-t"
				/>
				<div className="absolute inset-x-0 top-16 px-6 md:px-16">
					<h2 id="race-title" className="font-display text-4xl font-bold md:text-6xl">
						Race
					</h2>
				</div>
			</ImageSequence>
		</section>
	)
}
