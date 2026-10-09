import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Container } from './section'
import { TALENT_POOL_HREF } from '@/lib/talent-pool'

export function FinalCta() {
  return (
    <section id="join" className="bg-white pb-14 pt-4 md:pb-20">
      <Container>
        <div className="rounded-2xl bg-ink px-6 py-12 text-center sm:px-12 md:py-16">
          <h2 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight !text-white sm:text-4xl md:text-5xl">Ready to build your <span className="text-accent">career?</span></h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-white/80 sm:text-lg">Join BlezeX and gain hands-on industry experience through real projects, mentorship, and growth opportunities.</p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg"><Link href="/apply">Apply now</Link></Button>
            <Button asChild size="lg" variant="outline" className="border-white/30 bg-transparent text-white hover:border-white hover:bg-transparent"><Link href={TALENT_POOL_HREF}>Join talent pool</Link></Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
