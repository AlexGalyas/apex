import type { ReactNode } from 'react'

import { getManifest } from '@/lib/sequence/get-manifest'

import { SequenceScrubber } from './sequence-scrubber'

interface ImageSequenceProps {
	scene: string
	label: string
	/** Scroll distance the scrub spans, in viewport heights. */
	length?: number
	/** Preload every frame on mount instead of when the section comes near. */
	priority?: boolean
	/** Canvas scale at the start and end of the scrub, e.g. [1, 1.12] for a push-in. */
	zoom?: readonly [number, number]
	children?: ReactNode
}

export async function ImageSequence({
	scene,
	label,
	length = 300,
	priority = false,
	zoom,
	children
}: ImageSequenceProps) {
	const manifest = await getManifest(scene)

	if (!manifest) {
		return (
			<div
				className="relative h-svh overflow-hidden bg-surface"
				role="img"
				aria-label={label}
			>
				{children}
			</div>
		)
	}

	return (
		<SequenceScrubber
			manifest={manifest}
			length={length}
			priority={priority}
			label={label}
			zoom={zoom}
		>
			{children}
		</SequenceScrubber>
	)
}
