import { activeSectionIndex, sectionThreshold } from './sections'

describe('sectionThreshold', () => {
	it('activates a continue scene when its top reaches the viewport top', () => {
		expect(sectionThreshold(2400, 'continue', 1000)).toBe(2400)
	})

	it('activates a curtain scene once it covers half the screen', () => {
		expect(sectionThreshold(8000, 'curtain', 1000)).toBe(7500)
	})
})

describe('activeSectionIndex', () => {
	const thresholds = [0, 2400, 4800, 8200]

	it('is the first section at the top of the page', () => {
		expect(activeSectionIndex(thresholds, 0)).toBe(0)
	})

	it('is the last section whose threshold has been passed', () => {
		expect(activeSectionIndex(thresholds, 2399)).toBe(0)
		expect(activeSectionIndex(thresholds, 2400)).toBe(1)
		expect(activeSectionIndex(thresholds, 9000)).toBe(3)
	})
})
