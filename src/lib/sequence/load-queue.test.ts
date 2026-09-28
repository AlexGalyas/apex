import { createLoadQueue } from './load-queue'

function deferred() {
	let resolve!: () => void
	const promise = new Promise<void>((r) => (resolve = r))
	return { promise, resolve }
}

const flush = () => new Promise((r) => setTimeout(r, 0))

describe('createLoadQueue', () => {
	it('never runs more tasks at once than its concurrency', async () => {
		const queue = createLoadQueue(2)
		const gates = [deferred(), deferred(), deferred()]
		const started: number[] = []

		gates.forEach((gate, i) =>
			queue.enqueue(() => {
				started.push(i)
				return gate.promise
			})
		)
		await flush()
		expect(started).toEqual([0, 1])

		gates[0].resolve()
		await flush()
		expect(started).toEqual([0, 1, 2])
	})

	it('skips a task whose signal was aborted before it started', async () => {
		const queue = createLoadQueue(1)
		const gate = deferred()
		const controller = new AbortController()
		const ran: string[] = []

		queue.enqueue(() => gate.promise)
		queue.enqueue(async () => {
			ran.push('aborted')
		}, controller.signal)
		queue.enqueue(async () => {
			ran.push('kept')
		})

		controller.abort()
		gate.resolve()
		await flush()
		await flush()
		expect(ran).toEqual(['kept'])
	})

	it('keeps draining after a task rejects', async () => {
		const queue = createLoadQueue(1)
		const ran: string[] = []

		queue.enqueue(() => Promise.reject(new Error('404')))
		queue.enqueue(async () => {
			ran.push('next')
		})

		await flush()
		await flush()
		expect(ran).toEqual(['next'])
	})
})
