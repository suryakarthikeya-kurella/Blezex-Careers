import { Card } from '@/components/ui/card'

/** All values are masked. The real email is masked on the server before it reaches this component. */
export function ProfileCard({ maskedEmail }: { maskedEmail: string }) {
  const rows = [['Role', 'Super Admin'], ['Email', maskedEmail], ['Password', '************']]
  return (
    <Card className="p-4 sm:p-5">
      <div className="flex items-center gap-3">
        <span aria-hidden className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent font-heading text-lg font-extrabold text-white">B</span>
        <div className="min-w-0 flex-1">
          <p className="font-heading text-base font-extrabold leading-tight text-ink">BlezeX Admin</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm font-semibold text-ink"><span aria-hidden className="h-2 w-2 rounded-full bg-accent" />Status: Active</p>
        </div>
      </div>
      <dl className="mt-4 grid gap-2 border-t border-line pt-3 text-sm">
        {rows.map(([k, v]) => <div key={k} className="flex items-center justify-between gap-4"><dt className="text-muted">{k}</dt><dd className="break-all text-right font-semibold text-ink">{v}</dd></div>)}
      </dl>
    </Card>
  )
}
