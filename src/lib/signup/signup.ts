export interface SignupInput {
	name: string
	email: string
	consent: boolean
}

export type SignupErrors = Partial<Record<keyof SignupInput, string>>

export type SpotStatus = 'free' | 'already' | 'waitlist'

export interface SpotClaim {
	status: SpotStatus
	spot: number
	emails: string[]
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateSignup({ name, email, consent }: SignupInput): SignupErrors {
	const errors: SignupErrors = {}
	if (name.trim().length < 2) errors.name = 'Enter your name'
	if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email'
	if (!consent) errors.consent = 'Confirm to continue'
	return errors
}

export function claimSpot(emails: string[], email: string, freeSpots: number): SpotClaim {
	const normalized = email.trim().toLowerCase()
	const existing = emails.indexOf(normalized)
	if (existing >= 0) return { status: 'already', spot: existing + 1, emails }

	const next = [...emails, normalized]
	const spot = next.length
	return { status: spot <= freeSpots ? 'free' : 'waitlist', spot, emails: next }
}
