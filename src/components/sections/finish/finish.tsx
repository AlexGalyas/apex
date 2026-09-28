import { ImageSequence } from '@/components/sequence'

export function Finish() {
	return (
		<section id="finish" aria-labelledby="finish-title">
			<ImageSequence
				scene="finish"
				label="The car stops in heavy rain with steam rising from the brakes"
				length={250}
			>
				<div className="absolute inset-x-0 bottom-16 px-6 md:px-16">
					<h2 id="finish-title" className="font-display text-4xl font-bold md:text-6xl">
						Next race: Tokyo
					</h2>
				</div>
			</ImageSequence>
		</section>
	)
}
