import { cn } from '@/lib/utils'

interface Props extends React.HTMLAttributes<HTMLDivElement> { hover?: boolean }

export function Card({ className, hover = false, ...props }: Props) {
  return <div className={cn('relative rounded-xl border border-line bg-white', hover && 'transition hover:border-ink/30 hover:shadow-card', className)} {...props} />
}
