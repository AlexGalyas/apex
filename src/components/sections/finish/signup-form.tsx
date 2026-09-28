'use client'

import { type FormEvent, useId, useState, useSyncExternalStore } from 'react'

import { NEXT_RACE } from '@/lib/race/next-race'
import { type SignupErrors, type SpotClaim, validateSignup } from '@/lib/signup/signup'
import { submitSignup, subscribeToSpots, takenSpots } from '@/lib/signup/submit-signup'

type Phase = { kind: 'idle' } | { kind: 'submitting' } | { kind: 'done'; claim: SpotClaim }

const CONFIRMATION: Record<SpotClaim['status'], (spot: number) => string> = {
	free: (spot) => `You're in. Spot #${spot} of ${NEXT_RACE.freeSpots} — free entry.`,
	already: (spot) => `You're already on the grid — spot #${spot}.`,
	waitlist: (spot) => `Free spots are gone — you're #${spot} on the grid list.`
}

const fieldClass =
	'w-full border-b border-text/20 bg-transparent py-3 font-mono text-base text-text outline-none transition-colors duration-(--apex-duration-fast) placeholder:text-muted/60 focus:border-accent aria-invalid:border-magenta'

export function SignupForm() {
	const id = useId()
	const [errors, setErrors] = useState<SignupErrors>({})
	const [phase, setPhase] = useState<Phase>({ kind: 'idle' })
	const taken = useSyncExternalStore<number | null>(subscribeToSpots, takenSpots, () => null)

	const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		const data = new FormData(event.currentTarget)
		const input = {
			name: String(data.get('name') ?? ''),
			email: String(data.get('email') ?? ''),
			consent: data.get('consent') === 'on'
		}
		const found = validateSignup(input)
		setErrors(found)
		if (Object.keys(found).length > 0) return

		setPhase({ kind: 'submitting' })
		const claim = await submitSignup(input)
		setPhase({ kind: 'done', claim })
	}

	const left = taken === null ? null : Math.max(0, NEXT_RACE.freeSpots - taken)
	const submitting = phase.kind === 'submitting'

	return (
		<div className="relative border border-accent/30 bg-bg/70 p-6 backdrop-blur-md md:p-10">
			<p className="font-mono text-xs tracking-[0.3em] text-accent uppercase">
				Last race of the season
			</p>
			<h3 className="mt-3 font-display text-2xl font-bold md:text-3xl">Claim your spot</h3>
			<p className="mt-3 text-sm text-muted">
				The first {NEXT_RACE.freeSpots} on the grid ride free.{' '}
				<span className="font-mono text-text tabular-nums">
					{left === null ? '--' : left}/{NEXT_RACE.freeSpots}
				</span>{' '}
				free spots left.
			</p>

			{phase.kind === 'done' ? (
				<p role="status" className="mt-8 font-mono text-lg text-accent">
					{CONFIRMATION[phase.claim.status](phase.claim.spot)}
				</p>
			) : (
				<form className="mt-8 flex flex-col gap-6" onSubmit={onSubmit} noValidate>
					<label className="flex flex-col gap-1">
						<span className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
							Name
						</span>
						<input
							name="name"
							autoComplete="name"
							placeholder="Kai Mori"
							className={fieldClass}
							aria-invalid={Boolean(errors.name)}
							aria-describedby={errors.name ? `${id}-name` : undefined}
						/>
						{errors.name && (
							<span id={`${id}-name`} className="text-xs text-magenta">
								{errors.name}
							</span>
						)}
					</label>

					<label className="flex flex-col gap-1">
						<span className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
							Email
						</span>
						<input
							name="email"
							type="email"
							autoComplete="email"
							placeholder="you@nightshift.io"
							className={fieldClass}
							aria-invalid={Boolean(errors.email)}
							aria-describedby={errors.email ? `${id}-email` : undefined}
						/>
						{errors.email && (
							<span id={`${id}-email`} className="text-xs text-magenta">
								{errors.email}
							</span>
						)}
					</label>

					<label className="flex items-start gap-3 text-sm text-muted">
						<input
							name="consent"
							type="checkbox"
							className="mt-1 size-4 accent-(--apex-accent)"
							aria-invalid={Boolean(errors.consent)}
							aria-describedby={errors.consent ? `${id}-consent` : undefined}
						/>
						<span>
							Send me race-night details for {NEXT_RACE.city}.
							{errors.consent && (
								<span id={`${id}-consent`} className="block text-xs text-magenta">
									{errors.consent}
								</span>
							)}
						</span>
					</label>

					<button
						type="submit"
						disabled={submitting}
						className="mt-2 bg-accent px-6 py-4 font-display text-sm font-bold tracking-[0.2em] text-bg uppercase transition-opacity duration-(--apex-duration-fast) hover:opacity-90 disabled:opacity-50"
					>
						{submitting ? 'Locking in…' : 'Join the grid'}
					</button>
				</form>
			)}
		</div>
	)
}
