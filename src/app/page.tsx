import { SceneEnter } from '@/components/scene'
import { Circuits } from '@/components/sections/circuits'
import { Drivers } from '@/components/sections/drivers'
import { Finish } from '@/components/sections/finish'
import { Hero } from '@/components/sections/hero'
import { Launch } from '@/components/sections/launch'
import { Machine } from '@/components/sections/machine'
import { Race } from '@/components/sections/race'

export default function HomePage() {
	return (
		<main>
			<Hero />
			<SceneEnter mode="continue">
				<Launch />
			</SceneEnter>
			<SceneEnter mode="continue">
				<Machine />
			</SceneEnter>
			<SceneEnter mode="curtain">
				<Circuits />
			</SceneEnter>
			<SceneEnter mode="curtain">
				<Drivers />
			</SceneEnter>
			<SceneEnter mode="curtain">
				<Race />
			</SceneEnter>
			<SceneEnter mode="curtain">
				<Finish />
			</SceneEnter>
		</main>
	)
}
