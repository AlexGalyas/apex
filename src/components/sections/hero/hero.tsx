import { ImageSequence } from '@/components/sequence'

import { HeroTitle } from './hero-title'
import { ScrollCue } from './scroll-cue'

export function Hero() {
	return (
		<section id="garage" data-rain="0.12" aria-label="Garage">
			<ImageSequence
				scene="garage"
				label="Lights switch on one by one over the APEX car in a dark garage"
				length={300}
				zoom={[1, 1.12]}
				overlayFromStart
				priority
			>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
					<HeroTitle />
					<p className="px-10 text-center font-mono text-xs tracking-[0.3em] text-muted uppercase md:text-sm md:tracking-[0.4em]">
						The night belongs to us
					</p>
				</div>
				<ScrollCue />
			</ImageSequence>
		</section>
	)
}
