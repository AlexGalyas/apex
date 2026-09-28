import { claimSpot, validateSignup } from './signup'

describe('validateSignup', () => {
	const valid = { name: 'Kai Mori', email: 'kai@nocturne.test', consent: true }

	it('accepts a complete entry', () => {
		expect(validateSignup(valid)).toEqual({})
	})

	it('requires a name of at least two characters', () => {
		expect(validateSignup({ ...valid, name: ' ' })).toEqual({ name: 'Enter your name' })
		expect(validateSignup({ ...valid, name: 'K' })).toEqual({ name: 'Enter your name' })
	})

	it('requires a plausible email', () => {
		expect(validateSignup({ ...valid, email: 'kai@' })).toEqual({
			email: 'Enter a valid email'
		})
	})

	it('requires consent', () => {
		expect(validateSignup({ ...valid, consent: false })).toEqual({
			consent: 'Confirm to continue'
		})
	})
})

describe('claimSpot', () => {
	it('hands out the next free spot', () => {
		expect(claimSpot(['a@x.test', 'b@x.test'], 'c@x.test', 10)).toEqual({
			status: 'free',
			spot: 3,
			emails: ['a@x.test', 'b@x.test', 'c@x.test']
		})
	})

	it('returns the existing spot for a repeat email, ignoring case and spaces', () => {
		expect(claimSpot(['a@x.test', 'b@x.test'], ' B@X.test ', 10)).toEqual({
			status: 'already',
			spot: 2,
			emails: ['a@x.test', 'b@x.test']
		})
	})

	it('puts everyone past the free spots on the waitlist', () => {
		const taken = Array.from({ length: 10 }, (_, i) => `${i}@x.test`)
		expect(claimSpot(taken, 'late@x.test', 10)).toEqual({
			status: 'waitlist',
			spot: 11,
			emails: [...taken, 'late@x.test']
		})
	})
})
