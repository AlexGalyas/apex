#!/usr/bin/env node
// Usage: node scripts/make-placeholder-frames.mjs <scene> [frames=150] [hue=190]
// Writes numbered gradient frames + manifest.json so the scroll engine can be
// tested before real footage exists. The scene folder gets its own .gitignore,
// so placeholders never reach git; extract-frames.sh wipes the folder.

import { mkdir, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'

import sharp from 'sharp'

const VARIANTS = { desktop: [1920, 1080], mobile: [960, 540] }
const FPS = 30
const QUALITY = 75
const CONCURRENCY = 8

const [scene, framesArg = '150', hueArg = '190'] = process.argv.slice(2)
if (!scene) {
	console.error('usage: make-placeholder-frames.mjs <scene> [frames] [hue]')
	process.exit(1)
}

const frameCount = Number(framesArg)
const baseHue = Number(hueArg)
const root = path.join('public', 'sequences', scene)

function frameSvg(index, width, height) {
	const t = index / Math.max(1, frameCount - 1)
	const hue = (baseHue + t * 120) % 360
	const barX = t * (width - width * 0.1)
	const number = String(index + 1).padStart(4, '0')
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
	<defs>
		<linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
			<stop offset="0" stop-color="hsl(${hue},80%,12%)"/>
			<stop offset="1" stop-color="hsl(${(hue + 60) % 360},90%,35%)"/>
		</linearGradient>
	</defs>
	<rect width="100%" height="100%" fill="url(#g)"/>
	<rect x="${barX}" y="${height * 0.9}" width="${width * 0.1}" height="${height * 0.02}" fill="#00e5ff"/>
	<text x="50%" y="48%" text-anchor="middle" dominant-baseline="middle" font-family="Helvetica, Arial" font-weight="700" font-size="${height * 0.28}" fill="#f2f4f7">${number}</text>
	<text x="50%" y="70%" text-anchor="middle" font-family="Menlo, monospace" font-size="${height * 0.04}" fill="#f2f4f7" opacity="0.6">${scene.toUpperCase()} · ${width}×${height}</text>
</svg>`
}

async function renderVariant(variant, [width, height]) {
	const dir = path.join(root, variant)
	await mkdir(dir, { recursive: true })
	const indices = Array.from({ length: frameCount }, (_, i) => i)

	const worker = async () => {
		for (let i = indices.shift(); i !== undefined; i = indices.shift()) {
			const file = path.join(dir, `${String(i + 1).padStart(4, '0')}.webp`)
			await sharp(Buffer.from(frameSvg(i, width, height)))
				.webp({ quality: QUALITY })
				.toFile(file)
		}
	}
	await Promise.all(Array.from({ length: CONCURRENCY }, worker))
}

await rm(root, { recursive: true, force: true })
for (const [variant, size] of Object.entries(VARIANTS)) {
	await renderVariant(variant, size)
}

const manifest = {
	scene,
	fps: FPS,
	frameCount,
	ext: 'webp',
	placeholder: true,
	version: `placeholder-${Date.now().toString(36)}`,
	variants: Object.fromEntries(
		Object.entries(VARIANTS).map(([name, [width, height]]) => [name, { width, height }])
	)
}
await writeFile(path.join(root, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`)
await writeFile(path.join(root, '.gitignore'), '*\n')

console.log(`✓ ${scene}: ${frameCount} placeholder frames → ${root}`)
