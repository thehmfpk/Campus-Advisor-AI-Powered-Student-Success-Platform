-- Campus Advisor — Row-Level Security (design.md §7 / R18)
-- Enable RLS on every table and define least-privilege policies.

alter table public.users enable row level security;
alter table public.universities enable row level security;
alter table public.departments enable row level security;
alter table public.student_profiles enable row level security;
alter table public.student_subjects enable row level security;
alter table public.semester_records enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.ai_messages enable row level security;
alter table public.jobs enable row level security;
alter table public.job_matches enable row level security;
alter table public.coding_notes enable row level security;
alter table public.cv_profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.post_likes enable row level security;
alter table public.post_reports enable row level security;
alter table public.university_feedback enable row level security;
alter table public.portal_feedback enable row level security;
alter table public.feature_requests enable row level security;
alter table public.ranking_records enable row level security;
alter table public.admin_actions enable row level security;

-- ── users ────────────────────────────────────────────────────────────────
create policy users_self_select on public.users
  for select using (id = auth.uid() or public.is_admin());
create policy users_self_insert on public.users
  for insert with check (id = auth.uid());
create policy users_self_update on public.users
  for update using (id = auth.uid() or public.is_admin());

-- ── reference data (read-all authenticated, write admin) ───────────────────
create policy universities_read on public.universities
  for select using (auth.role() = 'authenticated');
create policy universities_admin_write on public.universities
  for all using (public.is_admin()) with check (public.is_admin());

create policy departments_read on public.departments
  for select using (auth.role() = 'authenticated');
create policy departments_admin_write on public.departments
  for all using (public.is_admin()) with check (public.is_admin());

create policy jobs_read on public.jobs
  for select using (auth.role() = 'authenticated');
create policy jobs_admin_write on public.jobs
  for all using (public.is_admin()) with check (public.is_admin());

create policy notes_read on public.coding_notes
  for select using (auth.role() = 'authenticated');
create policy notes_admin_write on public.coding_notes
  for all using (public.is_admin()) with check (public.is_admin());

create policy rankings_read on public.ranking_records
  for select using (auth.role() = 'authenticated');
create policy rankings_admin_write on public.ranking_records
  for all using (public.is_admin()) with check (public.is_admin());

-- ── student_profiles ──────────────────────────────────────────────────────
create policy profiles_owner_select on public.student_profiles
  for select using (user_id = auth.uid() or public.is_admin());
create policy profiles_owner_insert on public.student_profiles
  for insert with check (user_id = auth.uid());
create policy profiles_owner_update on public.student_profiles
  for update using (user_id = auth.uid() or public.is_admin());
create policy profiles_admin_delete on public.student_profiles
  for delete using (public.is_admin());
-- Public-safe author fields are surfaced through the posts feed via a view;
-- basic author lookups for the feed are allowed read-only to authenticated users.
create policy profiles_public_author on public.student_profiles
  for select using (auth.role() = 'authenticated');

-- ── owner-only child tables ────────────────────────────────────────────────
create policy subjects_owner on public.student_subjects
  for all using (profile_id = public.my_profile_id() or public.is_admin())
  with check (profile_id = public.my_profile_id());

create policy semrec_owner on public.semester_records
  for all using (profile_id = public.my_profile_id() or public.is_admin())
  with check (profile_id = public.my_profile_id());

create policy conv_owner on public.ai_conversations
  for all using (profile_id = public.my_profile_id() or public.is_admin())
  with check (profile_id = public.my_profile_id());

create policy msg_owner on public.ai_messages
  for all using (
    exists (select 1 from public.ai_conversations c
            where c.id = conversation_id
              and (c.profile_id = public.my_profile_id() or public.is_admin()))
  )
  with check (
    exists (select 1 from public.ai_conversations c
            where c.id = conversation_id and c.profile_id = public.my_profile_id())
  );

create policy jobmatch_owner on public.job_matches
  for all using (profile_id = public.my_profile_id() or public.is_admin())
  with check (profile_id = public.my_profile_id());

create policy cv_owner on public.cv_profiles
  for all using (profile_id = public.my_profile_id() or public.is_admin())
  with check (profile_id = public.my_profile_id());

-- ── community ───────────────────────────────────────────────────────────────
create policy posts_read on public.posts
  for select using (
    (status = 'published' and auth.role() = 'authenticated')
    or author_id = public.my_profile_id()
    or public.is_admin()
  );
create policy posts_owner_insert on public.posts
  for insert with check (author_id = public.my_profile_id());
create policy posts_owner_update on public.posts
  for update using (author_id = public.my_profile_id() or public.is_admin());
create policy posts_owner_delete on public.posts
  for delete using (author_id = public.my_profile_id() or public.is_admin());

create policy comments_read on public.comments
  for select using (auth.role() = 'authenticated');
create policy comments_owner_insert on public.comments
  for insert with check (author_id = public.my_profile_id());
create policy comments_owner_update on public.comments
  for update using (author_id = public.my_profile_id() or public.is_admin());
create policy comments_owner_delete on public.comments
  for delete using (author_id = public.my_profile_id() or public.is_admin());

create policy likes_read on public.post_likes
  for select using (auth.role() = 'authenticated');
create policy likes_owner_write on public.post_likes
  for all using (profile_id = public.my_profile_id())
  with check (profile_id = public.my_profile_id());

create policy reports_insert on public.post_reports
  for insert with check (reporter_id = public.my_profile_id());
create policy reports_admin_read on public.post_reports
  for select using (public.is_admin() or reporter_id = public.my_profile_id());
create policy reports_admin_update on public.post_reports
  for update using (public.is_admin());

-- ── private feedback (owner insert/read, admin read) ─────────────────────────
create policy univfb_owner_insert on public.university_feedback
  for insert with check (profile_id = public.my_profile_id());
create policy univfb_read on public.university_feedback
  for select using (profile_id = public.my_profile_id() or public.is_admin());

create policy portalfb_owner_insert on public.portal_feedback
  for insert with check (profile_id = public.my_profile_id());
create policy portalfb_read on public.portal_feedback
  for select using (profile_id = public.my_profile_id() or public.is_admin());

create policy feature_owner_insert on public.feature_requests
  for insert with check (profile_id = public.my_profile_id());
create policy feature_read on public.feature_requests
  for select using (profile_id = public.my_profile_id() or public.is_admin());
create policy feature_admin_update on public.feature_requests
  for update using (public.is_admin());

-- ── admin actions ────────────────────────────────────────────────────────────
create policy admin_actions_admin on public.admin_actions
  for all using (public.is_admin()) with check (public.is_admin());
