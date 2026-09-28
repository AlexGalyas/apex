export interface Track {
	viewBox: string
	path: string
}

/**
 * Invented street layouts — deliberately not real circuits. Each path starts on
 * the start/finish straight; each viewBox hugs its own path so all three fill
 * the same frame.
 */
export const TRACKS = {
	// Grid of city blocks with a flyover hairpin top-right.
	tokyo: {
		viewBox: '50 25 315 245',
		path: 'M70 250 L70 110 Q70 70 110 70 L190 70 L215 45 L305 45 Q345 45 345 85 L345 120 Q345 140 325 150 L290 165 Q275 172 275 190 L275 215 Q275 250 240 250 L190 250 L170 228 L120 228 L100 250 Z'
	},
	// Harbour hairpins climbing the hillside, then a long seafront run.
	monaco: {
		viewBox: '25 80 357 204',
		path: 'M45 215 L115 215 Q145 215 152 185 L160 135 Q166 100 200 100 L228 100 Q252 100 246 122 Q240 145 264 145 L330 145 Q362 145 362 177 L362 212 Q362 252 322 254 L175 262 Q146 264 128 252 L72 252 Q45 252 45 230 Z'
	},
	// Two long desert straights joined by fast sweepers and a tight esses.
	dubai: {
		viewBox: '20 36 362 240',
		path: 'M40 155 L262 70 Q302 56 332 82 Q362 108 340 140 L302 168 Q282 184 302 200 L340 226 Q362 242 336 256 L122 256 Q62 256 50 214 Z'
	}
} as const satisfies Record<string, Track>
