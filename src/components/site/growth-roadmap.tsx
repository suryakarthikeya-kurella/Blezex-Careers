import { Section, SectionHeader } from './section'
import { Stepper } from './stepper'
import { growthSteps } from '@/lib/content'

export function GrowthRoadmap() {
  return (
    <Section id="growth" tone="paper">
      <SectionHeader eyebrow="Career growth" title="Your growth journey at BlezeX">Start where you are and move up as your skills and results grow.</SectionHeader>
      <Stepper steps={growthSteps} cols={4} goalLast />
      <p className="mt-8 text-sm text-muted">Growth depends on performance, learning and available opportunities.</p>
    </Section>
  )
}
