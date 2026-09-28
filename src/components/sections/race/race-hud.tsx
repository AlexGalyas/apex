'use client'

import { useRef } from 'react'

import { useRaceHud } from '@/hooks/use-race-hud'
import { TOP_SPEED } from '@/lib/race/gearbox'

// 270° dial, open at the bottom: from 135° clockwise round to 45°.
const DIAL = 'M24.64 95.36 A50 50 0 1 1 95.36 95.36'
const TICKS = [0, 0.25, 0.5, 0.75, 1]

function tickPosition(ratio: number) {
	const angle = ((135 + ratio * 270) * Math.PI) / 180
	return { x: 60 + Math.cos(angle) * 40, y: 60 + Math.sin(angle) * 40 }
}

export function RaceHud() {
	const hudRef = useRef<HTMLDivElement>(null)
	useRaceHud(hudRef)

	return (
		<div ref={hudRef} className="pointer-events-none absolute inset-0 [--race-speed:0]">
			{/* Edges close in and cool down as speed builds. */}
			<div
				aria-hidden
				className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,var(--apex-bg)_100%)] opacity-(--race-speed)"
			/>

			<div
				aria-hidden
				className="absolute right-4 bottom-6 flex items-end gap-4 font-mono motion-reduce:hidden md:right-16 md:bottom-12"
			>
				<div className="relative size-36 md:size-52">
					<svg viewBox="0 0 120 120" className="size-full">
						<path
							d={DIAL}
							fill="none"
							stroke="currentColor"
							className="text-text/15"
							strokeWidth={6}
							strokeLinecap="round"
						/>
						<path
							data-hud-arc
							d={DIAL}
							pathLength={1}
							strokeDasharray="1 1"
							strokeDashoffset={1}
							fill="none"
							stroke="currentColor"
							className="text-accent drop-shadow-[0_0_6px_var(--apex-accent)]"
							strokeWidth={6}
							strokeLinecap="round"
						/>
						{TICKS.map((ratio) => {
							const { x, y } = tickPosition(ratio)
							return (
								<text
									key={ratio}
									x={x}
									y={y}
									textAnchor="middle"
									dominantBaseline="middle"
									className="fill-muted text-[6px]"
								>
									{Math.round(ratio * TOP_SPEED)}
								</text>
							)
						})}
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
						<span
							data-hud-speed
							className="text-3xl leading-none text-text tabular-nums md:text-5xl"
						>
							000
						</span>
						<span className="text-[10px] tracking-[0.3em] text-muted uppercase">
							km/h
						</span>
					</div>
				</div>

				<div className="flex flex-col items-start gap-2 pb-4">
					<span className="text-[10px] tracking-[0.3em] text-muted uppercase">Gear</span>
					<span
						data-hud-gear
						className="flex size-12 items-center justify-center border border-accent scanlines text-3xl text-accent md:size-16 md:text-4xl"
					>
						N
					</span>
					<span className="mt-2 text-[10px] tracking-[0.3em] text-muted uppercase">
						rpm
					</span>
					<span className="relative h-1 w-20 bg-text/15 md:w-28">
						<span
							data-hud-rpm
							data-redline="false"
							style={{ transform: 'scaleX(0.12)' }}
							className="absolute inset-0 origin-left bg-accent data-[redline=true]:bg-magenta"
						/>
					</span>
				</div>
			</div>
		</div>
	)
}
