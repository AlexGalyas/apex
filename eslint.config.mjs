import { defineConfig, globalIgnores } from 'eslint/config'
import nextVitals from 'eslint-config-next/core-web-vitals'
import nextTs from 'eslint-config-next/typescript'

const eslintConfig = defineConfig([
	...nextVitals,
	...nextTs,
	{
		rules: {
			'no-else-return': ['error', { allowElseIf: false }],
			'no-lonely-if': 'error'
		}
	},
	globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts', 'public/sequences/**'])
])

export default eslintConfig
