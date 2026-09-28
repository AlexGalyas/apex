import { FrameStore } from './frame-store'

function fakeImage(url: string) {
	return { url } as unknown as HTMLImageElement
}

describe('FrameStore', () => {
	const urls = ['a.webp', 'b.webp', 'c.webp']

	it('loads a fetched frame and reports it', async () => {
		const loaded: number[] = []
		const store = new FrameStore(urls, {
			loadImage: async (url) => fakeImage(url),
			onFrame: (i) => loaded.push(i)
		})

		await Promise.all([store.fetch(2), store.fetch(0)])

		expect(loaded).toEqual([2, 0])
		expect(store.isLoaded(0)).toBe(true)
		expect(store.isLoaded(1)).toBe(false)
		expect(store.get(2)).toEqual({ url: 'c.webp' })
	})

	it('marks a frame requested as soon as it is fetched, and fetches it once', async () => {
		const loadImage = jest.fn(async (url: string) => fakeImage(url))
		const store = new FrameStore(urls, { loadImage })

		const pending = store.fetch(1)
		expect(store.isRequested(1)).toBe(true)
		expect(store.isLoaded(1)).toBe(false)
		await Promise.all([pending, store.fetch(1)])

		expect(loadImage).toHaveBeenCalledTimes(1)
	})

	it('drops a failed frame without breaking the rest', async () => {
		const log = jest.spyOn(console, 'error').mockImplementation(() => undefined)
		const store = new FrameStore(urls, {
			loadImage: async (url) => {
				if (url === 'b.webp') throw new Error('404')
				return fakeImage(url)
			}
		})

		await Promise.all([store.fetch(1), store.fetch(2)])

		expect(store.isLoaded(1)).toBe(false)
		expect(store.isLoaded(2)).toBe(true)
		expect(log).toHaveBeenCalledWith('[sequence] failed to load b.webp', expect.any(Error))
		log.mockRestore()
	})

	it('keeps nothing after dispose', async () => {
		const loadImage = jest.fn(async (url: string) => fakeImage(url))
		const store = new FrameStore(urls, { loadImage })

		const pending = store.fetch(0)
		store.dispose()
		await pending
		await store.fetch(1)

		expect(store.isLoaded(0)).toBe(false)
		expect(loadImage).toHaveBeenCalledTimes(1)
	})
})
