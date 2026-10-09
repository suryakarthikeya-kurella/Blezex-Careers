import { cn } from '@/lib/utils'

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)} {...props} />
}

export function Section({ id, tone = 'white', className, children }: { id?: string; tone?: 'white' | 'paper'; className?: string; children: React.ReactNode }) {
  return (
    <section id={id} className={cn('scroll-mt-16 py-14 md:py-20', tone === 'paper' ? 'bg-paper' : 'bg-white', className)}>
      <Container>{children}</Container>
    </section>
  )
}

export function SectionHeader({ eyebrow, title, children, className }: { eyebrow?: string; title: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('mb-8 max-w-2xl md:mb-10', className)}>
      {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-accent">{eyebrow}</p>}
      <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl md:text-4xl">{title}</h2>
      {children && <p className="mt-3 text-base leading-relaxed text-muted sm:text-lg">{children}</p>}
    </div>
  )
}
