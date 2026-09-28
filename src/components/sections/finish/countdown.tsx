'use client'

import { useCountdown } from '@/hooks/use-countdown'

const UNITS = [
	['days', 'Days'],
	['hours', 'Hrs'],
	['minutes', 'Min'],
	['seconds', 'Sec']
] as const

export function Countdown({ target }: { target: string }) {
	const left = useCountdown(target)

	return (
		<dl className="flex gap-6 font-mono md:gap-10" aria-label="Time until the race starts">
			{UNITS.map(([key, label]) => (
				<div key={key} className="flex flex-col-reverse">
					<dt className="text-xs tracking-[0.3em] text-muted uppercase">{label}</dt>
					<dd className="text-4xl text-text tabular-nums md:text-6xl">
						{left ? String(left[key]).padStart(2, '0') : '--'}
					</dd>
				</div>
			))}
		</dl>
	)
}
