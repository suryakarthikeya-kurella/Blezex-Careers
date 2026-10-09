import Link from 'next/link'
import { Container } from './section'
import { SITE } from '@/lib/site'
import { TALENT_POOL_HREF } from '@/lib/talent-pool'

export function Footer() {
  return (
    <footer className="border-t border-line bg-white">
      <Container className="flex flex-col gap-6 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <img src="/logo.jpeg" alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />
          <div><p className="font-heading text-base font-extrabold text-ink">{SITE.name} Careers</p><p className="text-sm text-muted">{SITE.tagline}</p></div>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-semibold">
          <Link href="/#roles" className="text-ink hover:text-accent">Open roles</Link>
          <Link href={TALENT_POOL_HREF} className="text-ink hover:text-accent">Talent pool</Link>
          <a href={SITE.website} className="text-ink hover:text-accent">{SITE.websiteLabel}</a>
          <a href={`mailto:${SITE.email}`} className="break-all text-ink hover:text-accent">{SITE.email}</a>
        </nav>
      </Container>
      <div className="border-t border-line"><Container className="py-4 text-sm text-muted">&copy; {new Date().getFullYear()} {SITE.name}. All rights reserved.</Container></div>
    </footer>
  )
}
