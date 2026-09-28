import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async headers() {
		return [
			{
				// Frame filenames never change for a given build of a sequence, and a
				// re-extract replaces the whole folder, so a long cache is safe.
				source: '/sequences/:path*',
				headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
			}
		]
	}
}

export default nextConfig
