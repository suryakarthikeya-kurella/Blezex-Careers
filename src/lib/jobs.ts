import 'server-only'
import { getSupabase } from './supabase'
import { fallbackJobs } from './jobs-data'
import type { Job } from './types'

const arr = (v: unknown): string[] => (Array.isArray(v) ? v.map(String) : [])

/** Loads jobs from Supabase. Falls back to built-in listings if Supabase is not connected yet. */
export async function getJobs(): Promise<Job[]> {
  const sb = getSupabase()
  if (!sb) return fallbackJobs
  const { data, error } = await sb.from('jobs').select('*').order('created_at', { ascending: true })
  if (error || !data?.length) return fallbackJobs
  return data.map(j => ({
    ...j,
    responsibilities: arr(j.responsibilities),
    requirements: arr(j.requirements),
    benefits: arr(j.benefits),
  })) as Job[]
}
