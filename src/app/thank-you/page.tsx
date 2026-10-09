import Link from 'next/link'
import type { Metadata } from 'next'
import { CheckCircle2 } from 'lucide-react'
import { Navbar } from '@/components/site/navbar'
import { Footer } from '@/components/site/footer'
import { Container } from '@/components/site/section'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export const metadata: Metadata = { title: 'Application received', robots: { index: false, follow: false } }

const next = ['Our team reviews your application.', 'If your profile fits, we will contact you by email or phone.', 'Shortlisted candidates are invited to an interview.']

export default function ThankYouPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="bg-paper py-12 md:py-20">
        <Container>
          <Card className="mx-auto max-w-xl p-6 text-center shadow-card sm:p-10">
            <CheckCircle2 aria-hidden className="mx-auto mb-4 h-14 w-14 text-accent" />
            <h1 className="text-3xl font-extrabold sm:text-4xl">Application received</h1>
            <p className="mt-3 text-muted">Thank you for your interest in BlezeX. Here is what happens next.</p>
            <ol className="mx-auto mt-6 max-w-md space-y-3 text-left">
              {next.map((n, i) => <li key={n} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">{i + 1}</span>{n}</li>)}
            </ol>
            <Button asChild size="lg" className="mt-8 w-full sm:w-auto"><Link href="/">Back to Careers</Link></Button>
          </Card>
        </Container>
      </main>
      <Footer />
    </>
  )
}
