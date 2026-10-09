import { Navbar } from '@/components/site/navbar'
import { Hero } from '@/components/site/hero'
import { JobBoard } from '@/components/site/job-board'
import { About } from '@/components/site/about'
import { WhyJoin } from '@/components/site/why-join'
import { GrowthRoadmap } from '@/components/site/growth-roadmap'
import { Thrives } from '@/components/site/thrives'
import { Life } from '@/components/site/life'
import { HiringProcess } from '@/components/site/hiring-process'
import { Faq } from '@/components/site/faq'
import { Contact } from '@/components/site/contact'
import { FinalCta } from '@/components/site/final-cta'
import { Footer } from '@/components/site/footer'
import { getJobs } from '@/lib/jobs'

export const revalidate = 300 // refresh job listings from Supabase every 5 minutes

export default async function HomePage() {
  const jobs = (await getJobs()).filter(j => j.status === 'active')
  return (
    <>
      <Navbar />
      <main id="main">
        <Hero jobs={jobs} /><JobBoard jobs={jobs} /><About /><WhyJoin /><GrowthRoadmap /><Thrives /><Life /><HiringProcess /><Faq /><Contact /><FinalCta />
      </main>
      <Footer />
    </>
  )
}
