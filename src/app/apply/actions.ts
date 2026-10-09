'use server'
import { getSupabase } from '@/lib/supabase'
import { getJobs } from '@/lib/jobs'
import { applicationSchema, type FormValues } from '@/lib/validation'
import { isUuid } from '@/lib/utils'
import { TALENT_POOL_TITLE } from '@/lib/talent-pool'

export type SubmitResult = { ok: true } | { ok: false; error: string; fieldErrors?: Record<string, string> }

export async function submitApplication(values: FormValues): Promise<SubmitResult> {
  // Honeypot: bots fill hidden fields. Pretend success and store nothing.
  if (values?.hp) return { ok: true }

  const parsed = applicationSchema.safeParse(values)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const [k, v] of Object.entries(parsed.error.flatten().fieldErrors)) if (v?.[0]) fieldErrors[k] = v[0]
    return { ok: false, error: 'Please correct the highlighted fields.', fieldErrors }
  }
  const d = parsed.data

  const jobs = await getJobs()
  const isPool = d.position === TALENT_POOL_TITLE
  const job = isPool ? null : jobs.find(j => j.title === d.position && j.status === 'active')
  if (!isPool && !job) return { ok: false, error: 'This position is not open for applications.' }
  const position = job ? job.title : TALENT_POOL_TITLE

  const sb = getSupabase()
  if (!sb) return { ok: false, error: 'Applications are temporarily unavailable. Please email connect.blezex@gmail.com.' }

  const email = d.email.toLowerCase()
  const { data: existing, error: lookupError } = await sb.from('applications').select('id').eq('position', position).ilike('email', email).limit(1)
  if (lookupError) return { ok: false, error: 'Something went wrong. Please try again in a moment.' }
  if (existing?.length) return { ok: false, error: 'You have already applied for this position with this email address.' }

  const { error } = await sb.from('applications').insert({
    job_id: job && isUuid(job.id) ? job.id : null,
    position,
    full_name: d.full_name, email, phone: d.phone, city: d.city, state: d.state,
    college: d.college, degree: d.degree, branch: d.branch,
    graduation_year: Number(d.graduation_year), cgpa: Number(d.cgpa),
    skills: d.skills || null,
    linkedin_url: d.linkedin_url || null, github_url: d.github_url || null, portfolio_url: d.portfolio_url || null,
    resume_link: d.resume_link,
    why_join_blezex: d.why_join_blezex || null,
    available_start_date: d.available_start_date || null,
  })
  if (error) {
    console.error('Application insert failed:', error.message)
    return { ok: false, error: 'We could not save your application. Please try again.' }
  }
  return { ok: true }
}
