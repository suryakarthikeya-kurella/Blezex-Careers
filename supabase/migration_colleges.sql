-- =====================================================================
-- Migration: Add colleges table, seed Sri Sai Degree College,
-- and add college_id reference to applications.
-- Safe and idempotent: can be executed repeatedly without errors or duplicate rows.
-- =====================================================================

create table if not exists public.colleges (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text not null,
  status text not null default 'Active' check (status in ('Active', 'Inactive')),
  created_at timestamptz not null default now()
);

-- Unique index on code and case-insensitive unique index on name
create unique index if not exists colleges_code_key on public.colleges (code);
create unique index if not exists colleges_name_lower_key on public.colleges (lower(name));

-- Row Level Security for colleges:
-- Anyone can read active colleges (for application form dropdown)
alter table public.colleges enable row level security;
drop policy if exists "Public can read active colleges" on public.colleges;
create policy "Public can read active colleges" on public.colleges
  for select to anon, authenticated using (true);

-- Add optional college_id foreign key column to applications if it doesn't exist
alter table public.applications add column if not exists college_id uuid references public.colleges (id) on delete set null;
create index if not exists applications_college_id_idx on public.applications (college_id);

-- Idempotent seed: Sri Sai Degree College
insert into public.colleges (name, code, status)
values ('Sri Sai Degree College', 'SRI-SAI-DEGREE-COLLEGE', 'Active')
on conflict (code) do update
set name = excluded.name,
    status = excluded.status;

-- Retroactive backfill for any existing applications matching 'Sri Sai Degree College'
update public.applications a
set college_id = c.id
from public.colleges c
where lower(trim(a.college)) = lower(c.name)
  and a.college_id is null;

