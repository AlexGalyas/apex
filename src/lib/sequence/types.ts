export type SequenceVariantName = 'desktop' | 'mobile'

export interface SequenceVariant {
	width: number
	height: number
}

export interface SequenceManifest {
	scene: string
	fps: number
	frameCount: number
	ext: 'webp'
	placeholder: boolean
	/** Changes on every extraction; frames are cached as immutable, so URLs must change too. */
	version: string
	variants: Record<SequenceVariantName, SequenceVariant>
}

export interface Rect {
	x: number
	y: number
	width: number
	height: number
}
