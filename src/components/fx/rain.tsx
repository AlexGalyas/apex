'use client'

import { useRef } from 'react'

import { useRain } from '@/hooks/use-rain'

export function Rain() {
	const canvasRef = useRef<HTMLCanvasElement>(null)
	useRain(canvasRef)

	return (
		<canvas
			ref={canvasRef}
			aria-hidden
			className="pointer-events-none fixed inset-0 z-40 size-full motion-reduce:hidden"
		/>
	)
}
