/** Film grain: a tiled noise texture jittered a few times a second. Pure CSS, no blending. */
export function Grain() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
			<div className="grain absolute -inset-1/2 opacity-(--apex-grain-opacity)" />
		</div>
	)
}
