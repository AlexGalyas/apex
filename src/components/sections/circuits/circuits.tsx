'use client'

import { type CSSProperties, useRef } from 'react'

import { StageDim } from '@/components/scene/stage-dim'
import { REEL_SCREENS, useCircuitsReel } from '@/hooks/use-circuits-reel'
import { CIRCUITS } from '@/lib/circuits/circuits'

import { CircuitPanel } from './circuit-panel'

const ACCENTS = CIRCUITS.map((circuit) => circuit.accent)
// One screen to arrive, the reel itself, one screen of tail for the next curtain.
const WRAPPER_SCREENS = 1 + REEL_SCREENS + 1

export function Circuits() {
	const sectionRef = useRef<HTMLElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const trackRef = useRef<HTMLDivElement>(null)

	useCircuitsReel({ sectionRef, wrapperRef, trackRef, accents: ACCENTS })

	return (
		<section
			ref={sectionRef}
			id="circuits"
			aria-labelledby="circuits-title"
			data-accent={ACCENTS[0]}
			className="accent-transition"
		>
			<div
				ref={wrapperRef}
				className="relative h-(--reel-length) motion-reduce:h-auto"
				style={{ '--reel-length': `${WRAPPER_SCREENS * 100}svh` } as CSSProperties}
			>
				<div
					data-stage
					className="sticky top-0 h-svh overflow-hidden bg-bg will-change-transform motion-reduce:static motion-reduce:h-auto"
				>
					<div
						ref={trackRef}
						className="relative h-full motion-reduce:flex motion-reduce:w-full motion-reduce:flex-col md:flex md:w-max"
					>
						{CIRCUITS.map((circuit, index) => (
							<CircuitPanel key={circuit.id} circuit={circuit} first={index === 0} />
						))}
					</div>

					<header className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-6 px-6 pt-8 motion-reduce:hidden md:px-16 md:pt-12">
						<h2
							id="circuits-title"
							className="font-mono text-xs tracking-[0.4em] text-text uppercase"
						>
							Circuits
							<span className="text-muted max-md:hidden"> · NOCTURNE season</span>
						</h2>
						<div className="flex items-center gap-4 font-mono text-xs whitespace-nowrap text-muted tabular-nums">
							<span>
								<span data-reel-counter className="text-accent">
									01
								</span>{' '}
								/ {String(CIRCUITS.length).padStart(2, '0')}
							</span>
							<span className="relative h-px w-24 bg-text/20 md:w-40">
								<span
									data-reel-progress
									className="absolute inset-0 origin-left scale-x-0 bg-accent"
								/>
							</span>
						</div>
					</header>

					<StageDim />
				</div>
			</div>
		</section>
	)
}
