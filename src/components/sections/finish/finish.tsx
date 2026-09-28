import Image from 'next/image'

import finishHero from '@/assets/finish/finish-hero.webp'
import { NEXT_RACE } from '@/lib/race/next-race'

import { Countdown } from './countdown'
import { SignupForm } from './signup-form'

export function Finish() {
	return (
		<section
			id="finish"
			aria-labelledby="finish-title"
			className="relative isolate flex min-h-svh flex-col overflow-hidden lg:flex-row lg:items-center"
		>
			<Image
				src={finishHero}
				alt="The APEX car at rest in the rain, headlights glowing cyan"
				fill
				sizes="100vw"
				placeholder="blur"
				className="-z-10 object-cover object-left"
			/>
			<div
				aria-hidden
				className="absolute inset-0 -z-10 bg-linear-to-t from-bg via-bg/60 to-transparent lg:bg-linear-to-l lg:via-bg/40"
			/>

			<div className="flex flex-1 flex-col justify-end gap-8 px-6 pt-[45svh] pb-10 md:px-16 lg:justify-center lg:pt-0 lg:pb-0">
				<p className="font-mono text-xs tracking-[0.4em] text-accent uppercase">
					{NEXT_RACE.title}
				</p>
				<h2
					id="finish-title"
					className="font-display text-5xl leading-none font-black md:text-7xl"
				>
					Next race:
					<br />
					{NEXT_RACE.city}
				</h2>
				<Countdown target={NEXT_RACE.startsAt} />
			</div>

			<div className="w-full px-6 pb-16 md:px-16 lg:w-[480px] lg:shrink-0 lg:pr-16 lg:pb-0 lg:pl-0">
				<SignupForm />
			</div>
		</section>
	)
}
