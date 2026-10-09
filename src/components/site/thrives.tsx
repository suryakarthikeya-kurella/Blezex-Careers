import { Check } from 'lucide-react'
import { Section } from './section'
import { thrives } from '@/lib/content'

export function Thrives() {
  return (
    <Section id="thrive">
      <div className="grid gap-8 md:grid-cols-[1fr_1.6fr] md:gap-12">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">Your fit</p><h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">Who thrives at BlezeX?</h2><p className="mt-3 text-muted">People who:</p></div>
        <ul className="grid gap-3 sm:grid-cols-2">
          {thrives.map(t => (
            <li key={t} className="flex items-center gap-3 rounded-xl border border-line bg-white p-4">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-white"><Check aria-hidden className="h-4 w-4" strokeWidth={3} /></span>
              <span className="font-heading font-bold text-ink">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
