import Link from 'next/link'
import { ArrowRight, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Container } from './section'
import { SITE } from '@/lib/site'
import { TALENT_POOL_HREF } from '@/lib/talent-pool'
import { slugify } from '@/lib/utils'
import type { Job } from '@/lib/types'

export function Hero({ jobs }: { jobs: Job[] }) {
  return (
    <section className="border-b border-line bg-paper">
      <Container className="grid gap-10 py-12 md:py-16 lg:grid-cols-[1.35fr_1fr] lg:items-center lg:py-20">
        <div>
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-1.5 text-sm text-muted">
            <a href={SITE.website} className="font-medium hover:text-accent">BlezeX</a>
            <ChevronRight aria-hidden className="h-4 w-4" />
            <span aria-current="page" className="font-semibold text-ink">Careers</span>
          </nav>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1 text-sm font-semibold text-ink"><span aria-hidden className="h-2 w-2 rounded-full bg-accent" />We&apos;re hiring</p>
          <h1 className="text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">Start your career with real projects &amp; mentorship</h1>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">Join BlezeX to grow through real client projects, learn from industry mentors, and gain hands-on startup experience that moves your career forward.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/#roles">View open roles <ArrowRight aria-hidden className="h-5 w-5" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href={TALENT_POOL_HREF}>Join talent pool</Link></Button>
          </div>
          <p className="mt-5 text-sm text-muted">Internships and full-time roles &middot; Freshers welcome &middot; Remote / hybrid</p>
        </div>

        <Card className="p-5 shadow-card sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-lg font-extrabold">Hiring now</h2>
            <span className="rounded-full bg-accent/10 px-2.5 py-1 text-xs font-bold text-accent">{jobs.length} open {jobs.length === 1 ? 'role' : 'roles'}</span>
          </div>
          {jobs.length ? (
            <ul className="divide-y divide-line">
              {jobs.map(j => (
                <li key={j.id}>
                  <Link href={`/jobs/${slugify(j.title)}`} className="group flex items-center justify-between gap-3 py-3.5">
                    <span><span className="block font-heading font-bold text-ink group-hover:text-accent">{j.title}</span><span className="text-sm text-muted">{j.department} &middot; {j.employment_type}</span></span>
                    <ChevronRight aria-hidden className="h-5 w-5 shrink-0 text-muted group-hover:text-accent" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p className="text-sm text-muted">No roles are open right now. Join our talent pool and we will contact you when something fits.</p>}
          <Link href={TALENT_POOL_HREF} className="mt-4 flex items-center justify-between rounded-lg bg-paper px-4 py-3 text-sm font-semibold text-ink hover:text-accent">Don&apos;t see your role? Join the talent pool<ArrowRight aria-hidden className="h-4 w-4" /></Link>
        </Card>
      </Container>
    </section>
  )
}
