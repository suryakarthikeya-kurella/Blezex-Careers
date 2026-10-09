import { LockKeyhole } from 'lucide-react'
import { LoginForm } from '@/components/admin/login-form'
import { Card } from '@/components/ui/card'

export const metadata = { title: 'Admin Login' }

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-md p-6 shadow-card sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <img src="/logo.jpeg" alt="BlezeX" width={48} height={48} className="h-12 w-12 rounded-xl object-cover" />
          <div><p className="font-heading text-lg font-extrabold leading-none">BlezeX Careers</p><p className="mt-1 text-sm text-muted">HR admin</p></div>
        </div>
        <h1 className="mb-1 flex items-center gap-2 text-2xl font-extrabold"><LockKeyhole aria-hidden className="h-5 w-5 text-accent" />Admin sign in</h1>
        <p className="mb-6 text-sm text-muted">Authorized personnel only.</p>
        <LoginForm />
      </Card>
    </main>
  )
}
