'use client'

import { type CSSProperties, type ReactNode, useRef } from 'react'

import { useImageSequence } from '@/hooks/use-image-sequence'
import type { SequenceManifest } from '@/lib/sequence/types'

interface SequenceScrubberProps {
	manifest: SequenceManifest
	length: number
	priority: boolean
	label: string
	onProgress?: (progress: number) => void
	children?: ReactNode
}

export function SequenceScrubber({
	manifest,
	length,
	priority,
	label,
	onProgress,
	children
}: SequenceScrubberProps) {
	const triggerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)

	useImageSequence({ manifest, canvasRef, triggerRef, priority, onProgress })

	return (
		<div
			ref={triggerRef}
			className="relative h-(--sequence-length) motion-reduce:h-svh"
			style={{ '--sequence-length': `${length}svh` } as CSSProperties}
		>
			<div className="sticky top-0 h-svh overflow-hidden">
				<canvas
					ref={canvasRef}
					role="img"
					aria-label={label}
					className="absolute inset-0 size-full bg-bg"
				/>
				{children}
			</div>
		</div>
	)
}
