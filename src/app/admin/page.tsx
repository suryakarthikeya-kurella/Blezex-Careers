import { LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Dashboard } from '@/components/admin/dashboard'
import { ProfileCard } from '@/components/admin/profile-card'
import { requireAdmin } from '@/lib/admin-auth'
import { getSupabase } from '@/lib/supabase'
import { maskEmail } from '@/lib/utils'
import type { Application } from '@/lib/types'
import { logoutAction } from './actions'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Dashboard' }

export default async function AdminPage() {
  await requireAdmin()

  let apps: Application[] = []
  let loadError: string | null = null
  const sb = getSupabase()
  if (!sb) {
    loadError = 'Supabase is not connected yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the server.'
  } else {
    const { data, error } = await sb.from('applications').select('*').order('created_at', { ascending: false }).limit(5000)
    if (error) loadError = `Could not load applications: ${error.message}. Check that you ran supabase/schema.sql.`
    else apps = (data ?? []) as Application[]
  }

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <img src="/logo.jpeg" alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg object-cover" />
            <p className="truncate font-heading text-base font-extrabold text-ink sm:text-lg">Bleze<span className="text-accent">X</span> <span className="font-semibold text-muted">HR Dashboard</span></p>
          </div>
          <form action={logoutAction}><Button variant="outline" size="sm"><LogOut aria-hidden className="h-4 w-4" /><span className="hidden sm:inline">Log out</span><span className="sr-only sm:hidden">Log out</span></Button></form>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <div className="mb-6 grid gap-5 lg:grid-cols-[1fr_340px] lg:items-start">
          <div><h1 className="text-3xl font-extrabold sm:text-4xl">Applications</h1><p className="mt-1 text-muted">Review candidates, update their status and export your data.</p></div>
          <ProfileCard maskedEmail={maskEmail(process.env.ADMIN_EMAIL ?? '')} />
        </div>
        <Dashboard initial={apps} loadError={loadError} />
      </main>
    </>
  )
}
