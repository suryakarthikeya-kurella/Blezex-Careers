'use client'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertCircle, Check, CheckCircle2, ChevronLeft, ChevronRight, Loader2, Pencil } from 'lucide-react'
import type { ZodTypeAny } from 'zod'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input, Textarea } from '@/components/ui/input'
import { submitApplication } from '@/app/apply/actions'
import { educationSchema, emptyForm, personalSchema, positionSchema, professionalSchema, resumeSchema, reviewSchema, type FormValues } from '@/lib/validation'

interface JobOption { title: string; department: string; employment_type: string; location: string }
type Errors = Partial<Record<string, string>>

const STEPS: { title: string; short: string; schema: ZodTypeAny }[] = [
  { title: 'Select a position', short: 'Position', schema: positionSchema },
  { title: 'Personal details', short: 'Personal', schema: personalSchema },
  { title: 'Education details', short: 'Education', schema: educationSchema },
  { title: 'Professional details (optional)', short: 'Professional', schema: professionalSchema },
  { title: 'Resume and availability', short: 'Resume', schema: resumeSchema },
  { title: 'Review & submit', short: 'Review', schema: reviewSchema },
]

interface FieldProps {
  name: keyof FormValues; label: string; value: string; error?: string; hint?: string; required?: boolean
  type?: string; placeholder?: string; autoComplete?: string; inputMode?: 'text' | 'numeric' | 'decimal' | 'tel' | 'email' | 'url'
  multiline?: boolean; onChange: (name: keyof FormValues, value: string) => void
}

function Field({ name, label, value, error, hint, required, type = 'text', placeholder, autoComplete, inputMode, multiline, onChange }: FieldProps) {
  const id = `f-${name}`
  const describedBy = [hint ? `${id}-hint` : '', error ? `${id}-err` : ''].filter(Boolean).join(' ') || undefined
  const common = { id, name, value, placeholder, autoComplete, 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy, 'aria-required': required || undefined }
  return (
    <div>
      <label htmlFor={id} className="label">{label}{required ? <span className="text-accent"> *</span> : <span className="font-normal text-muted"> (optional)</span>}</label>
      {multiline
        ? <Textarea {...common} rows={4} onChange={e => onChange(name, e.target.value)} />
        : <Input {...common} type={type} inputMode={inputMode} onChange={e => onChange(name, e.target.value)} />}
      {hint && !error && <p id={`${id}-hint`} className="mt-1.5 text-sm text-muted">{hint}</p>}
      {error && <p id={`${id}-err`} role="alert" className="mt-1.5 flex items-center gap-1 text-sm font-medium text-accent"><AlertCircle aria-hidden className="h-4 w-4" />{error}</p>}
    </div>
  )
}

export function ApplicationForm({ jobs, initialPosition }: { jobs: JobOption[]; initialPosition: string }) {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<FormValues>({ ...emptyForm, position: initialPosition })
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const mounted = useRef(false)

  useEffect(() => {
    if (!mounted.current) { mounted.current = true; return }
    headingRef.current?.focus()
    headingRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [step])

  const set = (name: keyof FormValues, value: string | boolean) => {
    setValues(v => ({ ...v, [name]: value }))
    setErrors(e => { if (!e[name]) return e; const next = { ...e }; delete next[name]; return next })
  }
  const setText = (name: keyof FormValues, value: string) => set(name, value)

  const runValidation = (schema: ZodTypeAny): Errors | null => {
    const r = schema.safeParse(values)
    if (r.success) return null
    const out: Errors = {}
    for (const [k, v] of Object.entries(r.error.flatten().fieldErrors as Record<string, string[] | undefined>)) if (v?.[0]) out[k] = v[0]
    return out
  }
  const focusFirstError = () => requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())

  const next = () => {
    const errs = runValidation(STEPS[step].schema)
    if (errs) { setErrors(errs); focusFirstError(); return }
    setErrors({}); setStep(s => Math.min(s + 1, STEPS.length - 1))
  }

  const submit = async () => {
    for (let i = 0; i < STEPS.length; i++) {
      const errs = runValidation(STEPS[i].schema)
      if (errs) { setErrors(errs); setStep(i); focusFirstError(); return }
    }
    setServerError(null); setSubmitting(true)
    try {
      const res = await submitApplication(values)
      if (res.ok) { setDone(true); setTimeout(() => router.push('/thank-you'), 1400) }
      else { setServerError(res.error); if (res.fieldErrors) setErrors(res.fieldErrors) }
    } catch {
      setServerError('Network problem. Please check your connection and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const onSubmit = (e: React.FormEvent) => { e.preventDefault(); if (step < STEPS.length - 1) next(); else void submit() }

  if (done) {
    return (
      <Card role="status" className="p-10 text-center shadow-card">
        <CheckCircle2 aria-hidden className="mx-auto mb-3 h-14 w-14 text-accent" />
        <h2 className="text-2xl font-extrabold sm:text-3xl">Application submitted!</h2>
        <p className="mt-2 text-muted">Taking you to the confirmation page&hellip;</p>
      </Card>
    )
  }

  const last = step === STEPS.length - 1
  const selectedJob = jobs.find(j => j.title === values.position)
  const skipLabel = step === 3 && !values.skills && !values.linkedin_url && !values.github_url && !values.portfolio_url

  return (
    <form onSubmit={onSubmit} noValidate>
      <div className="mb-5">
        <div className="mb-2 flex items-center justify-between text-sm font-semibold text-ink">
          <span>Step {step + 1} of {STEPS.length}</span><span className="text-accent">{STEPS[step].short}</span>
        </div>
        <div role="progressbar" aria-valuemin={1} aria-valuemax={STEPS.length} aria-valuenow={step + 1} aria-label="Application progress" className="h-2 overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-accent transition-all duration-300" style={{ width: `${((step + 1) / STEPS.length) * 100}%` }} />
        </div>
        <ol className="mt-3 hidden justify-between gap-1 sm:flex">
          {STEPS.map((s, i) => (
            <li key={s.short} className={`flex items-center gap-1.5 text-xs font-semibold ${i <= step ? 'text-ink' : 'text-muted'}`}>
              <span className={`flex h-6 w-6 items-center justify-center rounded-full border text-xs ${i < step ? 'border-ink bg-ink text-white' : i === step ? 'border-accent bg-accent text-white' : 'border-line bg-white'}`}>{i < step ? <Check aria-hidden className="h-3.5 w-3.5" /> : i + 1}</span>{s.short}
            </li>
          ))}
        </ol>
      </div>

      <Card className="p-5 shadow-card sm:p-8">
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Leave empty<input tabIndex={-1} autoComplete="off" value={values.hp} onChange={e => set('hp', e.target.value)} /></label></div>

        <h2 ref={headingRef} tabIndex={-1} className="mb-6 scroll-mt-24 text-xl font-extrabold outline-none sm:text-2xl">{STEPS[step].title}</h2>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div key={step} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }} transition={{ duration: 0.15 }} className="grid gap-5">
            {step === 0 && (
              <fieldset>
                <legend className="sr-only">Position</legend>
                <div className="grid gap-3">
                  {jobs.map(j => (
                    <label key={j.title} className="flex cursor-pointer items-start gap-3 rounded-lg border border-line bg-white p-4 transition has-[:checked]:border-accent has-[:checked]:bg-accent/5 has-[:checked]:ring-1 has-[:checked]:ring-accent has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent">
                      <input type="radio" name="position" value={j.title} checked={values.position === j.title} onChange={() => set('position', j.title)} className="mt-1 h-4 w-4 accent-accent" />
                      <span><span className="block font-heading text-base font-bold text-ink sm:text-lg">{j.title}</span><span className="text-sm text-muted">{j.department} &middot; {j.employment_type} &middot; {j.location}</span></span>
                    </label>
                  ))}
                </div>
                {errors.position && <p role="alert" className="mt-2 flex items-center gap-1 text-sm font-medium text-accent"><AlertCircle aria-hidden className="h-4 w-4" />{errors.position}</p>}
              </fieldset>
            )}

            {step === 1 && (<>
              <Field name="full_name" label="Full name" required autoComplete="name" value={values.full_name} error={errors.full_name} onChange={setText} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="email" label="Email address" type="email" inputMode="email" required autoComplete="email" value={values.email} error={errors.email} onChange={setText} />
                <Field name="phone" label="Phone number" type="tel" inputMode="tel" required autoComplete="tel" placeholder="+91 90000 00000" value={values.phone} error={errors.phone} onChange={setText} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="city" label="City" required autoComplete="address-level2" value={values.city} error={errors.city} onChange={setText} />
                <Field name="state" label="State" required autoComplete="address-level1" value={values.state} error={errors.state} onChange={setText} />
              </div>
            </>)}

            {step === 2 && (<>
              <Field name="college" label="College name" required value={values.college} error={errors.college} onChange={setText} />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="degree" label="Degree" required placeholder="e.g. B.Tech, BBA, MBA" value={values.degree} error={errors.degree} onChange={setText} />
                <Field name="branch" label="Branch / specialization" required placeholder="e.g. Computer Science" value={values.branch} error={errors.branch} onChange={setText} />
              </div>
              <div className="grid gap-5 sm:grid-cols-2">
                <Field name="graduation_year" label="Graduation year" required inputMode="numeric" placeholder="2027" value={values.graduation_year} error={errors.graduation_year} onChange={setText} />
                <Field name="cgpa" label="CGPA (out of 10)" required inputMode="decimal" placeholder="8.2" value={values.cgpa} error={errors.cgpa} onChange={setText} />
              </div>
            </>)}

            {step === 3 && (<>
              <p className="text-muted">This step is optional. You can skip it, but links help us understand your work.</p>
              <Field name="skills" label="Key skills" placeholder="e.g. Excel, communication, Canva, Python" value={values.skills} error={errors.skills} onChange={setText} />
              <Field name="linkedin_url" label="LinkedIn URL" type="url" inputMode="url" placeholder="https://www.linkedin.com/in/your-name" value={values.linkedin_url} error={errors.linkedin_url} onChange={setText} />
              <Field name="github_url" label="GitHub URL" type="url" inputMode="url" placeholder="https://github.com/your-username" value={values.github_url} error={errors.github_url} onChange={setText} />
              <Field name="portfolio_url" label="Portfolio URL" type="url" inputMode="url" placeholder="https://your-portfolio.com" value={values.portfolio_url} error={errors.portfolio_url} onChange={setText} />
            </>)}

            {step === 4 && (<>
              <Field name="resume_link" label="Google Drive resume link" type="url" inputMode="url" required placeholder="https://drive.google.com/file/d/..." hint="Upload your resume to Google Drive, set sharing to “Anyone with the link can view”, then paste the link here." value={values.resume_link} error={errors.resume_link} onChange={setText} />
              <Field name="available_start_date" label="Available start date" type="date" value={values.available_start_date} error={errors.available_start_date} onChange={setText} />
              <Field name="why_join_blezex" label="Why do you want to join BlezeX?" multiline value={values.why_join_blezex} error={errors.why_join_blezex} hint="A few sentences is plenty." onChange={setText} />
            </>)}

            {step === 5 && (<>
              <p className="text-muted">Check your details before submitting. Select Edit to change anything.</p>
              {[
                { label: 'Position', go: 0, rows: [['Applying for', values.position], ['Department', selectedJob?.department ?? '']] },
                { label: 'Personal details', go: 1, rows: [['Name', values.full_name], ['Email', values.email], ['Phone', values.phone], ['Location', `${values.city}, ${values.state}`]] },
                { label: 'Education', go: 2, rows: [['College', values.college], ['Degree', `${values.degree}, ${values.branch}`], ['Graduation year', values.graduation_year], ['CGPA', values.cgpa]] },
                { label: 'Professional', go: 3, rows: [['Skills', values.skills], ['LinkedIn', values.linkedin_url], ['GitHub', values.github_url], ['Portfolio', values.portfolio_url]] },
                { label: 'Resume', go: 4, rows: [['Resume link', values.resume_link], ['Start date', values.available_start_date], ['Why BlezeX', values.why_join_blezex]] },
              ].map(sec => (
                <div key={sec.label} className="rounded-lg border border-line bg-paper p-4">
                  <div className="mb-2 flex items-center justify-between"><h3 className="font-heading text-base font-bold">{sec.label}</h3>
                    <button type="button" onClick={() => setStep(sec.go)} className="flex min-h-[2.25rem] items-center gap-1 px-1 text-sm font-semibold text-accent hover:underline"><Pencil aria-hidden className="h-3.5 w-3.5" />Edit<span className="sr-only"> {sec.label}</span></button></div>
                  <dl className="grid gap-x-4 gap-y-1 text-sm sm:grid-cols-[9rem_1fr]">
                    {sec.rows.filter(r => r[1]).map(([k, v]) => <div key={k} className="contents"><dt className="font-semibold text-ink">{k}</dt><dd className="break-words">{v}</dd></div>)}
                  </dl>
                </div>
              ))}
              <div>
                <label className="flex cursor-pointer items-start gap-3">
                  <input type="checkbox" checked={values.consent} onChange={e => set('consent', e.target.checked)} aria-invalid={errors.consent ? true : undefined} className="mt-1 h-5 w-5 accent-accent" />
                  <span className="text-sm">I confirm that the information I have provided is accurate and I agree to be contacted by BlezeX about my application.</span>
                </label>
                {errors.consent && <p role="alert" className="mt-1 flex items-center gap-1 text-sm font-medium text-accent"><AlertCircle aria-hidden className="h-4 w-4" />{errors.consent}</p>}
              </div>
            </>)}
          </motion.div>
        </AnimatePresence>

        {serverError && <p role="alert" className="mt-5 flex items-start gap-2 rounded-lg border border-accent bg-accent/5 p-3 text-sm font-medium text-ink"><AlertCircle aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-accent" />{serverError}</p>}

        <div className="mt-8 grid grid-cols-2 gap-3 sm:flex sm:justify-between">
          <Button type="button" variant="outline" size="lg" onClick={() => { setErrors({}); setStep(s => Math.max(s - 1, 0)) }} disabled={step === 0 || submitting}><ChevronLeft aria-hidden className="h-5 w-5" />Back</Button>
          {last ? (
            <Button type="submit" size="lg" disabled={submitting}>{submitting ? <><Loader2 aria-hidden className="h-5 w-5 animate-spin" />Submitting&hellip;</> : 'Submit application'}</Button>
          ) : (
            <Button type="submit" size="lg">{skipLabel ? 'Skip' : 'Next'}<ChevronRight aria-hidden className="h-5 w-5" /></Button>
          )}
        </div>
      </Card>
    </form>
  )
}
