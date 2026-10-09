-- =====================================================================
-- BlezeX Careers: database schema
-- Run this whole file once in Supabase: SQL Editor > New query > Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).
-- =====================================================================
create extension if not exists pgcrypto;

create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  department text not null,
  employment_type text not null,
  location text not null,
  description text not null,
  responsibilities text[] not null default '{}',
  requirements text[] not null default '{}',
  benefits text[] not null default '{}',
  stipend text,
  duration text,
  -- 'active' = accepting applications, 'future' = shown as "Currently No Vacancy"
  status text not null default 'active' check (status in ('active', 'future')),
  created_at timestamptz not null default now()
);
create unique index if not exists jobs_title_key on public.jobs (title);

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid references public.jobs (id) on delete set null,
  position text not null,
  full_name text not null,
  email text not null,
  phone text not null,
  city text not null,
  state text not null,
  college text not null,
  degree text not null,
  branch text not null,
  graduation_year int not null,
  cgpa numeric(4, 2) not null,
  skills text,
  linkedin_url text,
  github_url text,
  portfolio_url text,
  resume_link text not null,
  why_join_blezex text,
  available_start_date date,
  status text not null default 'Applied'
    check (status in ('Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Selected', 'Rejected')),
  created_at timestamptz not null default now()
);
create index if not exists applications_status_idx on public.applications (status);
create index if not exists applications_created_idx on public.applications (created_at desc);
create index if not exists applications_email_idx on public.applications (lower(email));

-- Row Level Security.
-- applications: RLS on with NO public policies, so only the server (secret key) can read/write it.
-- jobs: anyone may read; nobody can write except the server.
alter table public.jobs enable row level security;
alter table public.applications enable row level security;
drop policy if exists "Public can read jobs" on public.jobs;
create policy "Public can read jobs" on public.jobs for select to anon, authenticated using (true);

-- Seed job listings (edit freely, or manage them in Table Editor > jobs)
insert into public.jobs (title, department, employment_type, location, description, responsibilities, requirements, benefits, stipend, duration, status) values
  ('Business Development Associate', 'Sales & Business Development', 'Full-time', 'Remote / Hybrid', 'Drive new business for BlezeX by identifying prospects, pitching our AI, web and automation solutions, and building long-term client relationships.', array['Identify and research potential clients across target industries', 'Reach out through calls, email and LinkedIn to start conversations', 'Present BlezeX services and understand each client''s needs', 'Maintain the lead pipeline and follow up consistently', 'Work with the delivery team to prepare proposals']::text[], array['Strong spoken and written communication', 'Interest in sales, technology and business growth', 'Comfortable working towards targets', 'Freshers with the right attitude are welcome']::text[], array['Direct mentorship from company leadership', 'Performance-linked incentives', 'Real client and industry exposure', 'Clear career growth path']::text[], 'Performance-linked incentives; details shared at interview', 'Permanent role', 'active'),
  ('Business Growth Consultant', 'Business Growth', 'Full-time', 'Remote / Hybrid', 'Work with clients to find growth opportunities and recommend practical digital, automation and AI-led solutions that deliver measurable results.', array['Understand client businesses, goals and challenges', 'Analyse processes and recommend suitable solutions', 'Prepare proposals, presentations and growth plans', 'Coordinate between clients and the delivery team', 'Track results and report on measurable impact']::text[], array['Analytical thinking and problem solving', 'Clear communication and presentation skills', 'Understanding of business basics such as sales, marketing or operations', 'Curiosity about AI, automation and digital tools']::text[], array['Work closely with company leadership', 'Hands-on consulting exposure', 'Learning across AI, web and automation', 'Growth into senior consulting roles']::text[], 'Performance-linked incentives; details shared at interview', 'Permanent role', 'active'),
  ('Digital Marketing Intern', 'Marketing', 'Internship', 'Remote', 'Support BlezeX marketing by creating content, running social campaigns and learning how digital growth works in a real technology company.', array['Create and schedule social media posts', 'Support campaigns and track performance', 'Research keywords and basic SEO opportunities', 'Design simple creatives using tools such as Canva', 'Prepare weekly reports on reach and engagement']::text[], array['Good writing skills and creativity', 'Familiarity with social media platforms', 'Basic Canva or similar design skills', 'Willingness to learn and take feedback']::text[], array['Internship certificate on completion', 'Mentorship from the marketing lead', 'Portfolio-ready campaign work', 'PPO consideration for strong performers']::text[], 'Performance-based stipend', '3 months', 'active'),
  ('Campus Representative', 'Campus Outreach', 'Part-time', 'On campus (your college)', 'Represent BlezeX at your college, spread the word about our programs and opportunities, and build a community of motivated students.', array['Promote BlezeX programs and openings on campus', 'Connect with student clubs and communities', 'Help organise sessions and awareness activities', 'Share student feedback with the BlezeX team', 'Report progress regularly']::text[], array['Currently enrolled student', 'Active in campus communities or clubs', 'Confident communicator', 'A few hours per week to commit']::text[], array['Certificate and recognition', 'Leadership and networking experience', 'Incentives linked to performance', 'PPO consideration for top representatives']::text[], 'Performance-based incentives', '3 months', 'active'),
  ('AI Engineer Intern', 'Engineering (AI)', 'Internship', 'Remote', 'Build and test AI-powered solutions and automations for client projects alongside the BlezeX engineering team.', array['Prototype AI features and automation workflows', 'Work with APIs and language models', 'Test and document solutions', 'Support client project delivery']::text[], array['Python or JavaScript basics', 'Interest in AI and machine learning', 'Problem-solving mindset', 'Willingness to learn quickly']::text[], array['Work on real AI projects', 'Mentorship from engineers', 'Internship certificate', 'PPO consideration']::text[], null, 'To be announced', 'future'),
  ('Full Stack Developer Intern', 'Engineering', 'Internship', 'Remote', 'Help design, build and ship web applications for BlezeX and its clients across the front end and back end.', array['Build responsive interfaces with React or Next.js', 'Develop APIs and database integrations', 'Fix bugs and improve performance', 'Write clean, documented code']::text[], array['HTML, CSS and JavaScript fundamentals', 'Familiarity with React or a similar framework', 'Basic understanding of databases', 'Portfolio or GitHub projects preferred']::text[], array['Real client project experience', 'Code reviews and mentorship', 'Internship certificate', 'PPO consideration']::text[], null, 'To be announced', 'future')
on conflict (title) do nothing;
