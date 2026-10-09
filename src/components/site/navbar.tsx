'use client'
import Link from 'next/link'
import { useState } from 'react'
import { ExternalLink, Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Container } from './section'
import { SITE } from '@/lib/site'
import { TALENT_POOL_HREF } from '@/lib/talent-pool'

const links = [['Open roles', '/#roles'], ['About', '/#about'], ['Life at BlezeX', '/#life'], ['Hiring process', '/#process'], ['FAQ', '/#faq']]

export function Navbar() {
  const [open, setOpen] = useState(false)
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
      <Container>
        <nav aria-label="Main" className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3" aria-label="BlezeX Careers home">
            <img src="/logo.jpeg" alt="" width={36} height={36} className="h-9 w-9 rounded-lg object-cover" />
            <span className="flex items-baseline gap-2 font-heading text-lg font-extrabold text-ink">Bleze<span className="-ml-2 text-accent">X</span><span className="h-4 w-px self-center bg-line" /><span className="text-base font-semibold text-muted">Careers</span></span>
          </Link>
          <ul className="hidden items-center gap-7 lg:flex">
            {links.map(([l, h]) => <li key={h}><Link href={h} className="text-sm font-semibold text-ink hover:text-accent">{l}</Link></li>)}
          </ul>
          <div className="flex items-center gap-2">
            <a href={SITE.website} className="hidden items-center gap-1.5 px-2 text-sm font-semibold text-muted hover:text-ink xl:flex">blezex.com<ExternalLink aria-hidden className="h-3.5 w-3.5" /></a>
            <Button asChild size="sm" className="hidden sm:inline-flex"><Link href={TALENT_POOL_HREF}>Join talent pool</Link></Button>
            <button type="button" className="flex h-10 w-10 items-center justify-center rounded-lg border border-line lg:hidden" aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(o => !o)}>
              {open ? <X aria-hidden className="h-5 w-5" /> : <Menu aria-hidden className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </Container>
      {open && (
        <div id="mobile-menu" className="border-t border-line bg-white lg:hidden">
          <Container className="pb-5">
            <ul className="py-2">
              {links.map(([l, h]) => <li key={h}><Link href={h} onClick={() => setOpen(false)} className="block border-b border-line py-3.5 font-heading text-base font-bold text-ink">{l}</Link></li>)}
              <li><a href={SITE.website} className="flex items-center gap-2 py-3.5 font-heading text-base font-bold text-muted">Visit blezex.com<ExternalLink aria-hidden className="h-4 w-4" /></a></li>
            </ul>
            <Button asChild size="lg" className="w-full"><Link href={TALENT_POOL_HREF} onClick={() => setOpen(false)}>Join talent pool</Link></Button>
          </Container>
        </div>
      )}
    </header>
  )
}
