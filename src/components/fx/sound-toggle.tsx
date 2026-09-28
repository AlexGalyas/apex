'use client'

import { useState } from 'react'

import { useEngineSound } from '@/hooks/use-engine-sound'

const BARS = [0.45, 0.8, 0.6, 1]

export function SoundToggle() {
	const [on, setOn] = useState(false)
	useEngineSound(on)

	return (
		<button
			type="button"
			aria-pressed={on}
			onClick={() => setOn((value) => !value)}
			className="fixed bottom-4 left-4 z-50 flex items-center gap-3 border border-text/15 bg-bg/60 scanlines px-3 py-2 font-mono text-[10px] tracking-[0.3em] text-muted uppercase backdrop-blur-sm transition-colors duration-(--apex-duration-fast) hover:border-accent hover:text-text focus-visible:outline focus-visible:outline-accent md:bottom-6 md:left-6"
		>
			<span aria-hidden className="flex h-3 items-end gap-0.5">
				{BARS.map((height, index) => (
					<span
						key={index}
						className={`w-0.5 origin-bottom bg-current ${on ? 'animate-eq text-accent motion-reduce:animate-none' : ''}`}
						style={{ height: `${height * 100}%`, animationDelay: `${index * -0.2}s` }}
					/>
				))}
			</span>
			Sound {on ? 'on' : 'off'}
		</button>
	)
}
