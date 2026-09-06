-- Campus Advisor — schema (Supabase Free / Postgres)
-- See .kiro/specs/design.md §6. Apply via Supabase SQL editor or CLI.
-- RLS policies live in 0002_rls.sql.

create extension if not exists "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────
do $$ begin
  create type user_role as enum ('student','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type agent_key as enum ('academic','career','coding','cv','auto');
exception when duplicate_object then null; end $$;

do $$ begin
  create type ai_role as enum ('user','assistant','system');
exception when duplicate_object then null; end $$;

do $$ begin
  create type employment_type as enum ('internship','full_time','part_time','contract');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_category as enum
    ('university_problem','opportunity','scholarship','internship','event','achievement','announcement','general');
exception when duplicate_object then null; end $$;

do $$ begin
  create type post_status as enum ('published','hidden','removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type report_status as enum ('open','reviewed','actioned','dismissed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type feedback_category as enum ('teachers','staff','facilities','academics','administration','other');
exception when duplicate_object then null; end $$;

do $$ begin
  create type portal_feedback_type as enum ('bug','ux','general');
exception when duplicate_object then null; end $$;

do $$ begin
  create type feature_status as enum ('open','planned','in_progress','completed','rejected');
exception when duplicate_object then null; end $$;

do $$ begin
  create type feature_priority as enum ('low','medium','high');
exception when duplicate_object then null; end $$;

-- ─── Identity & profile ──────────────────────────────────────────────────
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role user_role not null default 'student',
  is_disabled boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists public.universities (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  country text not null default 'Pakistan',
  city text,
  type text,
  website text,
  logo_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.departments (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users(id) on delete cascade,
  full_name text not null,
  avatar_url text,
  roll_number text,
  university_id uuid references public.universities(id) on delete set null,
  university_name text,
  department_id uuid references public.departments(id) on delete set null,
  department_name text,
  semester int check (semester between 1 and 12),
  skills text[] not null default '{}',
  career_interests text[] not null default '{}',
  bio text,
  academic_info jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_subjects (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  subject_name text not null,
  credit_hours numeric not null check (credit_hours >= 0 and credit_hours <= 6),
  grade text,
  marks numeric check (marks >= 0 and marks <= 100),
  created_at timestamptz not null default now()
);

create table if not exists public.semester_records (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  semester_label text not null,
  gpa numeric not null check (gpa >= 0 and gpa <= 4),
  credits numeric not null check (credits >= 0),
  created_at timestamptz not null default now()
);

-- ─── AI ──────────────────────────────────────────────────────────────────
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  title text not null default 'New conversation',
  agent agent_key not null default 'auto',
  created_at timestamptz not null default now()
);

create table if not exists public.ai_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.ai_conversations(id) on delete cascade,
  role ai_role not null,
  agent agent_key,
  content text not null,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ─── Jobs ──────────────────────────────────────────────────────────────────
create table if not exists public.jobs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  company text not null,
  location text,
  is_remote boolean not null default false,
  employment_type employment_type not null default 'full_time',
  required_skills text[] not null default '{}',
  tags text[] not null default '{}',
  experience_level text,
  apply_url text,
  posted_date date,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists public.job_matches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  score int not null,
  explanation text,
  created_at timestamptz not null default now(),
  unique (profile_id, job_id)
);

-- ─── Coding notes ──────────────────────────────────────────────────────────
create table if not exists public.coding_notes (
  id uuid primary key default gen_random_uuid(),
  technology text not null,
  slug text not null unique,
  title text not null,
  sections jsonb not null,
  "order" int not null default 0,
  created_at timestamptz not null default now()
);

-- ─── CV ──────────────────────────────────────────────────────────────────
create table if not exists public.cv_profiles (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null unique references public.student_profiles(id) on delete cascade,
  template text not null default 'ats-classic',
  headline text,
  summary text,
  personal jsonb,
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  links jsonb not null default '[]',
  certifications jsonb not null default '[]',
  achievements jsonb not null default '[]',
  education jsonb not null default '[]',
  experience jsonb not null default '[]',
  projects jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- ─── Community ──────────────────────────────────────────────────────────────
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references public.student_profiles(id) on delete cascade,
  university_id uuid references public.universities(id) on delete set null,
  university_name text,
  category post_category not null default 'general',
  content text not null,
  image_url text,
  status post_status not null default 'published',
  likes_count int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  author_id uuid not null references public.student_profiles(id) on delete cascade,
  content text not null,
  status post_status not null default 'published',
  created_at timestamptz not null default now()
);

create table if not exists public.post_likes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (post_id, profile_id)
);

create table if not exists public.post_reports (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null references public.posts(id) on delete cascade,
  reporter_id uuid not null references public.student_profiles(id) on delete cascade,
  reason text not null,
  status report_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ─── Feedback & requests ────────────────────────────────────────────────────
create table if not exists public.university_feedback (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  university_id uuid references public.universities(id) on delete set null,
  university_name text,
  category feedback_category not null,
  rating int not null check (rating between 1 and 5),
  feedback text not null,
  semester text,
  department text,
  is_private boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.portal_feedback (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  type portal_feedback_type not null default 'general',
  message text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.feature_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.student_profiles(id) on delete cascade,
  title text not null,
  description text not null,
  category text,
  priority feature_priority not null default 'medium',
  status feature_status not null default 'open',
  created_at timestamptz not null default now()
);

-- ─── Rankings ──────────────────────────────────────────────────────────────
create table if not exists public.ranking_records (
  id uuid primary key default gen_random_uuid(),
  university_name text not null,
  country text not null,
  position int not null,
  source text not null,
  year int not null,
  category text not null default 'Overall',
  created_at timestamptz not null default now()
);

-- ─── Audit ──────────────────────────────────────────────────────────────────
create table if not exists public.admin_actions (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references public.users(id) on delete set null,
  action text not null,
  entity text not null,
  entity_id uuid,
  meta jsonb,
  created_at timestamptz not null default now()
);

-- ─── Indexes ──────────────────────────────────────────────────────────────
create index if not exists idx_profiles_user on public.student_profiles(user_id);
create index if not exists idx_profiles_univ on public.student_profiles(university_id);
create index if not exists idx_subjects_profile on public.student_subjects(profile_id);
create index if not exists idx_semrec_profile on public.semester_records(profile_id);
create index if not exists idx_conv_profile on public.ai_conversations(profile_id);
create index if not exists idx_msg_conv on public.ai_messages(conversation_id);
create index if not exists idx_jobs_type on public.jobs(employment_type, is_remote);
create index if not exists idx_posts_feed on public.posts(status, created_at desc);
create index if not exists idx_posts_univ on public.posts(university_id, category);
create index if not exists idx_comments_post on public.comments(post_id);
create index if not exists idx_ranking on public.ranking_records(country, source, year);

-- ─── Max-7-subjects trigger (R2) ─────────────────────────────────────────────
create or replace function public.enforce_max_subjects()
returns trigger
language plpgsql
as $$
declare
  cnt int;
begin
  select count(*) into cnt from public.student_subjects where profile_id = new.profile_id;
  if cnt >= 7 then
    raise exception 'A student can have at most 7 subjects'
      using errcode = 'check_violation';
  end if;
  return new;
end;
$$;

drop trigger if exists trg_max_subjects on public.student_subjects;
create trigger trg_max_subjects
  before insert on public.student_subjects
  for each row execute function public.enforce_max_subjects();

-- ─── updated_at helper ───────────────────────────────────────────────────
create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

drop trigger if exists trg_touch_profiles on public.student_profiles;
create trigger trg_touch_profiles before update on public.student_profiles
  for each row execute function public.touch_updated_at();

drop trigger if exists trg_touch_cv on public.cv_profiles;
create trigger trg_touch_cv before update on public.cv_profiles
  for each row execute function public.touch_updated_at();

-- ─── Likes counter maintenance ───────────────────────────────────────────
create or replace function public.sync_likes_count()
returns trigger language plpgsql as $$
begin
  if (tg_op = 'INSERT') then
    update public.posts set likes_count = likes_count + 1 where id = new.post_id;
  elsif (tg_op = 'DELETE') then
    update public.posts set likes_count = greatest(0, likes_count - 1) where id = old.post_id;
  end if;
  return null;
end; $$;

drop trigger if exists trg_likes_ins on public.post_likes;
create trigger trg_likes_ins after insert on public.post_likes
  for each row execute function public.sync_likes_count();
drop trigger if exists trg_likes_del on public.post_likes;
create trigger trg_likes_del after delete on public.post_likes
  for each row execute function public.sync_likes_count();

-- ─── Helper: is the current user an admin? ───────────────────────────────
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.users u where u.id = auth.uid() and u.role = 'admin');
$$;

-- ─── Helper: profile id for the current user ─────────────────────────────
create or replace function public.my_profile_id()
returns uuid language sql stable security definer set search_path = public as $$
  select id from public.student_profiles where user_id = auth.uid();
$$;
