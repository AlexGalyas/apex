/** Darkens a pinned stage while the next scene is drawn over it (driven by `useSceneEnter`). */
export function StageDim() {
	return (
		<div
			data-stage-dim
			aria-hidden
			className="pointer-events-none absolute inset-0 bg-bg opacity-0"
		/>
	)
}
