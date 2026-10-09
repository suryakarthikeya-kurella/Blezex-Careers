import { Mail } from 'lucide-react'
import { Container } from './section'
import { SITE } from '@/lib/site'

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-16 bg-white py-10">
      <Container>
        <div className="flex flex-col gap-3 rounded-xl border border-line bg-paper p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white"><Mail aria-hidden className="h-5 w-5 text-accent" /></span>
            <div><h2 className="font-heading text-lg font-extrabold">Questions about careers?</h2><p className="text-sm text-muted">Our recruitment team is happy to help.</p></div>
          </div>
          <a href={`mailto:${SITE.email}`} className="break-all font-heading text-base font-bold text-ink hover:text-accent">{SITE.email}</a>
        </div>
      </Container>
    </section>
  )
}
