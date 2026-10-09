'use client'
import { Button } from '@/components/ui/button'

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">We hit an unexpected problem</h1>
      <p className="mt-3 max-w-md text-muted">Please try again. If it keeps happening, email connect.blezex@gmail.com.</p>
      <Button onClick={reset} size="lg" className="mt-8">Try again</Button>
    </main>
  )
}
