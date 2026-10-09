import { z } from 'zod'

const url = z
  .string().trim()
  .url('Enter a valid URL, including https://')
  .refine(v => /^https?:\/\//i.test(v), 'URL must start with http:// or https://')
const optionalUrl = z.union([z.literal(''), url])

export const positionSchema = z.object({ position: z.string().min(1, 'Please select a position') })

export const personalSchema = z.object({
  full_name: z.string().trim().min(2, 'Enter your full name').max(100),
  email: z.string().trim().email('Enter a valid email address').max(150),
  phone: z.string().trim().regex(/^\+?[0-9][0-9\s-]{8,14}$/, 'Enter a valid phone number'),
  city: z.string().trim().min(2, 'Enter your city').max(80),
  state: z.string().trim().min(2, 'Enter your state').max(80),
})

export const educationSchema = z.object({
  college: z.string().trim().min(2, 'Enter your college name').max(150),
  degree: z.string().trim().min(2, 'Enter your degree').max(100),
  branch: z.string().trim().min(2, 'Enter your branch or specialization').max(100),
  graduation_year: z.string().trim().regex(/^\d{4}$/, 'Enter a 4-digit year').refine(y => +y >= 2015 && +y <= 2035, 'Enter a year between 2015 and 2035'),
  cgpa: z.string().trim().regex(/^\d{1,2}(\.\d{1,2})?$/, 'Enter CGPA like 8.2').refine(v => +v > 0 && +v <= 10, 'CGPA must be between 0 and 10'),
})

export const professionalSchema = z.object({
  skills: z.string().trim().max(300, 'Keep skills under 300 characters'),
  linkedin_url: optionalUrl,
  github_url: optionalUrl,
  portfolio_url: optionalUrl,
})

export const resumeSchema = z.object({
  resume_link: url,
  available_start_date: z.union([z.literal(''), z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Enter a valid date')]),
  why_join_blezex: z.string().trim().max(1000, 'Keep this under 1000 characters'),
})

export const reviewSchema = z.object({
  consent: z.literal(true, { errorMap: () => ({ message: 'Please confirm that your details are accurate' }) }),
})

export const applicationSchema = positionSchema
  .merge(personalSchema).merge(educationSchema).merge(professionalSchema).merge(resumeSchema).merge(reviewSchema)

export interface FormValues {
  position: string
  full_name: string; email: string; phone: string; city: string; state: string
  college: string; degree: string; branch: string; graduation_year: string; cgpa: string
  skills: string; linkedin_url: string; github_url: string; portfolio_url: string
  resume_link: string; available_start_date: string; why_join_blezex: string
  consent: boolean
  /** Honeypot field: real users never fill this in. */
  hp: string
}

export const emptyForm: FormValues = {
  position: '', full_name: '', email: '', phone: '', city: '', state: '',
  college: '', degree: '', branch: '', graduation_year: '', cgpa: '',
  skills: '', linkedin_url: '', github_url: '', portfolio_url: '',
  resume_link: '', available_start_date: '', why_join_blezex: '', consent: false, hp: '',
}
