import 'server-only'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const isSupabaseConfigured = () =>
  Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)

let client: SupabaseClient | null = null

/** Server-only client using the secret key. Never import this into a client component. */
export function getSupabase(): SupabaseClient | null {
  if (!isSupabaseConfigured()) return null
  client ??= createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  return client
}
