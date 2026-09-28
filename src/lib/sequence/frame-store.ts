type LoadImage = (url: string) => Promise<HTMLImageElement>

interface FrameStoreOptions {
	loadImage?: LoadImage
	onFrame?: (index: number) => void
}

const DECODE_TIMEOUT_MS = 1000

function fetchImage(url: string): Promise<HTMLImageElement> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.decoding = 'async'
		image.onload = () => resolve(image)
		image.onerror = () => reject(new Error(`HTTP load failed: ${url}`))
		image.src = url
	})
}

/**
 * Pre-decode so drawing a frame on scroll never decodes synchronously on the
 * main thread — that is what makes a scrub stutter. Best effort only: in a
 * hidden tab `decode()` never settles, and awaiting it would stall the queue.
 */
async function decodeImage(url: string): Promise<HTMLImageElement> {
	const image = await fetchImage(url)
	if (document.visibilityState !== 'visible') return image

	const timeout = new Promise((resolve) => setTimeout(resolve, DECODE_TIMEOUT_MS))
	await Promise.race([image.decode(), timeout]).catch(() => undefined)
	return image
}

/**
 * The frames of one sequence at one resolution. It only holds and fetches;
 * what to fetch next is the preloader's call.
 */
export class FrameStore {
	private readonly frames: (HTMLImageElement | null)[]
	private readonly requested = new Set<number>()
	private readonly loadImage: LoadImage
	private readonly onFrame?: (index: number) => void
	private disposed = false

	constructor(
		private readonly urls: string[],
		options: FrameStoreOptions = {}
	) {
		this.frames = urls.map(() => null)
		this.loadImage = options.loadImage ?? decodeImage
		this.onFrame = options.onFrame
	}

	get size() {
		return this.urls.length
	}

	get isDisposed() {
		return this.disposed
	}

	isRequested = (index: number) => this.requested.has(index)

	isLoaded = (index: number) => this.frames[index] !== null

	get(index: number) {
		return this.frames[index]
	}

	dispose() {
		this.disposed = true
	}

	/** Marks the frame as requested straight away, so it is never fetched twice. */
	async fetch(index: number) {
		if (this.disposed || this.requested.has(index)) return
		this.requested.add(index)
		try {
			const image = await this.loadImage(this.urls[index])
			if (this.disposed) return
			this.frames[index] = image
			this.onFrame?.(index)
		} catch (error) {
			console.error(`[sequence] failed to load ${this.urls[index]}`, error)
		}
	}
}
