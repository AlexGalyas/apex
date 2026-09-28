'use client'

import type { RefObject } from 'react'

import { gsap, useGSAP } from '@/lib/gsap'

import { useReducedMotion } from './use-reduced-motion'

export type SceneEnterMode = 'continue' | 'curtain'

/** Share of a viewport the `continue` cross-fade takes — must match the extra overlap in `scene-enter`. */
const CONTINUE_FADE = 0.2
const CURTAIN_SCALE = 0.92
const CURTAIN_DIM = 0.85

function previousStage(wrapper: HTMLElement) {
	const stage = wrapper.previousElementSibling?.querySelector<HTMLElement>('[data-stage]')
	const dim = stage?.querySelector<HTMLElement>('[data-stage-dim]')
	return { stage, dim }
}

/**
 * `continue`: the scene sits hidden under the previous one and fades in once
 * both are pinned — for shots whose first frame is the previous last frame, so
 * the hand-over reads as one take.
 * `curtain`: the scene slides over the pinned previous one, which sinks back
 * and darkens. Its feathered top edge closes as it lands, so a scene that stops
 * at the top (the last one) doesn't stay see-through.
 */
export function useSceneEnter(wrapperRef: RefObject<HTMLElement | null>, mode: SceneEnterMode) {
	const reducedMotion = useReducedMotion()

	useGSAP(
		() => {
			const wrapper = wrapperRef.current
			if (!wrapper || reducedMotion) return

			if (mode === 'continue') {
				gsap.fromTo(
					wrapper,
					{ autoAlpha: 0 },
					{
						autoAlpha: 1,
						ease: 'none',
						scrollTrigger: {
							trigger: wrapper,
							start: 'top top',
							end: () => `+=${window.innerHeight * CONTINUE_FADE}`,
							scrub: true,
							invalidateOnRefresh: true
						}
					}
				)
				return
			}

			const { stage, dim } = previousStage(wrapper)
			if (!stage) return

			const curtain = gsap.timeline({
				defaults: { ease: 'none' },
				scrollTrigger: {
					trigger: wrapper,
					start: 'top bottom',
					end: 'top top',
					scrub: true
				}
			})
			curtain.fromTo(wrapper, { '--feather': '30svh' }, { '--feather': '0svh' }, 0)
			curtain.fromTo(stage, { scale: 1 }, { scale: CURTAIN_SCALE }, 0)
			if (dim) curtain.fromTo(dim, { opacity: 0 }, { opacity: CURTAIN_DIM }, 0)
		},
		{ dependencies: [mode, reducedMotion], scope: wrapperRef, revertOnUpdate: true }
	)
}
