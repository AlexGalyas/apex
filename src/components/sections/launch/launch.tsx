import { ImageSequence } from '@/components/sequence'

export function Launch() {
	return (
		<section id="launch" data-rain="0.7" aria-labelledby="launch-title">
			<ImageSequence
				scene="launch"
				label="The car rolls out of the garage onto a wet neon street"
				length={300}
				zoom={[1.12, 1]}
			>
				<div className="absolute inset-x-0 bottom-16 px-6 md:px-16">
					<h2 id="launch-title" className="font-display text-4xl font-bold md:text-6xl">
						Launch
					</h2>
				</div>
			</ImageSequence>
		</section>
	)
}
