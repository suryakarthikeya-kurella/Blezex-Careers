'use client'
import { Button } from '@/components/ui/button'

export default function AdminError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Dashboard error</p>
      <h1 className="mt-2 text-3xl font-extrabold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted">Please try again. If it continues, check the server logs.</p>
      <Button onClick={reset} size="lg" className="mt-6">Try again</Button>
    </main>
  )
}
