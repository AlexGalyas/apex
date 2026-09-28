import 'server-only'

import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { SequenceManifest } from './types'

/**
 * Read at build time so the page ships with frame counts baked in — no manifest
 * request on the client, no layout decided after hydration.
 */
export async function getManifest(scene: string): Promise<SequenceManifest | null> {
	const file = path.join(process.cwd(), 'public', 'sequences', scene, 'manifest.json')
	try {
		const manifest = JSON.parse(await readFile(file, 'utf8')) as SequenceManifest
		if (manifest.frameCount < 1) return null
		return manifest
	} catch (error) {
		console.error(
			`[sequence] no manifest for "${scene}" — run scripts/extract-frames.sh`,
			error
		)
		return null
	}
}
