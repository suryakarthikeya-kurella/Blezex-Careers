'use client'
import { useActionState } from 'react'
import { AlertCircle, Loader2, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { loginAction } from '@/app/admin/actions'
import type { LoginState } from '@/lib/types'

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(loginAction, {})
  return (
    <form action={action} className="grid gap-5">
      <div>
        <label htmlFor="email" className="label">Email</label>
        <Input id="email" name="email" type="email" required autoComplete="username" aria-invalid={state.error ? true : undefined} />
      </div>
      <div>
        <label htmlFor="password" className="label">Password</label>
        <Input id="password" name="password" type="password" required autoComplete="current-password" aria-invalid={state.error ? true : undefined} />
      </div>
      {state.error && <p role="alert" className="flex items-center gap-2 rounded-lg border border-accent bg-accent/5 p-3 text-sm font-medium text-ink"><AlertCircle aria-hidden className="h-4 w-4 shrink-0 text-accent" />{state.error}</p>}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? <><Loader2 aria-hidden className="h-5 w-5 animate-spin" />Signing in&hellip;</> : <><LogIn aria-hidden className="h-5 w-5" />Sign in</>}
      </Button>
    </form>
  )
}
