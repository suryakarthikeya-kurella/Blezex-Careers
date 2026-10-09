import {
  FolderKanban, Users, TrendingUp, Rocket, GraduationCap, MessagesSquare, Building2, ShieldCheck, Lightbulb,
  Megaphone, Briefcase, Compass, type LucideIcon,
} from 'lucide-react'

type Item = { title: string; text: string; icon: LucideIcon }

export const whyJoin: Item[] = [
  { title: 'Real Client Projects', text: 'Work on projects with actual business impact.', icon: FolderKanban },
  { title: 'Industry Mentorship', text: 'Learn from experienced professionals.', icon: Users },
  { title: 'Career Growth', text: 'Opportunities to grow into leadership roles.', icon: TrendingUp },
  { title: 'Startup Exposure', text: 'Gain experience in a fast-paced startup environment.', icon: Rocket },
]

/** Extra candidate-focused details shown on each job card, matched by job title. */
export const jobExtras: Record<string, { who: string; learn: string[] }> = {
  'Business Development Associate': {
    who: 'Students and freshers interested in Sales, Lead Generation, Client Communication, and Business Development.',
    learn: ['Lead Generation', 'Client Communication', 'Sales Process & Pitching', 'Business Development', 'CRM & Pipeline Basics'],
  },
  'Business Growth Consultant': {
    who: 'Students interested in Sales, Marketing, Client Communication, and Business Growth.',
    learn: ['Business Development', 'Client Communication', 'Marketing Strategy', 'Client Problem Solving', 'Presenting Proposals'],
  },
  'Digital Marketing Intern': {
    who: 'Students interested in Social Media, Content Creation, SEO, and Digital Growth.',
    learn: ['Social Media Marketing', 'Content Creation', 'SEO Basics', 'Campaign Analytics', 'Marketing Strategy'],
  },
  'Campus Representative': {
    who: 'Students interested in Leadership, Networking, Community Building, and Campus Engagement.',
    learn: ['Leadership', 'Networking', 'Community Building', 'Campus Engagement', 'Communication'],
  },
  'AI Engineer Intern': {
    who: 'Students interested in AI, Python, LLMs, Agentic AI, RAG, and Automation.',
    learn: ['AI Development', 'Python', 'LLMs & RAG', 'Automation Workflows'],
  },
}

export const growthSteps: Item[] = [
  { title: 'Campus Representative', text: 'Start by representing BlezeX and building your network.', icon: Megaphone },
  { title: 'Business Growth Consultant', text: 'Work with clients on real growth projects.', icon: Briefcase },
  { title: 'Team Lead', text: 'Guide a team and take ownership of results.', icon: Users },
  { title: 'Program Manager', text: 'Run programs and help shape how BlezeX grows.', icon: Compass },
]

export const thrives = ['Take ownership', 'Learn quickly', 'Solve problems', 'Communicate effectively', 'Adapt to startup environments', 'Want continuous growth']

export const life: Item[] = [
  { title: 'Team Collaboration', text: 'Small teams that build together.', icon: Users },
  { title: 'Training Sessions', text: 'Regular sessions to learn new skills.', icon: GraduationCap },
  { title: 'Team Meetings', text: 'Regular check-ins, ideas and feedback.', icon: MessagesSquare },
  { title: 'Real Workplace Culture', text: 'Ownership, respect and open communication.', icon: Building2 },
  { title: 'Ownership & Responsibility', text: 'You own your work from start to finish.', icon: ShieldCheck },
  { title: 'Innovation Culture', text: 'New ideas are always welcome.', icon: Lightbulb },
]

export const hiringSteps = [
  { title: 'Apply', text: 'Submit the short online form.' },
  { title: 'Screening', text: 'We review your profile.' },
  { title: 'Interview', text: 'Talk with us about your goals.' },
  { title: 'Offer', text: 'Selected candidates receive an offer.' },
  { title: 'Onboarding', text: 'Meet your mentor and start building.' },
]

export const faqs = [
  { q: 'Is this remote?', a: 'Most roles are remote or hybrid. Each listing shows its location, and Campus Representatives work on their own college campus.' },
  { q: 'Will I receive a certificate?', a: 'Yes. Interns and campus representatives who complete their term receive a certificate from BlezeX.' },
  { q: 'Is there a stipend?', a: 'It depends on the role. We share all role-specific details, including stipend or incentives where applicable, during the interview.' },
  { q: 'Can freshers apply?', a: 'Yes. Freshers and students are welcome. We value attitude, curiosity and willingness to learn over prior experience.' },
  { q: 'Are there PPO opportunities?', a: 'Yes. Strong performers may be considered for Pre-Placement Offers (PPO) based on their work and results.' },
  { q: 'How long does the hiring process take?', a: 'Usually one to two weeks from application to final decision. We will keep you updated by email.' },
  { q: 'How do I apply?', a: 'Choose an open position, select Apply Now and complete the short multi-step form. You only need a Google Drive link to your resume.' },
]
