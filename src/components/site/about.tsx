import { Section } from './section'

export function About() {
  return (
    <Section id="about" tone="paper">
      <div className="grid gap-6 md:grid-cols-[1fr_1.6fr] md:gap-12">
        <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">About us</p><h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">About BlezeX</h2></div>
        <div className="space-y-4 text-base leading-relaxed sm:text-lg">
          <p>BlezeX is a technology and innovation company that helps businesses automate, scale, and grow through AI, web development, automation, and digital transformation.</p>
          <p>We work with businesses across industries, from startups to growing companies.</p>
          <p className="rounded-lg border-l-4 border-accent bg-white p-4 font-heading font-bold text-ink">Our mission: bridge the gap between technology and business growth with solutions that create measurable impact.</p>
        </div>
      </div>
    </Section>
  )
}
