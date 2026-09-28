import { ImageSequence } from '@/components/sequence'

export function Hero() {
	return (
		<section id="garage" aria-label="Garage">
			<ImageSequence
				scene="garage"
				label="Lights switch on one by one over the APEX car in a dark garage"
				length={300}
				zoom={[1, 1.12]}
				priority
			>
				<div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
					<h1 className="font-display text-[clamp(4rem,16vw,14rem)] leading-none font-black tracking-[0.2em]">
						APEX
					</h1>
					<p className="font-mono text-sm tracking-[0.4em] text-muted uppercase">
						The night belongs to us
					</p>
				</div>
			</ImageSequence>
		</section>
	)
}
