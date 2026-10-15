import 'server-only'
import { getSupabase } from './supabase'
import { fallbackColleges } from './colleges-data'
import type { College } from './types'

/** Loads active partner colleges from Supabase. Falls back to static list if Supabase is unavailable or table is empty. */
export async function getColleges(): Promise<College[]> {
  const sb = getSupabase()
  if (!sb) return fallbackColleges

  try {
    const { data, error } = await sb
      .from('colleges')
      .select('id, name, code, status, created_at')
      .eq('status', 'Active')
      .order('name', { ascending: true })

    if (error || !data || data.length === 0) {
      return fallbackColleges
    }

    return data as College[]
  } catch {
    return fallbackColleges
  }
}

