/** @jest-environment jsdom */
import { FrameStore } from './frame-store'
import { type PreloadTrack, Preloader } from './preloader'

const flush = () => new Promise((r) => setTimeout(r, 0))

/**
 * Logs every fetch as `<name>:<index>` (`+` for sharp) and never finishes it,
 * so each slot is taken once and the log is the priority order.
 */
function makeTrack(name: string, log: string[], frames: number, sharp = true): PreloadTrack {
	const store = (tag: string) =>
		new FrameStore(
			Array.from({ length: frames }, (_, i) => `${tag}:${i}`),
			{
				loadImage: (url) => {
					log.push(url)
					return new Promise(() => undefined)
				}
			}
		)
	const element = document.createElement('div')
	document.body.append(element)
	return {
		element,
		draft: store(name),
		draftOrder: Array.from({ length: frames }, (_, i) => i),
		sharp: sharp ? store(`${name}+`) : null,
		target: () => 0
	}
}

afterEach(() => (document.body.innerHTML = ''))

describe('Preloader', () => {
	it('loads only urgent frames until started', async () => {
		const log: string[] = []
		const preloader = new Preloader(4)
		const hero = makeTrack('hero', log, 4)
		preloader.register(hero)
		preloader.urgent(hero.sharp!, [0])
		await flush()

		expect(log).toEqual(['hero+:0'])
	})

	it('fills drafts of the current scene before its sharp frames, then the next scene', async () => {
		const log: string[] = []
		const preloader = new Preloader(7)
		const a = makeTrack('a', log, 2)
		const b = makeTrack('b', log, 2)
		preloader.register(a)
		preloader.register(b)
		preloader.setActive(a, true)
		preloader.start()
		await flush()

		expect(log).toEqual(['a:0', 'a:1', 'a+:0', 'a+:1', 'b:0', 'b:1', 'b+:0'])
	})

	it('treats the latest active scene as current while scenes overlap', async () => {
		const log: string[] = []
		const preloader = new Preloader(2)
		const a = makeTrack('a', log, 2, false)
		const b = makeTrack('b', log, 2, false)
		preloader.register(a)
		preloader.register(b)
		preloader.setActive(a, true)
		preloader.setActive(b, true)
		preloader.start()
		await flush()

		expect(log).toEqual(['b:0', 'b:1'])
	})

	it('keeps the last scene current between scenes, so the one after it loads next', async () => {
		const log: string[] = []
		const preloader = new Preloader(4)
		const a = makeTrack('a', log, 2, false)
		const b = makeTrack('b', log, 2, false)
		const c = makeTrack('c', log, 2, false)
		;[a, b, c].forEach((t) => preloader.register(t))
		preloader.setActive(b, true)
		preloader.setActive(b, false)
		preloader.start()
		await flush()

		expect(log).toEqual(['b:0', 'b:1', 'c:0', 'c:1'])
	})

	it('leaves scenes beyond the next one alone', async () => {
		const log: string[] = []
		const preloader = new Preloader(10)
		const tracks = ['a', 'b', 'c'].map((name) => makeTrack(name, log, 2, false))
		tracks.forEach((t) => preloader.register(t))
		preloader.setActive(tracks[0], true)
		preloader.start()
		await flush()

		expect(log).toEqual(['a:0', 'a:1', 'b:0', 'b:1'])
	})
})
