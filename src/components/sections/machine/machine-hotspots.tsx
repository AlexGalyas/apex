'use client'

import { useRef } from 'react'

import { useMachineHotspots } from '@/hooks/use-machine-hotspots'
import { HOTSPOTS } from '@/lib/machine/hotspots'

export function MachineHotspots() {
	const containerRef = useRef<HTMLDivElement>(null)
	useMachineHotspots(containerRef)

	return (
		<div ref={containerRef} className="pointer-events-none absolute inset-0">
			<div aria-hidden className="motion-reduce:hidden max-md:hidden">
				{HOTSPOTS.map((hotspot) => {
					const right = hotspot.side === 'right'
					return (
						<div
							key={hotspot.id}
							data-hotspot
							className="absolute top-0 left-0 opacity-0 will-change-transform"
						>
							<span className="absolute size-3 -translate-1/2 rounded-full bg-accent shadow-[0_0_16px_var(--apex-accent)]" />
							<span className="absolute size-3 -translate-1/2 animate-ping rounded-full bg-accent/60" />
							<span
								className={`absolute top-0 h-px w-20 bg-linear-to-r from-accent to-accent/20 ${right ? 'left-2' : 'right-2 rotate-180'}`}
							/>
							<div
								className={`absolute top-0 flex w-56 -translate-y-1/2 flex-col gap-1 font-mono ${right ? 'left-24' : 'right-24 items-end text-right'}`}
							>
								<span className="text-[10px] tracking-[0.3em] text-accent uppercase">
									{hotspot.label}
								</span>
								<span className="text-3xl text-text tabular-nums">
									<span data-hotspot-value={hotspot.id}>0</span>
									<span className="ml-1 text-sm text-muted">{hotspot.unit}</span>
								</span>
								<span className="text-[10px] tracking-[0.2em] text-muted uppercase">
									{hotspot.caption}
								</span>
							</div>
						</div>
					)
				})}
			</div>

			<div
				aria-hidden
				className="absolute inset-x-4 bottom-6 flex flex-col-reverse gap-2 motion-reduce:hidden md:right-auto md:bottom-12 md:left-16 md:w-96"
			>
				{HOTSPOTS.map((hotspot) => (
					<div
						key={hotspot.id}
						data-hotspot-card
						style={{ display: 'none' }}
						className="flex h-20 items-center gap-4 border-l-2 border-accent bg-bg/70 scanlines px-4 font-mono opacity-0 backdrop-blur-sm"
					>
						<span className="text-3xl text-text tabular-nums">
							<span data-hotspot-value={hotspot.id}>0</span>
							<span className="ml-1 text-sm text-muted">{hotspot.unit}</span>
						</span>
						<span className="flex flex-col gap-1">
							<span className="text-[10px] tracking-[0.3em] text-accent uppercase">
								{hotspot.label}
							</span>
							<span className="text-[10px] tracking-[0.2em] text-muted uppercase">
								{hotspot.caption}
							</span>
						</span>
					</div>
				))}
			</div>

			<dl className="sr-only motion-reduce:not-sr-only motion-reduce:absolute motion-reduce:inset-x-6 motion-reduce:bottom-8 motion-reduce:grid motion-reduce:grid-cols-2 motion-reduce:gap-4 motion-reduce:font-mono md:motion-reduce:grid-cols-3">
				{HOTSPOTS.map((hotspot) => (
					<div key={hotspot.id} className="flex flex-col-reverse">
						<dt className="text-[10px] tracking-[0.3em] text-accent uppercase">
							{hotspot.label}
						</dt>
						<dd className="text-2xl text-text">
							{hotspot.value.toFixed(hotspot.decimals)} {hotspot.unit}
						</dd>
					</div>
				))}
			</dl>
		</div>
	)
}
