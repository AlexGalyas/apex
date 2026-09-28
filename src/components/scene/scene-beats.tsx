'use client'

import { type ReactNode, useRef } from 'react'

import { useSceneBeats } from '@/hooks/use-scene-beats'
import type { BeatRange } from '@/lib/scene/beats'

export interface Beat extends BeatRange {
	eyebrow?: string
	stat?: string
	text: string
}

interface SceneBeatsProps {
	beats: readonly Beat[]
	/** Places the column in an area of the footage the car never enters. */
	className: string
	/** The edge gradient behind the copy, so it reads over neon and lit walls. */
	scrimClassName: string
	/** Copy that stays put above the beats, e.g. the section title. */
	children?: ReactNode
}

/**
 * Overlay copy over a scrubbed scene: beats replace one another in the same
 * spot as the scene plays. Every beat is in the server HTML; the first one is
 * what shows without JS or with reduced motion.
 */
export function SceneBeats({ beats, className, scrimClassName, children }: SceneBeatsProps) {
	const containerRef = useRef<HTMLDivElement>(null)
	useSceneBeats(containerRef, beats)

	return (
		<div ref={containerRef} className="pointer-events-none absolute inset-0">
			<div
				aria-hidden
				className={`absolute inset-x-0 from-bg/85 to-transparent ${scrimClassName}`}
			/>
			<div className={`absolute flex flex-col gap-4 ${className}`}>
				{children}
				<div className="grid">
					{beats.map((beat, index) => (
						<div
							key={beat.text}
							data-beat
							className={`col-start-1 row-start-1 flex flex-col gap-2 will-change-transform ${index > 0 ? 'motion-reduce:hidden' : ''}`}
							style={index > 0 ? { opacity: 0 } : undefined}
						>
							{beat.eyebrow && (
								<span className="font-mono text-[10px] tracking-[0.3em] text-accent uppercase">
									{beat.eyebrow}
								</span>
							)}
							{beat.stat && (
								<span className="font-display text-2xl font-bold tabular-nums md:text-4xl">
									{beat.stat}
								</span>
							)}
							<p className="max-w-xs text-sm leading-relaxed text-text/85 md:text-base">
								{beat.text}
							</p>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
