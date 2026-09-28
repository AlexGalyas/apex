'use client'

import { type ReactNode, useRef } from 'react'

import { type SceneEnterMode, useSceneEnter } from '@/hooks/use-scene-enter'

// `continue` overlaps one screen plus the cross-fade (CONTINUE_FADE), so both
// scenes are pinned while it runs; `curtain` overlaps exactly the slide-in.
const OVERLAP: Record<SceneEnterMode, string> = {
	continue: 'motion-safe:-mt-[120svh]',
	curtain:
		'motion-safe:-mt-[100svh] motion-safe:[mask-image:linear-gradient(to_bottom,transparent,black_var(--feather,30svh))]'
}

interface SceneEnterProps {
	mode: SceneEnterMode
	children: ReactNode
}

export function SceneEnter({ mode, children }: SceneEnterProps) {
	const wrapperRef = useRef<HTMLDivElement>(null)
	useSceneEnter(wrapperRef, mode)

	return (
		<div ref={wrapperRef} data-enter={mode} className={`relative ${OVERLAP[mode]}`}>
			{children}
		</div>
	)
}
