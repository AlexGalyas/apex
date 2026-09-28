import { ecgPath } from '@/lib/drivers/heart-rate'

const BEATS = 4
// Drawn twice side by side; the strip slides by half its width and loops seamlessly.
const STRIP = ecgPath(BEATS * 2)

export function HeartRate({ bpm, running }: { bpm: number; running: boolean }) {
	return (
		<div className="flex items-end gap-4">
			<div className="relative h-10 flex-1 overflow-hidden">
				<svg
					viewBox={`0 0 ${BEATS * 200} 40`}
					preserveAspectRatio="none"
					className={`absolute inset-y-0 left-0 h-full w-[200%] animate-ecg text-accent motion-reduce:animate-none ${running ? '' : '[animation-play-state:paused]'}`}
					aria-hidden
				>
					<path
						d={STRIP}
						fill="none"
						stroke="currentColor"
						strokeWidth={1.5}
						vectorEffect="non-scaling-stroke"
					/>
				</svg>
			</div>
			<p className="font-mono text-2xl text-text tabular-nums">
				{bpm}
				<span className="ml-1 text-xs text-muted">bpm</span>
			</p>
		</div>
	)
}
