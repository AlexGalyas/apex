const IDLE_HZ = 32
const REV_RANGE_HZ = 150
const FILTER_IDLE_HZ = 260
const FILTER_RANGE_HZ = 2400
const MASTER_VOLUME = 0.16
const GLIDE = 0.05
const FADE = 0.2

function softClip(amount: number) {
	const curve = new Float32Array(1024)
	for (let i = 0; i < curve.length; i++) {
		const x = (i / (curve.length - 1)) * 2 - 1
		curve[i] = Math.tanh(x * amount)
	}
	return curve
}

function whiteNoise(context: AudioContext, seconds: number) {
	const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate)
	const data = buffer.getChannelData(0)
	for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
	return buffer
}

/**
 * A synthesised straight-six: a sawtooth fundamental, a square sub-octave and
 * a thin upper harmonic through a soft clipper and a low-pass that opens with
 * revs, plus band-passed noise for intake roar that grows with road speed.
 * No samples, so nothing to license or download.
 */
export class EngineSynth {
	private readonly context = new AudioContext()
	private readonly master = this.context.createGain()
	private readonly filter = this.context.createBiquadFilter()
	private readonly roar = this.context.createGain()
	private readonly oscillators: { node: OscillatorNode; ratio: number }[] = []

	constructor() {
		const { context } = this
		this.master.gain.value = 0
		this.master.connect(context.destination)

		this.filter.type = 'lowpass'
		this.filter.Q.value = 0.9
		this.filter.frequency.value = FILTER_IDLE_HZ
		this.filter.connect(this.master)

		const shaper = context.createWaveShaper()
		shaper.curve = softClip(2.5)
		shaper.connect(this.filter)

		const voices: [OscillatorType, number, number][] = [
			['sawtooth', 1, 0.45],
			['square', 0.5, 0.35],
			['sawtooth', 2.01, 0.12]
		]
		for (const [type, ratio, level] of voices) {
			const node = context.createOscillator()
			const gain = context.createGain()
			node.type = type
			node.frequency.value = IDLE_HZ * ratio
			gain.gain.value = level
			node.connect(gain).connect(shaper)
			node.start()
			this.oscillators.push({ node, ratio })
		}

		const noise = context.createBufferSource()
		noise.buffer = whiteNoise(context, 2)
		noise.loop = true
		const band = context.createBiquadFilter()
		band.type = 'bandpass'
		band.frequency.value = 900
		band.Q.value = 0.7
		this.roar.gain.value = 0
		noise.connect(band).connect(this.roar).connect(this.master)
		noise.start()
	}

	/** rpm and speed are both 0..1. */
	update(rpm: number, speed: number) {
		const now = this.context.currentTime
		const base = IDLE_HZ + rpm * REV_RANGE_HZ
		for (const { node, ratio } of this.oscillators)
			node.frequency.setTargetAtTime(base * ratio, now, GLIDE)
		this.filter.frequency.setTargetAtTime(FILTER_IDLE_HZ + rpm * FILTER_RANGE_HZ, now, GLIDE)
		this.roar.gain.setTargetAtTime(0.02 + speed * 0.12, now, GLIDE)
	}

	async setOn(on: boolean) {
		const now = this.context.currentTime
		this.master.gain.setTargetAtTime(on ? MASTER_VOLUME : 0, now, FADE)
		if (on) await this.context.resume()
	}

	suspend() {
		return this.context.suspend()
	}

	resume() {
		return this.context.resume()
	}

	dispose() {
		return this.context.close()
	}
}
