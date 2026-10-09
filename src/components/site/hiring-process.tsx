import { Section, SectionHeader } from './section'
import { Stepper } from './stepper'
import { hiringSteps } from '@/lib/content'

export function HiringProcess() {
  return (
    <Section id="process">
      <SectionHeader eyebrow="How we hire" title="Our hiring process">Five simple steps. Most decisions are made within one to two weeks.</SectionHeader>
      <Stepper steps={hiringSteps} cols={5} />
    </Section>
  )
}
