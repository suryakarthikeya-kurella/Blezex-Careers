import { Section, SectionHeader } from './section'
import { whyJoin } from '@/lib/content'

export function WhyJoin() {
  return (
    <Section id="why-join">
      <SectionHeader eyebrow="Why BlezeX" title="Why join BlezeX" />
      <ul className="grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
        {whyJoin.map(w => (
          <li key={w.title}>
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10"><w.icon aria-hidden className="h-6 w-6 text-accent" strokeWidth={1.75} /></span>
            <h3 className="text-lg font-bold">{w.title}</h3>
            <p className="mt-1 text-[15px] leading-relaxed text-muted">{w.text}</p>
          </li>
        ))}
      </ul>
    </Section>
  )
}
