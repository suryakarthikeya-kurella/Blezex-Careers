import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-paper px-5 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Error 404</p>
      <h1 className="mt-2 text-4xl font-extrabold sm:text-5xl">Page not found</h1>
      <p className="mt-3 max-w-md text-muted">The page or role you are looking for does not exist, or may no longer be open.</p>
      <Button asChild size="lg" className="mt-8"><Link href="/#roles">See open roles</Link></Button>
    </main>
  )
}
