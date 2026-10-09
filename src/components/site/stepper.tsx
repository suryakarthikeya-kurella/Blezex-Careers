import { cn } from '@/lib/utils'

/** Horizontal on desktop, vertical on mobile. Used for the growth path and the hiring process. */
export function Stepper({ steps, cols = 4, goalLast = false }: { steps: { title: string; text: string }[]; cols?: 4 | 5; goalLast?: boolean }) {
  return (
    <ol className={cn('relative grid gap-8 lg:gap-6', cols === 5 ? 'lg:grid-cols-5' : 'lg:grid-cols-4')}>
      <span aria-hidden className="absolute bottom-5 left-5 top-5 w-px bg-line lg:bottom-auto lg:left-5 lg:right-5 lg:top-5 lg:h-px lg:w-auto" />
      {steps.map((s, i) => {
        const goal = goalLast && i === steps.length - 1
        return (
          <li key={s.title} className="relative pl-14 lg:pl-0 lg:pt-14">
            <span className={cn('absolute left-0 top-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 font-heading text-sm font-extrabold', goal ? 'border-accent bg-accent text-white' : 'border-ink bg-white text-ink')}>{i + 1}</span>
            <h3 className="text-lg font-bold leading-snug">{s.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
          </li>
        )
      })}
    </ol>
  )
}
