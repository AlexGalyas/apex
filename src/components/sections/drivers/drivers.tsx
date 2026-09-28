import { Stage } from '@/components/scene'
import { CAR_NUMBER, DRIVERS } from '@/lib/drivers/drivers'

import { DriverCard } from './driver-card'

export function Drivers() {
	return (
		<section id="drivers" data-rain="0.2" aria-labelledby="drivers-title">
			<Stage className="flex flex-col gap-4 bg-bg px-4 pt-20 pb-4 md:gap-8 md:px-16 md:pt-24 md:pb-12">
				<header className="flex items-end justify-between gap-6">
					<h2 id="drivers-title" className="font-display text-3xl font-bold md:text-6xl">
						Drivers
					</h2>
					<p className="font-mono text-[10px] tracking-[0.3em] text-muted uppercase md:text-xs">
						One car · #{CAR_NUMBER} · two stints
					</p>
				</header>
				<div className="grid min-h-0 flex-1 grid-rows-2 gap-3 md:grid-cols-2 md:grid-rows-1 md:gap-6">
					{DRIVERS.map((driver) => (
						<DriverCard key={driver.id} driver={driver} />
					))}
				</div>
			</Stage>
		</section>
	)
}
