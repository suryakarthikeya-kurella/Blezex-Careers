'use client'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { ArrowRight, Building, CalendarClock, MapPin, Search, SearchX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input, Select } from '@/components/ui/input'
import { Section, SectionHeader } from './section'
import { TALENT_POOL_HREF } from '@/lib/talent-pool'
import { slugify } from '@/lib/utils'
import type { Job } from '@/lib/types'

export function JobBoard({ jobs }: { jobs: Job[] }) {
  const [q, setQ] = useState('')
  const [dept, setDept] = useState('')
  const [type, setType] = useState('')

  const depts = useMemo(() => [...new Set(jobs.map(j => j.department))].sort(), [jobs])
  const types = useMemo(() => [...new Set(jobs.map(j => j.employment_type))].sort(), [jobs])
  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase()
    return jobs.filter(j =>
      (!t || [j.title, j.department, j.description].some(v => v.toLowerCase().includes(t))) &&
      (!dept || j.department === dept) && (!type || j.employment_type === type))
  }, [jobs, q, dept, type])
  const filtering = Boolean(q || dept || type)

  return (
    <Section id="roles">
      <SectionHeader eyebrow="Open roles" title="Find your role">Jobs and internships open for applications right now.</SectionHeader>

      <div className="grid gap-3 md:grid-cols-[2fr_1fr_1fr]">
        <div className="relative">
          <label htmlFor="role-search" className="sr-only">Search roles</label>
          <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input id="role-search" type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search roles, e.g. marketing" className="pl-10" />
        </div>
        <div><label htmlFor="role-dept" className="sr-only">Department</label><Select id="role-dept" value={dept} onChange={e => setDept(e.target.value)}><option value="">All departments</option>{depts.map(d => <option key={d}>{d}</option>)}</Select></div>
        <div><label htmlFor="role-type" className="sr-only">Job type</label><Select id="role-type" value={type} onChange={e => setType(e.target.value)}><option value="">All job types</option>{types.map(t => <option key={t}>{t}</option>)}</Select></div>
      </div>

      <div className="mb-3 mt-5 flex items-center justify-between text-sm">
        <p className="font-semibold text-ink" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'role' : 'roles'}{filtering ? ' match your search' : ' open'}</p>
        {filtering && <button type="button" onClick={() => { setQ(''); setDept(''); setType('') }} className="font-semibold text-accent hover:underline">Clear filters</button>}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-line bg-paper px-6 py-12 text-center">
          <SearchX aria-hidden className="mx-auto mb-3 h-8 w-8 text-muted" />
          <p className="font-heading text-lg font-bold">{jobs.length ? 'No roles match your search' : 'No open roles right now'}</p>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted">Join our talent pool and we will contact you when a suitable role opens.</p>
          <Button asChild className="mt-5"><Link href={TALENT_POOL_HREF}>Join talent pool</Link></Button>
        </div>
      ) : (
        <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
          {filtered.map(j => {
            const slug = slugify(j.title)
            return (
              <li key={j.id} className="flex flex-col gap-4 p-5 transition hover:bg-paper/60 sm:p-6 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <h3 className="text-lg font-bold leading-snug sm:text-xl"><Link href={`/jobs/${slug}`} className="hover:text-accent">{j.title}</Link></h3>
                  <ul className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted">
                    <li><Badge>{j.employment_type}</Badge></li>
                    <li className="flex items-center gap-1.5"><Building aria-hidden className="h-4 w-4" /><span className="sr-only">Department: </span>{j.department}</li>
                    <li className="flex items-center gap-1.5"><MapPin aria-hidden className="h-4 w-4" /><span className="sr-only">Location: </span>{j.location}</li>
                    {j.duration && <li className="flex items-center gap-1.5"><CalendarClock aria-hidden className="h-4 w-4" /><span className="sr-only">Duration: </span>{j.duration}</li>}
                  </ul>
                  <p className="mt-2 line-clamp-2 max-w-3xl text-[15px] leading-relaxed">{j.description}</p>
                </div>
                <div className="grid shrink-0 grid-cols-2 gap-2 md:flex">
                  <Button asChild variant="outline"><Link href={`/jobs/${slug}`}>View role</Link></Button>
                  <Button asChild><Link href={`/apply?job=${slug}`}>Apply <ArrowRight aria-hidden className="h-4 w-4" /></Link></Button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Section>
  )
}
