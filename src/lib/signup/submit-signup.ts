import { NEXT_RACE } from '@/lib/race/next-race'

import { claimSpot, type SignupInput, type SpotClaim } from './signup'

const STORAGE_KEY = 'apex-signups'
const CHANGE_EVENT = 'apex-signups-change'
const LATENCY_MS = 700

function readEmails(): string[] {
	try {
		const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
		if (!Array.isArray(parsed)) return []
		return parsed.filter((item): item is string => typeof item === 'string')
	} catch {
		return []
	}
}

export function takenSpots(): number {
	return readEmails().length
}

export function subscribeToSpots(onChange: () => void): () => void {
	window.addEventListener(CHANGE_EVENT, onChange)
	window.addEventListener('storage', onChange)
	return () => {
		window.removeEventListener(CHANGE_EVENT, onChange)
		window.removeEventListener('storage', onChange)
	}
}

/**
 * Concept-site stand-in for a real signup endpoint: spots are tracked in this
 * browser only. Swap the body for a POST when a backend exists — the form
 * only depends on the returned claim.
 */
export async function submitSignup(input: SignupInput): Promise<SpotClaim> {
	await new Promise((resolve) => setTimeout(resolve, LATENCY_MS))
	const claim = claimSpot(readEmails(), input.email, NEXT_RACE.freeSpots)
	try {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(claim.emails))
		window.dispatchEvent(new Event(CHANGE_EVENT))
	} catch (error) {
		console.error('[signup] could not persist signup locally', error)
	}
	return claim
}
