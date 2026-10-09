import { Section, SectionHeader } from './section'
import { life } from '@/lib/content'

export function Life() {
  return (
    <Section id="life" tone="paper">
      <SectionHeader eyebrow="Culture" title="Life at BlezeX" />
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {life.map(l => (
          <li key={l.title} className="flex items-start gap-4 rounded-xl border border-line bg-white p-5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent/10"><l.icon aria-hidden className="h-5 w-5 text-accent" strokeWidth={1.75} /></span>
            <div><h3 className="font-bold leading-snug">{l.title}</h3><p className="mt-0.5 text-sm text-muted">{l.text}</p></div>
          </li>
        ))}
      </ul>
    </Section>
  )
}
