import type { MetadataRoute } from 'next'
import { SITE } from '@/lib/site'
import { getJobs } from '@/lib/jobs'
import { slugify } from '@/lib/utils'

export const revalidate = 3600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const jobs = (await getJobs()).filter(j => j.status === 'active')
  return [
    { url: SITE.url, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...jobs.map(j => ({ url: `${SITE.url}/jobs/${slugify(j.title)}`, lastModified: now, changeFrequency: 'weekly' as const, priority: 0.9 })),
    { url: `${SITE.url}/apply`, lastModified: now, changeFrequency: 'weekly', priority: 0.7 },
  ]
}
