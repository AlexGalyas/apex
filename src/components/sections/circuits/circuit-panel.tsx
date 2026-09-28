import Image from 'next/image'

import type { Circuit } from '@/lib/circuits/circuits'

interface CircuitPanelProps {
	circuit: Circuit
	first: boolean
}

export function CircuitPanel({ circuit, first }: CircuitPanelProps) {
	const { accent, round, city, country, name, date, image, imageAlt, track, stats, lapRecord } =
		circuit

	return (
		<article
			data-panel
			data-accent={accent}
			aria-label={`Round ${round}: ${city}`}
			className={`absolute inset-0 overflow-hidden bg-bg motion-reduce:relative motion-reduce:h-svh md:relative md:h-full md:w-screen md:shrink-0 ${first ? '' : 'max-md:motion-safe:invisible'}`}
		>
			<div data-parallax className="absolute -inset-x-[8%] inset-y-0">
				<Image
					src={image}
					alt={imageAlt}
					fill
					sizes="120vw"
					placeholder="blur"
					className="object-cover"
				/>
			</div>
			<div
				aria-hidden
				className="absolute inset-0 bg-linear-to-t from-bg via-bg/50 to-bg/10 md:bg-linear-to-r md:from-bg md:via-bg/60 md:to-transparent"
			/>

			<div className="relative flex h-full flex-col justify-end gap-8 px-6 pt-24 pb-10 md:grid md:grid-cols-[1fr_minmax(0,420px)] md:items-center md:gap-16 md:px-16 md:pb-0">
				<div className="flex flex-col gap-4">
					<p className="font-mono text-xs tracking-[0.4em] text-accent uppercase">
						Round {String(round).padStart(2, '0')} · {date}
					</p>
					<h3 className="font-display text-[clamp(3.5rem,11vw,10rem)] leading-[0.9] font-black tracking-tight">
						{city}
					</h3>
					<p className="font-mono text-sm tracking-[0.2em] text-muted uppercase">
						{name} — {country}
					</p>
				</div>

				<div className="flex flex-col gap-6 md:gap-10">
					<svg
						viewBox={track.viewBox}
						className="h-32 w-full text-accent drop-shadow-[0_0_12px_var(--apex-accent)] md:h-56"
						aria-hidden
					>
						<path
							d={track.path}
							fill="none"
							stroke="currentColor"
							strokeOpacity={0.15}
							strokeWidth={6}
							strokeLinejoin="round"
						/>
						<path
							data-track
							d={track.path}
							pathLength={1}
							fill="none"
							stroke="currentColor"
							strokeWidth={3}
							strokeLinejoin="round"
							strokeLinecap="round"
							strokeDasharray="1 1"
						/>
					</svg>

					<dl className="grid grid-cols-3 gap-4 border-t border-text/15 pt-5 font-mono">
						{stats.map((stat) => (
							<div key={stat.label} className="flex flex-col-reverse gap-1">
								<dt className="text-[10px] tracking-[0.3em] text-muted uppercase">
									{stat.label}
								</dt>
								<dd className="text-2xl text-text tabular-nums md:text-3xl">
									<span data-count={stat.value} data-decimals={stat.decimals}>
										{stat.value.toFixed(stat.decimals)}
									</span>
									{stat.unit && (
										<span className="ml-1 text-xs text-muted">{stat.unit}</span>
									)}
								</dd>
							</div>
						))}
					</dl>
					<p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
						Lap record <span className="ml-2 text-base text-accent">{lapRecord}</span>
					</p>
				</div>
			</div>
		</article>
	)
}
