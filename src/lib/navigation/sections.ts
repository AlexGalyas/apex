export interface NavSection {
	id: string
	label: string
}

/** Page order; ids match the `<section id>` of each scene. */
export const NAV_SECTIONS: NavSection[] = [
	{ id: 'garage', label: 'Garage' },
	{ id: 'launch', label: 'Launch' },
	{ id: 'machine', label: 'Machine' },
	{ id: 'circuits', label: 'Circuits' },
	{ id: 'drivers', label: 'Drivers' },
	{ id: 'race', label: 'Race' },
	{ id: 'finish', label: 'Finish' }
]

export type EnterMode = 'continue' | 'curtain' | 'none'

/**
 * Scroll position at which a section counts as "the one on screen".
 * A `continue` scene becomes visible the moment its top reaches the top of the
 * viewport (it fades in while pinned); a `curtain` scene once it covers half
 * the screen. The first section is active from the very top.
 */
export function sectionThreshold(top: number, mode: EnterMode, viewport: number): number {
	if (mode === 'curtain') return top - viewport / 2
	return top
}

export function activeSectionIndex(thresholds: number[], scrollY: number): number {
	let active = 0
	thresholds.forEach((threshold, index) => {
		if (scrollY >= threshold) active = index
	})
	return active
}
