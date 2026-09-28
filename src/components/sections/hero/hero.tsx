import { ImageSequence } from '@/components/sequence'

import { HeroTitle } from './hero-title'

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
					<p className="font-mono text-sm tracking-[0.4em] text-muted uppercase">
						The night belongs to us
					</p>
				</div>
			</ImageSequence>
		</section>
	)
}
