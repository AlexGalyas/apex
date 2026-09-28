import { expect, test } from '@playwright/test'

test.use({ reducedMotion: 'reduce' })

test.describe('with prefers-reduced-motion', () => {
	test('scenes collapse to one screen each and nothing overlaps', async ({ page }) => {
		await page.goto('/')
		const viewport = page.viewportSize()!

		for (const id of ['garage', 'launch', 'machine', 'race']) {
			const box = await page.locator(`#${id} [data-sequence-track]`).boundingBox()
			expect(box?.height, `${id} track height`).toBeCloseTo(viewport.height, -1)
		}

		// No scene is pulled up under the previous one.
		const margins = await page
			.locator('main > div')
			.evaluateAll((wrappers) => wrappers.map((el) => getComputedStyle(el).marginTop))
		expect(margins.every((margin) => margin === '0px')).toBe(true)
	})

	test('circuits list every city in flow and machine specs are readable', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('#circuits [data-panel]')).toHaveCount(3)
		for (const city of ['Tokyo', 'Monaco', 'Dubai']) {
			const heading = page.getByRole('heading', { level: 3, name: city })
			await heading.scrollIntoViewIfNeeded()
			await expect(heading).toBeVisible()
		}

		const specs = page.locator('#machine dl')
		await specs.scrollIntoViewIfNeeded()
		await expect(specs.getByText('720 hp')).toBeVisible()
	})

	test('ambient effects stay off', async ({ page }) => {
		await page.goto('/')
		await expect(page.locator('canvas.fixed')).toBeHidden()
		const grainAnimation = await page
			.locator('.grain')
			.evaluate((el) => getComputedStyle(el).animationName)
		expect(grainAnimation).toBe('none')
	})
})
