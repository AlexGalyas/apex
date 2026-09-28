'use client'

import { useRef } from 'react'

import { useScrollGuide } from '@/hooks/use-scroll-guide'
import { NAV_SECTIONS } from '@/lib/navigation/sections'

const pad = (value: number) => String(value).padStart(2, '0')

/** Side rail of scenes plus a "keep scrolling" nudge for readers who stop mid-page. */
export function ScrollGuide() {
	const progressRef = useRef<HTMLSpanElement>(null)
	const { active, idle, jumpTo } = useScrollGuide(progressRef)
	const last = NAV_SECTIONS.length - 1
	const next = NAV_SECTIONS[active + 1]
	const showNudge = idle && active > 0 && active < last

	return (
		<>
			<nav
				aria-label="Sections"
				className="fixed top-1/2 right-1.5 z-50 -translate-y-1/2 md:right-6"
			>
				<div className="relative flex flex-col items-end gap-2 pr-2 md:gap-4 md:pr-3">
					<span aria-hidden className="absolute inset-y-0 right-0 w-px bg-text/15">
						<span
							ref={progressRef}
							className="absolute inset-0 origin-top bg-accent"
							style={{ transform: 'scaleY(0)' }}
						/>
					</span>
					{NAV_SECTIONS.map((section, index) => {
						const current = index === active
						return (
							<button
								key={section.id}
								type="button"
								onClick={() => jumpTo(index)}
								aria-current={current ? 'step' : undefined}
								aria-label={`${pad(index + 1)} ${section.label}`}
								className="group flex items-center gap-3 py-1 focus-visible:outline-none"
							>
								<span className="pointer-events-none font-mono text-[10px] tracking-[0.3em] text-text uppercase opacity-0 transition-opacity duration-(--apex-duration-base) group-hover:opacity-100 group-focus-visible:opacity-100 max-md:hidden">
									{section.label}
								</span>
								<span
									aria-hidden
									className={`h-px transition-all duration-(--apex-duration-base) ease-apex group-focus-visible:bg-accent ${current ? 'w-3.5 bg-accent shadow-[0_0_8px_var(--apex-accent)] md:w-6' : 'w-2 bg-text/40 group-hover:w-5 group-hover:bg-text md:w-3'}`}
								/>
							</button>
						)
					})}
					<span
						aria-hidden
						className="mt-2 font-mono text-[10px] text-muted tabular-nums max-md:hidden"
					>
						<span className="text-accent">{pad(active + 1)}</span>/
						{pad(NAV_SECTIONS.length)}
					</span>
				</div>
			</nav>

			<div
				aria-hidden
				className={`pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-4 border border-text/15 bg-bg/70 scanlines px-4 py-2 font-mono text-[10px] tracking-[0.3em] text-muted uppercase backdrop-blur-sm transition-all duration-(--apex-duration-slow) ease-apex md:bottom-8 ${showNudge ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
			>
				<span className="text-text">Keep scrolling</span>
				{next && (
					<span>
						Next · <span className="text-accent">{next.label}</span>
					</span>
				)}
				<span className="animate-nudge text-accent motion-reduce:animate-none">↓</span>
			</div>
		</>
	)
}
