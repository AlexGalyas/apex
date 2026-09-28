import type { FrameStore } from './frame-store'

/** Frames are small and served over HTTP/2, so round trips cost more than bandwidth. */
const CONCURRENCY = 10
/** Sharp frames this close to the playhead jump ahead of the next scene's drafts. */
const SHARP_WINDOW = 24

export interface PreloadTrack {
	element: Element
	/** Light frames for the whole scene, in coarse-to-fine order: a scrub is smooth once these land. */
	draft: FrameStore
	draftOrder: readonly number[]
	/** Full-resolution frames that replace drafts around the playhead; null where drafts are the top tier. */
	sharp: FrameStore | null
	/** The frame the scene is showing (or will open on). */
	target: () => number
}

interface Job {
	store: FrameStore
	index: number
}

const byDocumentOrder = (a: PreloadTrack, b: PreloadTrack) =>
	a.element.compareDocumentPosition(b.element) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1

/**
 * One loader for every sequence on the page. Each free slot takes the most
 * useful frame left, relative to the scene on screen:
 *
 * 1. urgent frames (first paint, reduced motion)
 * 2. the current scene's drafts
 * 3. its sharp frames near the playhead
 * 4. the next scene's drafts
 * 5. the rest of the current scene's sharp frames
 * 6. the previous scene's drafts (for scrolling back)
 * 7. the next scene's sharp frames
 *
 * Scenes further away wait until the reader gets closer, so a visit that
 * stops at the opening doesn't pull the whole page.
 *
 * Nothing past the urgent frames loads before `start()`, so the opening
 * scene's first frame never competes with the rest.
 */
export class Preloader {
	private readonly tracks: PreloadTrack[] = []
	private readonly urgentJobs: Job[] = []
	private readonly active = new Set<PreloadTrack>()
	private current: PreloadTrack | null = null
	private running = 0
	private started = false

	constructor(private readonly concurrency = CONCURRENCY) {}

	register(track: PreloadTrack) {
		this.tracks.push(track)
		this.tracks.sort(byDocumentOrder)
		this.pump()
		return () => {
			this.tracks.splice(this.tracks.indexOf(track), 1)
			this.active.delete(track)
			if (this.current === track) this.current = null
		}
	}

	/**
	 * Scenes overlap at hand-overs, so the latest active one on the page wins.
	 * Between scenes the last one stays current, which makes the one after it next.
	 */
	setActive(track: PreloadTrack, isActive: boolean) {
		if (isActive) this.active.add(track)
		else this.active.delete(track)
		const latest = this.tracks.filter((t) => this.active.has(t)).at(-1)
		if (latest) this.current = latest
		this.pump()
	}

	urgent(store: FrameStore, indices: readonly number[]) {
		for (const index of indices) this.urgentJobs.push({ store, index })
		this.pump()
	}

	start() {
		if (this.started) return
		this.started = true
		this.pump()
	}

	private pump() {
		while (this.running < this.concurrency) {
			const job = this.next()
			if (!job) return
			this.running++
			job.store.fetch(job.index).finally(() => {
				this.running--
				this.pump()
			})
		}
	}

	private next(): Job | null {
		while (this.urgentJobs.length > 0) {
			const job = this.urgentJobs.shift()!
			if (!job.store.isDisposed && !job.store.isRequested(job.index)) return job
		}
		if (!this.started || this.tracks.length === 0) return null

		const at = Math.max(0, this.current ? this.tracks.indexOf(this.current) : 0)
		const current = this.tracks[at]
		const upcoming = this.tracks[at + 1]
		const previous = this.tracks[at - 1]

		return (
			draftJob(current) ??
			sharpJob(current, SHARP_WINDOW) ??
			(upcoming && draftJob(upcoming)) ??
			sharpJob(current, Infinity) ??
			(previous && draftJob(previous)) ??
			(upcoming ? sharpJob(upcoming, Infinity) : null)
		)
	}
}

function draftJob({ draft, draftOrder }: PreloadTrack): Job | null {
	const index = draftOrder.find((i) => !draft.isRequested(i))
	return index === undefined ? null : { store: draft, index }
}

/** The unrequested sharp frame nearest the playhead, within `window` frames of it. */
function sharpJob({ sharp, target }: PreloadTrack, window: number): Job | null {
	if (!sharp) return null
	const from = target()
	const reach = Math.min(window, sharp.size)
	for (let distance = 0; distance <= reach; distance++) {
		for (const index of [from - distance, from + distance]) {
			if (index >= 0 && index < sharp.size && !sharp.isRequested(index)) {
				return { store: sharp, index }
			}
		}
	}
	return null
}

export const preloader = new Preloader()
