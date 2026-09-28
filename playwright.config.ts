import { defineConfig, devices } from '@playwright/test'

const PORT = 3200

export default defineConfig({
	testDir: './tests/e2e',
	fullyParallel: true,
	reporter: 'list',
	use: {
		baseURL: `http://localhost:${PORT}`,
		// The system Chrome — no browser download needed.
		channel: 'chrome',
		trace: 'retain-on-failure'
	},
	projects: [
		{ name: 'desktop', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
		{ name: 'mobile', use: { ...devices['Pixel 7'], channel: 'chrome' } }
	],
	webServer: {
		command: `pnpm start -p ${PORT}`,
		port: PORT,
		reuseExistingServer: true
	}
})
