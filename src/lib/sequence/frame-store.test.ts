import { FrameStore } from './frame-store'
import { createLoadQueue } from './load-queue'

const flush = () => new Promise((r) => setTimeout(r, 0))

function fakeImage(url: string) {
	return { url } as unknown as HTMLImageElement
}

describe('FrameStore', () => {
	const urls = ['a.webp', 'b.webp', 'c.webp']

	it('loads requested frames and reports each one', async () => {
		const loaded: number[] = []
		const store = new FrameStore(urls, {
			queue: createLoadQueue(4),
			loadImage: async (url) => fakeImage(url),
			onFrame: (i) => loaded.push(i)
		})

		store.request([2, 0])
		await flush()

		expect(loaded).toEqual([2, 0])
		expect(store.isLoaded(0)).toBe(true)
		expect(store.isLoaded(1)).toBe(false)
		expect(store.get(2)).toEqual({ url: 'c.webp' })
	})

	it('requests each frame only once', async () => {
		const loadImage = jest.fn(async (url: string) => fakeImage(url))
		const store = new FrameStore(urls, { queue: createLoadQueue(4), loadImage })

		store.request([0, 1])
		store.request([1, 2, 0])
		await flush()

		expect(loadImage).toHaveBeenCalledTimes(3)
	})

	it('drops a failed frame without breaking the rest', async () => {
		const log = jest.spyOn(console, 'error').mockImplementation(() => undefined)
		const store = new FrameStore(urls, {
			queue: createLoadQueue(1),
			loadImage: async (url) => {
				if (url === 'b.webp') throw new Error('404')
				return fakeImage(url)
			}
		})

		store.request([0, 1, 2])
		await flush()
		await flush()

		expect(store.isLoaded(1)).toBe(false)
		expect(store.isLoaded(2)).toBe(true)
		expect(log).toHaveBeenCalledWith('[sequence] failed to load b.webp', expect.any(Error))
		log.mockRestore()
	})

	it('stops loading after dispose', async () => {
		const loadImage = jest.fn(async (url: string) => fakeImage(url))
		const store = new FrameStore(urls, { queue: createLoadQueue(1), loadImage })

		store.request([0, 1, 2])
		store.dispose()
		await flush()

		expect(loadImage).toHaveBeenCalledTimes(1)
		expect(store.isLoaded(0)).toBe(false)
	})
})
