import { expect, test } from '@playwright/test'

test('renders every scene without console errors', async ({ page }) => {
	const errors: string[] = []
	page.on('pageerror', (error) => errors.push(error.message))
	page.on('console', (message) => {
		if (message.type() === 'error') errors.push(message.text())
	})

	await page.goto('/')
	await expect(page.getByRole('heading', { level: 1, name: 'APEX' })).toBeVisible()
	// Each letter must finish rising out of its clip (guards the CSS/GSAP transform clash).
	for (const letter of await page.locator('[data-letter]').all())
		await expect(letter).toBeInViewport({ ratio: 0.9 })
	for (const id of ['garage', 'launch', 'machine', 'circuits', 'drivers', 'race', 'finish'])
		await expect(page.locator(`section#${id}`)).toHaveCount(1)

	await page.locator('#finish').scrollIntoViewIfNeeded()
	await expect(page.getByRole('heading', { name: /Next race/ })).toBeVisible()
	expect(errors).toEqual([])
})

test('signup validates, then confirms a free spot', async ({ page }) => {
	await page.goto('/')
	const form = page.locator('#finish form')
	await form.scrollIntoViewIfNeeded()

	await form.getByRole('button', { name: 'Join the grid' }).click()
	await expect(form.getByText('Enter your name')).toBeVisible()
	await expect(form.getByText('Enter a valid email')).toBeVisible()
	await expect(form.getByText('Confirm to continue')).toBeVisible()

	await form.getByLabel('Name').fill('Test Driver')
	await form.getByLabel('Email').fill('driver@example.test')
	await form.getByLabel(/race-night details/).check()
	await form.getByRole('button', { name: 'Join the grid' }).click()

	await expect(page.getByRole('status')).toHaveText(/Spot #1 of 10/)
	await expect(page.getByText('9/10')).toBeVisible()
})

test('driver telemetry opens from its button', async ({ page }) => {
	await page.goto('/')
	const card = page.locator('#drivers article').first()
	await card.scrollIntoViewIfNeeded()
	const toggle = card.getByRole('button', { name: 'Telemetry' })

	await toggle.click()
	await expect(toggle).toHaveAttribute('aria-expanded', 'true')
	await expect(card.getByText('Live telemetry · Kai Mori')).toBeVisible()
})
