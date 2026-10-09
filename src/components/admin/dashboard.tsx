'use client'
import { useMemo, useState, useTransition } from 'react'
import { AlertCircle, Download, ExternalLink, Eye, Loader2, Mail, Phone, Search, SlidersHorizontal, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Select } from '@/components/ui/input'
import { Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog'
import { cn, formatDate } from '@/lib/utils'
import { STATUSES, type Application, type ApplicationStatus } from '@/lib/types'
import { deleteApplicationAction, updateStatusAction } from '@/app/admin/actions'

const PAGE_SIZE = 25
const safeHref = (u?: string | null) => (u && /^https?:\/\//i.test(u) ? u : undefined)

// Status styles use only brand colours (ink, accent, paper, line)
const statusStyle: Record<ApplicationStatus, string> = {
  Applied: 'border-line bg-white text-ink',
  'Under Review': 'border-ink bg-paper text-ink',
  Shortlisted: 'border-accent bg-accent/10 text-accent',
  'Interview Scheduled': 'border-accent bg-accent text-white',
  Selected: 'border-ink bg-ink text-white',
  Rejected: 'border-line bg-line text-muted',
}

function csvCell(v: unknown) {
  let s = v == null ? '' : String(v)
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}` // blocks spreadsheet formula injection
  return `"${s.replace(/"/g, '""')}"`
}

function exportCsv(rows: Application[]) {
  const cols: [string, (a: Application) => unknown][] = [
    ['Candidate Name', a => a.full_name], ['Position', a => a.position], ['College', a => a.college], ['Degree', a => a.degree], ['Branch', a => a.branch],
    ['Graduation Year', a => a.graduation_year], ['CGPA', a => a.cgpa], ['Phone', a => a.phone], ['Email', a => a.email], ['City', a => a.city], ['State', a => a.state],
    ['Skills', a => a.skills], ['LinkedIn', a => a.linkedin_url], ['GitHub', a => a.github_url], ['Portfolio', a => a.portfolio_url], ['Resume Link', a => a.resume_link],
    ['Why Join BlezeX', a => a.why_join_blezex], ['Available Start Date', a => a.available_start_date], ['Status', a => a.status], ['Applied Date', a => formatDate(a.created_at)],
  ]
  const csv = [cols.map(c => csvCell(c[0])).join(','), ...rows.map(r => cols.map(c => csvCell(c[1](r))).join(','))].join('\r\n')
  const url = URL.createObjectURL(new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' }))
  const a = document.createElement('a')
  a.href = url; a.download = `blezex-applications-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url)
}

function Detail({ label, value, href }: { label: string; value?: string | number | null; href?: string }) {
  if (value === null || value === undefined || value === '') return null
  return (
    <div><dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="break-words text-sm font-medium text-ink">{href ? <a href={href} target="_blank" rel="noopener noreferrer" className="underline hover:text-accent">{value}</a> : value}</dd></div>
  )
}

export function Dashboard({ initial, loadError }: { initial: Application[]; loadError?: string | null }) {
  const [apps, setApps] = useState(initial)
  const [q, setQ] = useState('')
  const [position, setPosition] = useState('')
  const [status, setStatus] = useState('')
  const [college, setCollege] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [visible, setVisible] = useState(PAGE_SIZE)
  const [view, setView] = useState<Application | null>(null)
  const [del, setDel] = useState<Application | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [, startTransition] = useTransition()

  const positions = useMemo(() => [...new Set(apps.map(a => a.position))].sort(), [apps])
  const colleges = useMemo(() => [...new Set(apps.map(a => a.college))].sort((a, b) => a.localeCompare(b)), [apps])

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const digits = term.replace(/[\s+-]/g, '')
    return apps.filter(a =>
      (!term || a.full_name.toLowerCase().includes(term) || a.email.toLowerCase().includes(term) || (digits.length > 0 && a.phone.replace(/[\s+-]/g, '').includes(digits))) &&
      (!position || a.position === position) && (!status || a.status === status) && (!college || a.college === college))
  }, [apps, q, position, status, college])

  const shown = filtered.slice(0, visible)
  const activeFilterCount = [position, status, college].filter(Boolean).length
  const hasFilters = Boolean(q) || activeFilterCount > 0
  const stats: { label: string; value: number; filter: string }[] = [
    { label: 'Total Applications', value: apps.length, filter: '' },
    ...STATUSES.map(s => ({ label: s, value: apps.filter(a => a.status === s).length, filter: s })),
  ]

  const resetPaging = () => setVisible(PAGE_SIZE)
  const clearAll = () => { setQ(''); setPosition(''); setStatus(''); setCollege(''); resetPaging() }

  const changeStatus = (a: Application, next: ApplicationStatus) => {
    if (next === a.status) return
    const prev = a.status
    setError(null); setBusyId(a.id)
    setApps(list => list.map(x => (x.id === a.id ? { ...x, status: next } : x)))
    startTransition(async () => {
      const res = await updateStatusAction(a.id, next)
      if (!res.ok) { setApps(list => list.map(x => (x.id === a.id ? { ...x, status: prev } : x))); setError(res.error ?? 'Could not update the status.') }
      setBusyId(null)
    })
  }

  const confirmDelete = async () => {
    if (!del) return
    setDeleting(true); setError(null)
    const res = await deleteApplicationAction(del.id)
    setDeleting(false)
    if (res.ok) { setApps(list => list.filter(x => x.id !== del.id)); setDel(null) }
    else { setError(res.error ?? 'Could not delete the application.'); setDel(null) }
  }

  const statusSelect = (a: Application, className?: string) => (
    <div className={cn('flex items-center gap-2', className)}>
      <label htmlFor={`st-${a.id}`} className="sr-only">Status for {a.full_name}</label>
      <select id={`st-${a.id}`} value={a.status} disabled={busyId === a.id} onChange={e => changeStatus(a, e.target.value as ApplicationStatus)}
        className={cn('h-10 w-full cursor-pointer rounded-full border px-3 text-sm font-bold md:h-9 md:text-xs', statusStyle[a.status])}>
        {STATUSES.map(s => <option key={s} value={s} className="bg-white text-ink">{s}</option>)}
      </select>
      {busyId === a.id && <Loader2 aria-hidden className="h-4 w-4 shrink-0 animate-spin text-accent" />}
    </div>
  )

  const actions = (a: Application) => {
    const resume = safeHref(a.resume_link)
    return (
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" aria-label={`View ${a.full_name}`} title="View candidate" onClick={() => setView(a)}><Eye aria-hidden className="h-4 w-4" /></Button>
        {resume && <Button asChild variant="outline" size="icon"><a href={resume} target="_blank" rel="noopener noreferrer" aria-label={`Open resume of ${a.full_name}`} title="Open resume link"><ExternalLink aria-hidden className="h-4 w-4" /></a></Button>}
        <Button variant="danger" size="icon" aria-label={`Delete ${a.full_name}`} title="Delete application" onClick={() => setDel(a)}><Trash2 aria-hidden className="h-4 w-4" /></Button>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Stats: tap a card to filter by that status */}
      <section aria-label="Statistics" className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
        {stats.map((s, i) => {
          const active = status === s.filter
          return (
            <button key={s.label} type="button" aria-pressed={i === 0 ? !status : active} onClick={() => { setStatus(s.filter); resetPaging() }}
              className={cn('rounded-xl border p-4 text-left transition hover:border-ink/40', i === 0 ? 'col-span-2 sm:col-span-1' : '', (i === 0 ? !status : active) ? 'border-accent bg-accent/5 ring-1 ring-accent' : 'border-line bg-white')}>
              <p className="font-heading text-3xl font-extrabold leading-none text-ink">{s.value}</p>
              <p className="mt-1.5 text-xs font-semibold leading-tight text-muted sm:text-sm">{s.label}</p>
            </button>
          )
        })}
      </section>

      {(loadError || error) && (
        <p role="alert" className="flex items-start gap-2 rounded-lg border border-accent bg-accent/5 p-3 text-sm font-medium text-ink"><AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{loadError || error}</p>
      )}

      {/* Search & filters */}
      <Card className="p-3 sm:p-4">
        <section aria-label="Search and filters" className="grid gap-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <label htmlFor="search" className="sr-only">Search by name, email or phone</label>
              <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              <Input id="search" type="search" value={q} onChange={e => { setQ(e.target.value); resetPaging() }} placeholder="Search name, email or phone" className="pl-10" />
            </div>
            <Button variant="outline" className="relative md:hidden" aria-expanded={showFilters} aria-controls="filter-panel" onClick={() => setShowFilters(s => !s)}>
              <SlidersHorizontal aria-hidden className="h-4 w-4" /><span className="sr-only sm:not-sr-only">Filters</span>
              {activeFilterCount > 0 && <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-white">{activeFilterCount}</span>}
            </Button>
            <Button variant="outline" className="hidden md:inline-flex" onClick={() => exportCsv(filtered)} disabled={!filtered.length}><Download aria-hidden className="h-4 w-4" />Export CSV</Button>
          </div>
          <div id="filter-panel" className={cn('grid-cols-1 gap-3 md:grid md:grid-cols-3', showFilters ? 'grid' : 'hidden')}>
            <div><label htmlFor="f-position" className="sr-only">Filter by position</label><Select id="f-position" value={position} onChange={e => { setPosition(e.target.value); resetPaging() }}><option value="">All positions</option>{positions.map(p => <option key={p}>{p}</option>)}</Select></div>
            <div><label htmlFor="f-status" className="sr-only">Filter by status</label><Select id="f-status" value={status} onChange={e => { setStatus(e.target.value); resetPaging() }}><option value="">All statuses</option>{STATUSES.map(s => <option key={s}>{s}</option>)}</Select></div>
            <div><label htmlFor="f-college" className="sr-only">Filter by college</label><Select id="f-college" value={college} onChange={e => { setCollege(e.target.value); resetPaging() }}><option value="">All colleges</option>{colleges.map(c => <option key={c}>{c}</option>)}</Select></div>
            <Button variant="outline" className="md:hidden" onClick={() => exportCsv(filtered)} disabled={!filtered.length}><Download aria-hidden className="h-4 w-4" />Export CSV</Button>
          </div>
        </section>
      </Card>

      <section aria-label="Applications">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted" aria-live="polite">Showing {shown.length} of {filtered.length}{filtered.length !== apps.length ? ` (${apps.length} total)` : ''}</p>
          {hasFilters && <button type="button" onClick={clearAll} className="text-sm font-semibold text-accent hover:underline">Clear filters</button>}
        </div>

        {filtered.length === 0 && (
          <Card className="px-4 py-12 text-center text-muted">{apps.length ? 'No applications match your search or filters.' : 'No applications yet. They will appear here when candidates apply.'}</Card>
        )}

        {/* Mobile: one card per candidate */}
        {filtered.length > 0 && (
          <ul className="grid gap-3 md:hidden">
            {shown.map(a => (
              <li key={a.id}>
                <Card className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0"><h3 className="font-heading text-lg font-extrabold leading-tight">{a.full_name}</h3><p className="text-sm font-semibold text-accent">{a.position}</p></div>
                    <span className="shrink-0 text-xs text-muted">{formatDate(a.created_at)}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">{a.college}</p>
                  <div className="mt-3 grid gap-2 text-sm">
                    <a href={`tel:${a.phone.replace(/\s/g, '')}`} className="flex min-h-[2.5rem] items-center gap-2 rounded-lg bg-paper px-3 font-medium text-ink"><Phone aria-hidden className="h-4 w-4 text-accent" />{a.phone}</a>
                    <a href={`mailto:${a.email}`} className="flex min-h-[2.5rem] items-center gap-2 break-all rounded-lg bg-paper px-3 font-medium text-ink"><Mail aria-hidden className="h-4 w-4 shrink-0 text-accent" />{a.email}</a>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    {statusSelect(a, 'min-w-0 flex-1')}
                    {actions(a)}
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        )}

        {/* Desktop / tablet: table */}
        {filtered.length > 0 && (
          <div className="hidden overflow-x-auto rounded-xl border border-line bg-white md:block">
            <table className="w-full min-w-[980px] text-left text-sm">
              <caption className="sr-only">Candidate applications</caption>
              <thead className="border-b border-line bg-paper">
                <tr>{['Candidate Name', 'Position', 'College', 'Phone Number', 'Email', 'Resume Link', 'Status', 'Applied Date', 'Actions'].map(h => <th key={h} scope="col" className="whitespace-nowrap px-4 py-3 font-heading font-bold text-ink">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map(a => {
                  const resume = safeHref(a.resume_link)
                  return (
                    <tr key={a.id} className="align-middle hover:bg-paper/60">
                      <td className="px-4 py-3 font-bold text-ink">{a.full_name}</td>
                      <td className="px-4 py-3">{a.position}</td>
                      <td className="max-w-[200px] px-4 py-3">{a.college}</td>
                      <td className="whitespace-nowrap px-4 py-3"><a href={`tel:${a.phone.replace(/\s/g, '')}`} className="hover:text-accent">{a.phone}</a></td>
                      <td className="px-4 py-3"><a href={`mailto:${a.email}`} className="break-all hover:text-accent">{a.email}</a></td>
                      <td className="px-4 py-3">{resume ? <a href={resume} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-bold text-accent hover:underline">Resume<ExternalLink aria-hidden className="h-3.5 w-3.5" /></a> : '—'}</td>
                      <td className="px-4 py-3">{statusSelect(a, 'min-w-[10.5rem]')}</td>
                      <td className="whitespace-nowrap px-4 py-3">{formatDate(a.created_at)}</td>
                      <td className="px-4 py-3">{actions(a)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > shown.length && (
          <div className="mt-4 text-center"><Button variant="outline" size="lg" onClick={() => setVisible(v => v + PAGE_SIZE)}>Show more ({filtered.length - shown.length} remaining)</Button></div>
        )}
      </section>

      {/* View candidate */}
      <Dialog open={!!view} onOpenChange={o => !o && setView(null)}>
        <DialogContent>
          {view && (<>
            <DialogTitle>{view.full_name}</DialogTitle>
            <DialogDescription>Applied for {view.position} on {formatDate(view.created_at)}</DialogDescription>
            <dl className="mt-5 grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <Detail label="Email" value={view.email} href={`mailto:${view.email}`} />
              <Detail label="Phone" value={view.phone} href={`tel:${view.phone.replace(/\s/g, '')}`} />
              <Detail label="Location" value={`${view.city}, ${view.state}`} />
              <Detail label="Status" value={view.status} />
              <Detail label="College" value={view.college} />
              <Detail label="Degree" value={`${view.degree}, ${view.branch}`} />
              <Detail label="Graduation year" value={view.graduation_year} />
              <Detail label="CGPA" value={view.cgpa} />
              <Detail label="Available from" value={view.available_start_date} />
              <Detail label="Skills" value={view.skills} />
              <Detail label="Resume" value={view.resume_link} href={safeHref(view.resume_link)} />
              <Detail label="LinkedIn" value={view.linkedin_url} href={safeHref(view.linkedin_url)} />
              <Detail label="GitHub" value={view.github_url} href={safeHref(view.github_url)} />
              <Detail label="Portfolio" value={view.portfolio_url} href={safeHref(view.portfolio_url)} />
            </dl>
            {view.why_join_blezex && <div className="mt-5 rounded-lg border-l-4 border-accent bg-paper p-4"><p className="text-xs font-semibold uppercase tracking-wide text-muted">Why join BlezeX</p><p className="mt-1 whitespace-pre-wrap text-sm">{view.why_join_blezex}</p></div>}
          </>)}
        </DialogContent>
      </Dialog>

      {/* Delete confirm */}
      <Dialog open={!!del} onOpenChange={o => !o && !deleting && setDel(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Delete application?</DialogTitle>
          <DialogDescription>This permanently removes the application from {del?.full_name}. This cannot be undone.</DialogDescription>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end">
            <Button variant="outline" onClick={() => setDel(null)} disabled={deleting}>Cancel</Button>
            <Button onClick={confirmDelete} disabled={deleting}>{deleting ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Trash2 aria-hidden className="h-4 w-4" />}Delete</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
