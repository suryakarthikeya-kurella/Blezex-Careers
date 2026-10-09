import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArrowRight, Building, CalendarClock, Check, ChevronRight, Mail, MapPin } from 'lucide-react'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { Container } from '@/components/site/section'
import { JsonLd } from '@/components/site/json-ld'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { getJobs } from '@/lib/jobs'
import { jobExtras } from '@/lib/content'
import { jobPostingLd } from '@/lib/jsonld'
import { SITE } from '@/lib/site'
import { slugify } from '@/lib/utils'
import type { Job } from '@/lib/types'

export const revalidate = 300

type Props = { params: Promise<{ slug: string }> }

async function findJob(slug: string) {
  const jobs = (await getJobs()).filter(j => j.status === 'active')
  return { job: jobs.find(j => slugify(j.title) === slug), others: jobs.filter(j => slugify(j.title) !== slug) }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { job } = await findJob(slug)
  if (!job) return { title: 'Role not found', robots: { index: false } }
  return {
    title: `${job.title} (${job.employment_type})`,
    description: `${job.description} Apply for the ${job.title} role at ${SITE.name}.`,
    alternates: { canonical: `/jobs/${slug}` },
    openGraph: { title: `${job.title} at ${SITE.name}`, description: job.description, url: `${SITE.url}/jobs/${slug}`, type: 'website' },
  }
}

function Block({ title, items, check = false }: { title: string; items: string[]; check?: boolean }) {
  if (!items.length) return null
  return (
    <section className="py-6">
      <h2 className="mb-3 text-xl font-extrabold">{title}</h2>
      <ul className="space-y-2.5">
        {items.map(i => (
          <li key={i} className="flex gap-3 leading-relaxed">
            {check ? <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-accent" strokeWidth={3} /> : <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />}{i}
          </li>
        ))}
      </ul>
    </section>
  )
}

function Fact({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-accent" />
      <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt><dd className="font-semibold text-ink">{value}</dd></div>
    </div>
  )
}

export default async function JobPage({ params }: Props) {
  const { slug } = await params
  const { job, others } = await findJob(slug)
  if (!job) notFound()
  const extras = jobExtras[job.title]

  return (
    <>
      <Navbar />
      <main id="main" className="pb-24 lg:pb-0">
        <section className="border-b border-line bg-paper">
          <Container className="py-8 md:py-12">
            <nav aria-label="Breadcrumb" className="mb-4 flex flex-wrap items-center gap-1.5 text-sm text-muted">
              <Link href="/" className="hover:text-accent">Careers</Link><ChevronRight aria-hidden className="h-4 w-4" />
              <Link href="/#roles" className="hover:text-accent">Open roles</Link><ChevronRight aria-hidden className="h-4 w-4" />
              <span aria-current="page" className="font-semibold text-ink">{job.title}</span>
            </nav>
            <div className="flex flex-wrap gap-2"><Badge className="bg-white">{job.department}</Badge><Badge className="border-accent bg-accent text-white">{job.employment_type}</Badge></div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl md:text-5xl">{job.title}</h1>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted sm:text-base">
              <li className="flex items-center gap-2"><MapPin aria-hidden className="h-4 w-4 text-accent" />{job.location}</li>
              {job.duration && <li className="flex items-center gap-2"><CalendarClock aria-hidden className="h-4 w-4 text-accent" />{job.duration}</li>}
              <li className="flex items-center gap-2"><Building aria-hidden className="h-4 w-4 text-accent" />{job.department}</li>
            </ul>
          </Container>
        </section>

        <Container className="grid gap-10 py-8 md:py-12 lg:grid-cols-[1fr_340px]">
          <article className="divide-y divide-line">
            <section className="pb-6"><h2 className="mb-3 text-xl font-extrabold">About the role</h2><p className="text-base leading-relaxed sm:text-lg">{job.description}</p></section>
            {extras && (
              <section className="py-6">
                <div className="rounded-xl border-l-4 border-accent bg-paper p-5"><h2 className="text-lg font-extrabold">Who should apply?</h2><p className="mt-1 leading-relaxed">{extras.who}</p></div>
              </section>
            )}
            {extras && <Block title="What you'll learn" items={extras.learn} check />}
            <Block title="Responsibilities" items={job.responsibilities} />
            <Block title="Requirements" items={job.requirements} />
            <Block title="Qualification" items={job.qualification} />
            <Block title="Benefits" items={job.benefits} check />
          </article>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <Card className="p-6 shadow-card">
              <h2 className="font-heading text-xl font-extrabold">Interested in this role?</h2>
              <dl className="my-5 grid gap-4">
                <Fact icon={Building} label="Department" value={job.department} />
                <Fact icon={Check} label="Job type" value={job.employment_type} />
                <Fact icon={MapPin} label="Location" value={job.location} />
                {job.duration && <Fact icon={CalendarClock} label="Duration" value={job.duration} />}
              </dl>
              <Button asChild size="lg" className="w-full"><Link href={`/apply?job=${slug}`}>Apply now <ArrowRight aria-hidden className="h-5 w-5" /></Link></Button>
              <p className="mt-4 flex items-center gap-2 text-sm text-muted"><Mail aria-hidden className="h-4 w-4 shrink-0" /><span>Questions? <a href={`mailto:${SITE.email}`} className="break-all font-semibold text-ink hover:text-accent">{SITE.email}</a></span></p>
            </Card>
          </aside>
        </Container>

        {others.length > 0 && (
          <section className="border-t border-line bg-paper py-12">
            <Container>
              <h2 className="mb-5 text-2xl font-extrabold">More open roles</h2>
              <ul className="grid gap-4 md:grid-cols-3">
                {others.slice(0, 3).map((o: Job) => (
                  <li key={o.id}>
                    <Link href={`/jobs/${slugify(o.title)}`} className="block h-full rounded-xl border border-line bg-white p-5 transition hover:border-ink/30 hover:shadow-card">
                      <h3 className="font-heading text-lg font-bold">{o.title}</h3>
                      <p className="mt-1 text-sm text-muted">{o.department} &middot; {o.employment_type}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-accent">View role <ArrowRight aria-hidden className="h-4 w-4" /></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </Container>
          </section>
        )}
      </main>
      <Footer />

      {/* Mobile: apply button always within reach */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white p-3 lg:hidden" style={{ paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}>
        <Button asChild size="lg" className="w-full"><Link href={`/apply?job=${slug}`}>Apply now</Link></Button>
      </div>
      <JsonLd data={jobPostingLd(job)} />
    </>
  )
}
