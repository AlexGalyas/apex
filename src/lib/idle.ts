const IDLE_TIMEOUT_MS = 2000
const FALLBACK_DELAY_MS = 200

/**
 * Runs `callback` once the page has loaded and the main thread is free, so
 * optional work (the rain shader) stays out of the hydration task.
 * Returns a cancel function.
 */
export function whenIdle(callback: () => void): () => void {
	let cancelled = false
	let idleId: number | undefined
	let timeoutId: number | undefined

	const schedule = () => {
		if (cancelled) return
		if (typeof window.requestIdleCallback === 'function') {
			idleId = window.requestIdleCallback(() => !cancelled && callback(), {
				timeout: IDLE_TIMEOUT_MS
			})
			return
		}
		timeoutId = window.setTimeout(() => !cancelled && callback(), FALLBACK_DELAY_MS)
	}

	if (document.readyState === 'complete') schedule()
	else window.addEventListener('load', schedule, { once: true })

	return () => {
		cancelled = true
		window.removeEventListener('load', schedule)
		if (idleId !== undefined) window.cancelIdleCallback(idleId)
		if (timeoutId !== undefined) window.clearTimeout(timeoutId)
	}
}
