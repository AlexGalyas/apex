import type { MetadataRoute } from 'next'

import { config } from '@/core/config'

export default function sitemap(): MetadataRoute.Sitemap {
	return [{ url: config.siteUrl.toString(), changeFrequency: 'monthly', priority: 1 }]
}
