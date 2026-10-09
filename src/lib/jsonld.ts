import { SITE } from './site'
import { slugify } from './utils'
import type { Job } from './types'

export const organizationLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  url: SITE.website,
  logo: `${SITE.url}/logo.jpeg`,
  email: SITE.email,
  telephone: SITE.phone,
  slogan: SITE.tagline,
  sameAs: SITE.socials.map(s => s.href),
}

const employmentMap: Record<string, string> = { 'Full-time': 'FULL_TIME', 'Part-time': 'PART_TIME', Internship: 'INTERN', Contract: 'CONTRACTOR' }

export function jobPostingLd(job: Job) {
  const remote = /remote/i.test(job.location)
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: job.title,
    description: `${job.description} Responsibilities: ${job.responsibilities.join('; ')}.`,
    datePosted: job.created_at.slice(0, 10),
    employmentType: employmentMap[job.employment_type] ?? 'OTHER',
    directApply: true,
    url: `${SITE.url}/jobs/${slugify(job.title)}`,
    hiringOrganization: { '@type': 'Organization', name: SITE.name, sameAs: SITE.website, logo: `${SITE.url}/logo.jpeg` },
    ...(remote ? { jobLocationType: 'TELECOMMUTE', applicantLocationRequirements: { '@type': 'Country', name: 'IN' } } : {}),
    jobLocation: { '@type': 'Place', address: { '@type': 'PostalAddress', addressCountry: 'IN' } },
  }
}
