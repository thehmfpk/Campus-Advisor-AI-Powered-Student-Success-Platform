-- Campus Advisor — Societies / campus clubs (Batch 6)
-- Adds a directory of student societies (GDGoC, AWS Cloud Club, GitHub Campus,
-- etc.) that students can join. RLS: everyone reads societies; students manage
-- only their own memberships.

create table if not exists public.societies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  category text not null default 'Tech',
  description text not null,
  color text not null default '#2563eb',
  website text,
  created_at timestamptz not null default now()
);

create table if not exists public.society_memberships (
  id uuid primary key default gen_random_uuid(),
  society_id uuid not null references public.societies(id) on delete cascade,
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (society_id, profile_id)
);

create index if not exists idx_memberships_profile on public.society_memberships(profile_id);
create index if not exists idx_memberships_society on public.society_memberships(society_id);

alter table public.societies enable row level security;
alter table public.society_memberships enable row level security;

-- Societies: read for all authenticated, write admin-only.
create policy societies_read on public.societies
  for select using (auth.role() = 'authenticated');
create policy societies_admin_write on public.societies
  for all using (public.is_admin()) with check (public.is_admin());

-- Memberships: read all (so member counts are visible), write only your own.
create policy memberships_read on public.society_memberships
  for select using (auth.role() = 'authenticated');
create policy memberships_owner_write on public.society_memberships
  for all using (profile_id = public.my_profile_id())
  with check (profile_id = public.my_profile_id());
