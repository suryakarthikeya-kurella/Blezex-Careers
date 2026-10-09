'use server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createHash, timingSafeEqual } from 'node:crypto'
import { requireAdmin } from '@/lib/admin-auth'
import { SESSION_COOKIE, SESSION_MAX_AGE, createSessionToken } from '@/lib/session'
import { getSupabase } from '@/lib/supabase'
import { isUuid } from '@/lib/utils'
import { STATUSES, type LoginState } from '@/lib/types'

const digest = (s: string) => createHash('sha256').update(s).digest()
const safeEqual = (a: string, b: string) => timingSafeEqual(digest(a), digest(b))

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminEmail || !adminPassword || !process.env.ADMIN_SESSION_SECRET) {
    return { error: 'Admin login is not configured on the server.' }
  }
  // Compare both values every time so response time does not reveal which one was wrong
  const emailOk = safeEqual(email, adminEmail)
  const passwordOk = safeEqual(password, adminPassword)
  if (!(emailOk && passwordOk)) {
    await new Promise(r => setTimeout(r, 800)) // slows down guessing
    return { error: 'Invalid email or password.' }
  }

  const store = await cookies()
  store.set(SESSION_COOKIE, await createSessionToken(), {
    httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: SESSION_MAX_AGE,
  })
  redirect('/admin')
}

export async function logoutAction() {
  const store = await cookies()
  store.delete(SESSION_COOKIE)
  redirect('/admin/login')
}

export async function updateStatusAction(id: string, status: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin()
  if (!isUuid(id) || !(STATUSES as readonly string[]).includes(status)) return { ok: false, error: 'Invalid request.' }
  const sb = getSupabase()
  if (!sb) return { ok: false, error: 'Supabase is not configured.' }
  const { error } = await sb.from('applications').update({ status }).eq('id', id)
  return error ? { ok: false, error: 'Could not update the status. Please try again.' } : { ok: true }
}

export async function deleteApplicationAction(id: string): Promise<{ ok: boolean; error?: string }> {
  await requireAdmin()
  if (!isUuid(id)) return { ok: false, error: 'Invalid request.' }
  const sb = getSupabase()
  if (!sb) return { ok: false, error: 'Supabase is not configured.' }
  const { error } = await sb.from('applications').delete().eq('id', id)
  return error ? { ok: false, error: 'Could not delete the application. Please try again.' } : { ok: true }
}
