export const STATUSES = ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected'] as const
export type ApplicationStatus = (typeof STATUSES)[number]

export interface Job {
  id: string
  title: string
  department: string
  employment_type: string
  location: string
  description: string
  responsibilities: string[]
  requirements: string[]
  qualification: string[]
  benefits: string[]
  stipend: string | null
  duration: string | null
  status: 'active' | 'future'
  created_at: string
}

export interface Application {
  id: string
  job_id: string | null
  position: string
  full_name: string
  email: string
  phone: string
  city: string
  state: string
  college: string
  degree: string
  branch: string
  graduation_year: number
  cgpa: number
  skills: string | null
  linkedin_url: string | null
  github_url: string | null
  portfolio_url: string | null
  resume_link: string
  why_join_blezex: string | null
  available_start_date: string | null
  status: ApplicationStatus
  created_at: string
}

export type LoginState = { error?: string }
