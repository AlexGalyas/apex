import type { ReactNode } from 'react'

import { StageDim } from './stage-dim'

interface StageProps {
	children: ReactNode
	className?: string
}

/**
 * Pins a one-screen section for an extra screen of scroll, so the next scene
 * has something to slide over instead of both scrolling past together.
 */
export function Stage({ children, className = '' }: StageProps) {
	return (
		<div className="relative h-[200svh] motion-reduce:h-auto">
			<div
				data-stage
				className={`sticky top-0 h-svh overflow-hidden will-change-transform ${className}`}
			>
				{children}
				<StageDim />
			</div>
		</div>
	)
}
