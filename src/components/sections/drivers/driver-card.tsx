'use client'

import Image from 'next/image'
import { type PointerEvent, useId, useState } from 'react'

import { useBpm } from '@/hooks/use-bpm'
import { CAR_NUMBER, type Driver } from '@/lib/drivers/drivers'

import { HeartRate } from './heart-rate'

export function DriverCard({ driver }: { driver: Driver }) {
	const panelId = useId()
	const [hovered, setHovered] = useState(false)
	const [pinned, setPinned] = useState(false)
	const active = hovered || pinned
	const bpm = useBpm(driver.bpm, active)

	// Touch has no hover: a tap toggles the readout instead.
	const onPointerEnter = (event: PointerEvent) => {
		if (event.pointerType === 'mouse') setHovered(true)
	}
	const onPointerLeave = (event: PointerEvent) => {
		if (event.pointerType === 'mouse') setHovered(false)
	}

	return (
		<article
			data-active={active}
			onPointerEnter={onPointerEnter}
			onPointerLeave={onPointerLeave}
			className="group relative isolate min-h-0 overflow-hidden border border-text/10 bg-surface"
		>
			<Image
				src={driver.image}
				alt={driver.imageAlt}
				fill
				sizes="(min-width: 768px) 50vw, 100vw"
				placeholder="blur"
				className="-z-10 object-cover object-[50%_30%] transition-transform duration-(--apex-duration-slow) ease-apex group-data-[active=true]:scale-105"
			/>
			<div
				aria-hidden
				className="absolute inset-0 -z-10 bg-linear-to-t from-bg via-bg/30 to-transparent"
			/>

			<div className="flex h-full flex-col justify-end gap-2 p-5 md:p-8">
				<p className="font-mono text-[10px] tracking-[0.4em] text-accent uppercase md:text-xs">
					#{CAR_NUMBER} · {driver.stint}
				</p>
				<h3 className="font-display text-3xl leading-none font-black md:text-5xl">
					{driver.name}
				</h3>
				<p className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
					{driver.country} · {driver.age}
				</p>
				<button
					type="button"
					aria-expanded={active}
					aria-controls={panelId}
					onClick={() => setPinned((open) => !open)}
					className="mt-2 self-start font-mono text-[10px] tracking-[0.3em] text-text/70 uppercase underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-accent"
				>
					{active ? 'Hide telemetry' : 'Telemetry'}
				</button>
			</div>

			<div
				id={panelId}
				inert={!active}
				className="pointer-events-none absolute inset-0 flex flex-col justify-end gap-5 bg-bg/85 p-5 opacity-0 backdrop-blur-sm transition-opacity duration-(--apex-duration-base) group-data-[active=true]:pointer-events-auto group-data-[active=true]:opacity-100 md:p-8"
			>
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,transparent_0_2px,rgb(255_255_255/0.03)_2px_3px)]"
				/>
				<p className="font-mono text-[10px] tracking-[0.4em] text-accent uppercase md:text-xs">
					Live telemetry · {driver.name}
				</p>
				<p className="max-w-sm text-sm text-muted max-md:hidden">{driver.bio}</p>
				<dl className="grid grid-cols-2 gap-x-6 gap-y-4 font-mono">
					{driver.telemetry.map((item) => (
						<div key={item.label} className="flex flex-col-reverse gap-1">
							<dt className="text-[10px] tracking-[0.3em] text-muted uppercase">
								{item.label}
							</dt>
							<dd className="text-xl text-text tabular-nums md:text-2xl">
								{item.value}
								{item.unit && (
									<span className="ml-1 text-xs text-muted">{item.unit}</span>
								)}
							</dd>
						</div>
					))}
				</dl>
				<HeartRate bpm={bpm} running={active} />
				<button
					type="button"
					onClick={() => {
						setPinned(false)
						setHovered(false)
					}}
					className="self-start font-mono text-[10px] tracking-[0.3em] text-text/70 uppercase md:hidden"
				>
					Close
				</button>
			</div>
		</article>
	)
}
