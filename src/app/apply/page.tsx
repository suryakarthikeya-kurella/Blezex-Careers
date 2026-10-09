import type { Metadata } from 'next'
import Link from 'next/link'
import { ChevronRight, Mail } from 'lucide-react'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { Container } from '@/components/site/section'
import { ApplicationForm } from '@/components/apply/application-form'
import { Card } from '@/components/ui/card'
import { getJobs } from '@/lib/jobs'
import { slugify } from '@/lib/utils'
import { SITE } from '@/lib/site'
import { TALENT_POOL_TITLE, talentPoolOption } from '@/lib/talent-pool'

export const metadata: Metadata = {
  title: 'Apply Now',
  description: 'Apply for jobs and internships at BlezeX. Complete the short multi-step application in a few minutes.',
  alternates: { canonical: '/apply' },
}
export const dynamic = 'force-dynamic'

const next = ['We review your application.', 'If your profile fits, we contact you by email or phone.', 'Shortlisted candidates are invited to an interview.']

export default async function ApplyPage({ searchParams }: { searchParams: Promise<{ job?: string }> }) {
  const { job } = await searchParams
  const jobs = (await getJobs()).filter(j => j.status === 'active')
  const initial = job === 'talent-pool' ? TALENT_POOL_TITLE : (jobs.find(j => slugify(j.title) === job)?.title ?? '')
  const options = [...jobs.map(j => ({ title: j.title, department: j.department, employment_type: j.employment_type, location: j.location })), talentPoolOption]
  return (
    <>
      <Navbar />
      <main id="main" className="bg-paper py-8 md:py-12">
        <Container>
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-sm text-muted">
            <Link href="/" className="hover:text-accent">Careers</Link><ChevronRight aria-hidden className="h-4 w-4" /><span aria-current="page" className="font-semibold text-ink">Apply</span>
          </nav>
          <h1 className="mb-6 text-3xl font-extrabold sm:text-4xl">Apply to BlezeX</h1>
          <div className="grid gap-8 lg:grid-cols-[1fr_320px] lg:items-start">
            <ApplicationForm jobs={options} initialPosition={initial} />
            <aside className="grid gap-4">
              <Card className="p-5">
                <h2 className="mb-3 font-heading text-lg font-extrabold">What happens next</h2>
                <ol className="space-y-3">{next.map((n, i) => <li key={n} className="flex gap-3 text-sm"><span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-white">{i + 1}</span>{n}</li>)}</ol>
              </Card>
              <Card className="p-5">
                <h2 className="mb-1 font-heading text-lg font-extrabold">Need help?</h2>
                <p className="flex items-start gap-2 text-sm text-muted"><Mail aria-hidden className="mt-0.5 h-4 w-4 shrink-0" /><a href={`mailto:${SITE.email}`} className="break-all font-semibold text-ink hover:text-accent">{SITE.email}</a></p>
              </Card>
            </aside>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  )
}
