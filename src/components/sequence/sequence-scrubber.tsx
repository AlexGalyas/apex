'use client'

import { type CSSProperties, type ReactNode, useRef } from 'react'

import { StageDim } from '@/components/scene/stage-dim'
import { useImageSequence } from '@/hooks/use-image-sequence'
import type { SequenceManifest } from '@/lib/sequence/types'

interface SequenceScrubberProps {
	manifest: SequenceManifest
	length: number
	priority: boolean
	label: string
	zoom?: readonly [number, number]
	overlayFromStart?: boolean
	onProgress?: (progress: number) => void
	children?: ReactNode
}

export function SequenceScrubber({
	manifest,
	length,
	priority,
	label,
	zoom,
	overlayFromStart = false,
	onProgress,
	children
}: SequenceScrubberProps) {
	const triggerRef = useRef<HTMLDivElement>(null)
	const canvasRef = useRef<HTMLCanvasElement>(null)
	const overlayRef = useRef<HTMLDivElement>(null)

	useImageSequence({
		manifest,
		canvasRef,
		triggerRef,
		overlayRef,
		overlayFromStart,
		priority,
		zoom,
		onProgress
	})

	return (
		<div
			ref={triggerRef}
			className="relative h-(--sequence-length) motion-reduce:h-svh"
			style={{ '--sequence-length': `${length}svh` } as CSSProperties}
		>
			<div data-stage className="sticky top-0 h-svh overflow-hidden will-change-transform">
				<canvas
					ref={canvasRef}
					role="img"
					aria-label={label}
					className="absolute inset-0 size-full bg-bg"
				/>
				<div
					ref={overlayRef}
					className="absolute inset-0 motion-reduce:opacity-100!"
					style={{ opacity: overlayFromStart ? 1 : 0 }}
				>
					{children}
				</div>
				<StageDim />
			</div>
		</div>
	)
}
