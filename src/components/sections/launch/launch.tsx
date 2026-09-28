import { type Beat, SceneBeats } from '@/components/scene'
import { ImageSequence } from '@/components/sequence'

const BEATS: Beat[] = [
	{
		from: 0,
		to: 0.32,
		eyebrow: 'Garage exit · 01:40',
		text: 'Doors up. The garage goes dark, the street goes live.'
	},
	{
		from: 0.36,
		to: 0.6,
		stat: '0–100 km/h · 2.9 s',
		text: 'Cold tyres, wet asphalt, no second attempt.'
	},
	{
		from: 0.64,
		to: 1,
		text: 'One run. Seven blocks. Then the city closes behind us.'
	}
]

export function Launch() {
	return (
		<section id="launch" data-rain="0.7" aria-labelledby="launch-title">
			<ImageSequence
				scene="launch"
				label="The car rolls out of the garage onto a wet neon street"
				length={300}
				zoom={[1.12, 1]}
			>
				{/* The car stays in the middle band; the wet floor below it is free. */}
				<SceneBeats
					beats={BEATS}
					className="inset-x-6 bottom-12 md:right-auto md:bottom-16 md:left-16 md:squarish:bottom-8"
					scrimClassName="bottom-0 h-1/2 bg-linear-to-t"
				>
					<h2
						id="launch-title"
						className="font-display text-4xl font-bold md:text-6xl md:squarish:text-4xl"
					>
						Launch
					</h2>
				</SceneBeats>
			</ImageSequence>
		</section>
	)
}
