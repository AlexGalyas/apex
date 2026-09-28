type Task = () => Promise<void>

interface Entry {
	task: Task
	signal?: AbortSignal
}

export interface LoadQueue {
	enqueue: (task: Task, signal?: AbortSignal) => void
}

/** FIFO with a concurrency cap, shared by every sequence so they don't flood the connection. */
export function createLoadQueue(concurrency: number): LoadQueue {
	const pending: Entry[] = []
	let active = 0

	const next = () => {
		while (active < concurrency && pending.length > 0) {
			const entry = pending.shift()!
			if (entry.signal?.aborted) continue

			active++
			entry
				.task()
				.catch(() => undefined)
				.finally(() => {
					active--
					next()
				})
		}
	}

	return {
		enqueue(task, signal) {
			pending.push({ task, signal })
			next()
		}
	}
}

export const sharedLoadQueue = createLoadQueue(6)
