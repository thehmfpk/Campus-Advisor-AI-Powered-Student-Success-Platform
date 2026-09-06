# Campus Advisor — Implementation Tasks

Small, testable, incrementally-shippable tasks mapped to `requirements.md` (R#) and `design.md`.
Legend: **[MVP]** required for demo · **[OPT]** stretch/optional · each task lists a **Verify** step.
Keep the app deployable after every phase. Mark tasks `[x]` as completed.

> **Free-Tier-First (R21):** every task uses free/open-source tools only — **Vercel Free, Supabase Free, GitHub Free, free-tier AI + Mock fallback, no paid APIs/SaaS, no credit card.**
> **Cost-protection gate:** before adding any new dependency/API/service in any task, first confirm it can be done free/open-source; if not, ship a free alternative and log the paid option as future scope.

---

## Phase 1 — Project Setup & Architecture
- [ ] 1.1 **[MVP]** Scaffold Vite + React + TS; add Tailwind, ESLint, Prettier, path aliases. *Verify:* `npm run dev` renders a placeholder; `npm run build` passes.
- [ ] 1.2 **[MVP]** Add router (React Router), TanStack Query provider, theme provider (light/dark via CSS vars), toast host, root error boundary. *Verify:* theme toggle persists; routes render.
- [ ] 1.3 **[MVP]** Build UI primitives in `components/ui` (Button, Card, Input, Select, Textarea, Badge, Avatar, Skeleton, EmptyState, Modal, Tabs, Table). *Verify:* a `/kitchen-sink` dev page shows all in light+dark.
- [ ] 1.4 **[MVP]** Add Supabase browser client, typed `api.ts` fetch wrapper, Zod schema module, error envelope type. *Verify:* unit test on api wrapper error mapping.
- [ ] 1.5 **[MVP]** Add `.env.example`, `vercel.json` (SPA rewrite excluding `/api`), README with setup + demo instructions. *Verify:* build succeeds with example env.

## Phase 2 — Auth & Student Profile (R1, R2)
- [ ] 2.1 **[MVP]** Supabase Auth wiring: sign up (full name, email, password, roll number, university, department, semester), login, logout, session persistence. *Verify:* register→refresh→still logged in; logout clears session.
- [ ] 2.2 **[MVP]** Create `users` + `student_profiles` rows on signup (trigger or post-signup call). *Verify:* new user has profile row with role `student`.
- [ ] 2.3 **[MVP]** Route guards: `RequireAuth` (student) and `RequireAdmin`. *Verify:* guest→login redirect; student→admin route denied.
- [ ] 2.4 **[MVP]** Profile page: view/edit avatar (Storage upload), name, roll, university, department, semester, skills, interests, bio, academic info. *Verify:* edits persist and re-render.
- [ ] 2.5 **[MVP]** Subjects manager with **max-7** enforcement (name, credit hours, grade/marks). *Verify:* 8th add blocked with message; app + DB trigger both enforce.

## Phase 3 — Database & Core Dashboard (R3, R18)
- [ ] 3.1 **[MVP]** Author SQL migrations for all schema tables + enums + indexes + max-7 trigger. *Verify:* migration applies cleanly on fresh DB.
- [ ] 3.2 **[MVP]** Enable RLS + policies for every table per design §7. *Verify:* student cannot read another student's profile/CV/feedback; admin can.
- [ ] 3.3 **[MVP]** Seed script (universities, departments, notes, jobs, rankings, demo student, admin from `ADMIN_EMAILS`). *Verify:* `npm run seed` yields demo-ready data.
- [ ] 3.4 **[MVP]** Dashboard: welcome (time-aware), Academic Overview, AI Recommendations placeholder, Career section, Community preview, Quick Actions. *Verify:* renders with seeded data; skeletons + empty states present.

## Phase 4 — GPA / CGPA Calculator (R9)
- [ ] 4.1 **[MVP]** Pure `grades.ts`: grade→GP maps (default HEC 4.0), weighted GPA + CGPA functions, input validation. *Verify:* unit tests cover known cases + invalid inputs.
- [ ] 4.2 **[MVP]** GPA calculator UI (subject/credits/grade) with breakdown display. *Verify:* matches hand-computed example.
- [ ] 4.3 **[MVP]** CGPA calculator UI (prior semesters + current) with explanation. *Verify:* weighted result correct; persists to `semester_records`.

## Phase 5 — AI Advisor & Specialized Agents (R4, R5, §24)
- [ ] 5.1 **[MVP]** `AIProvider` interface + `MockAIProvider` (deterministic, keyless) + `FreeAIProvider` (free-tier API, OpenAI-compatible shape); env-driven selection (`AI_MODE`, `AI_API_KEY`) with **auto-fallback to Mock** on missing key / error / rate-limit. *Verify:* keyless mode returns mock responses; fallback triggers on simulated provider error; unit test on selection.
- [ ] 5.2 **[MVP]** Agent prompts (academic, career, coding, CV) with embedded safety rules (R5) + `buildContext` minimization. *Verify:* context excludes email/roll/password; prompt snapshot tests.
- [ ] 5.3 **[MVP]** Intent router (heuristic, testable) returning chosen agent. *Verify:* the four §6 example prompts route correctly.
- [ ] 5.4 **[MVP]** `/api/ai/advise` endpoint: auth, rate limit, route/handle, persist `ai_conversations`/`ai_messages`. *Verify:* auth required; messages stored.
- [ ] 5.5 **[MVP]** Advisor Hub UI: agent selector + auto, chat, visible agent badge, loading/error/retry. *Verify:* manual selection overrides router; badge shows resolved agent.
- [ ] 5.6 **[MVP]** Dashboard AI Recommendations wired to profile-derived suggestions. *Verify:* recommendations reflect seeded profile.

## Phase 6 — Jobs & AI Matching (R6, §5)
- [ ] 6.0 **[MVP]** `JobsSourceAdapter` interface + `SeedJobsAdapter` (reads seeded `jobs`, no external/paid API). *Verify:* adapter returns seeded jobs; interface allows a future free-API adapter.
- [ ] 6.1 **[MVP]** Jobs list + filters (internship/full-time/part-time/remote/location/skill) from adapter. *Verify:* filters narrow results; empty state.
- [ ] 6.2 **[MVP]** Pure `matching.ts` deterministic score + component breakdown. *Verify:* unit tests on scoring math.
- [ ] 6.3 **[MVP]** `/api/jobs/match`: compute score, LLM/mock explanation, cache in `job_matches`. *Verify:* "AI Match: N%" + explanation render; number is deterministic.

## Phase 7 — CV Builder & CV Advisor (R8)
- [ ] 7.1 **[MVP]** CV data model UI: personal, education, skills, experience, projects, certs, achievements, languages, links (CRUD to `cv_*`). *Verify:* full CV persists/loads.
- [ ] 7.2 **[MVP]** At least one ATS-friendly print template + print-to-PDF. *Verify:* print preview is clean, semantic, single-column ATS layout.
- [ ] 7.3 **[MVP]** `/api/ai/cv-review`: weaknesses, wording, missing skills. *Verify:* returns structured suggestions; mock fallback works.
- [ ] 7.4 **[OPT]** Second CV template + template switcher.

## Phase 8 — Coding Notes (R7)
- [ ] 8.1 **[MVP]** Seed `coding_notes` for the listed technologies (sections jsonb). *Verify:* all categories present.
- [ ] 8.2 **[MVP]** Notes browser: category list + reader (intro/fundamentals/syntax/concepts/examples/best practices/interview tips), read-only. *Verify:* navigation + code formatting render; empty state.

## Phase 9 — University Community (R10, R11)
- [ ] 9.1 **[MVP]** Feed with post cards showing author + university + category + date; search + filter (university/category). *Verify:* filters + search work; pagination/lazy.
- [ ] 9.2 **[MVP]** Create/edit(own)/delete(own) posts; like; comment. *Verify:* ownership enforced by RLS; like toggles.
- [ ] 9.3 **[MVP]** Report post → `post_reports`; basic keyword content check on publish; block sensitive staff PII. *Verify:* flagged content warned/blocked; report recorded.
- [ ] 9.4 **[OPT]** Post image upload to Storage; AI moderation via `/api/moderation/check`.

## Phase 10 — University & Portal Feedback + Feature Requests (R12, R13)
- [ ] 10.1 **[MVP]** University feedback form (private): university, category, rating, text, optional semester/department → `university_feedback` (not public). *Verify:* not visible to other students (RLS).
- [ ] 10.2 **[MVP]** Portal feedback (bug/ux/general) + feature request (title/description/category/priority). *Verify:* submissions stored and listed for owner.

## Phase 11 — University Rankings (R14)
- [ ] 11.1 **[MVP]** Seed `ranking_records` with real attributed sources + years (PK + international). *Verify:* every row has source + year.
- [ ] 11.2 **[MVP]** Rankings page: search, filter (country/category/source), sort, detail; show source + year prominently. *Verify:* sort/filter correct; no fabricated data.

## Phase 12 — Admin Dashboard (R15)
- [ ] 12.1 **[MVP]** Admin shell + `RequireAdmin`; all admin `/api/admin/*` assert role. *Verify:* non-admin blocked at API + UI.
- [ ] 12.2 **[MVP]** Manage students (view/search/profile/disable/delete). *Verify:* disable prevents login; audit row written.
- [ ] 12.3 **[MVP]** Universities CRUD; Jobs CRUD; Coding Notes CRUD; Rankings CRUD (with source/year). *Verify:* changes reflect on student side.
- [ ] 12.4 **[MVP]** Community moderation (view/hide/delete/review reports). *Verify:* hidden posts disappear from feed.
- [ ] 12.5 **[MVP]** Review university + portal feedback; update feature-request status (planned/in-progress/completed/rejected). *Verify:* status change reflects to requester.
- [ ] 12.6 **[MVP]** Analytics: totals for students, universities, posts, active users, AI conversations, jobs, feedback. *Verify:* counts match DB; charts lazy-loaded.

## Phase 13 — Landing Page & UI Polish (R16, R17, §20)
- [ ] 13.1 **[MVP]** Landing page: hero, feature showcase (8 features), how-it-works (5 steps), final CTA. *Verify:* responsive; CTAs route to signup.
- [ ] 13.2 **[MVP]** Responsive nav + layouts across desktop/tablet/mobile; consistent light/dark. *Verify:* manual checks at 360/768/1280px.
- [ ] 13.3 **[MVP]** Micro-interactions, transitions, toasts, consistent empty/success/error states. *Verify:* no layout shift; motion restrained.

## Phase 14 — Security, Performance & Testing (R18, R19, R20)
- [ ] 14.1 **[MVP]** Server-side Zod validation on all mutations; rate limiting on AI + write endpoints. *Verify:* invalid payloads rejected; rate limit returns 429.
- [ ] 14.2 **[MVP]** RLS audit pass; confirm no secrets in client bundle. *Verify:* grep bundle for keys; cross-user access tests fail as expected.
- [ ] 14.3 **[MVP]** Lazy-load routes/charts; add loading/error states everywhere; reduce redundant queries. *Verify:* Lighthouse perf reasonable; code-split chunks present.
- [ ] 14.4 **[MVP]** Unit tests for `grades.ts`, `matching.ts`, router, provider selection; smoke tests for guards. *Verify:* `npm test` green.

## Phase 15 — Vercel Deployment (§15) — free tier, no credit card
- [ ] 15.1 **[MVP]** Configure **Vercel Free** project + env vars; connect **Supabase Free**; apply migrations + seed. *Verify:* production URL loads landing page; confirm no card was required.
- [ ] 15.2 **[MVP]** Verify `/api` functions run in prod (auth, AI mock+real). *Verify:* login + AI advise work in prod.

## Phase 16 — Final QA & Demo Prep (§29, §30)
- [ ] 16.1 **[MVP]** Walk the full acceptance-criteria checklist (register→…→logout). *Verify:* all 20 student criteria pass.
- [ ] 16.2 **[MVP]** Rehearse §30 demo flow end-to-end in mock mode; fix any rough edges. *Verify:* 2–4 min demo runs without errors.
- [ ] 16.3 **[MVP]** Final README/demo script + seeded demo credentials. *Verify:* a fresh reviewer can reproduce the demo.

---

## MVP vs Optional summary
- **MVP:** Phases 1–3, 4, 5, 6, 7.1–7.3, 8, 9.1–9.3, 10, 11, 12, 13, 14, 15, 16.
- **Optional/stretch:** 7.4 (2nd template), 9.4 (image upload + AI moderation), real jobs API adapter, advanced analytics, e2e Playwright suite, real-time comments.
