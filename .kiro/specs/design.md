# Campus Advisor — Design

This document describes the architecture, technical stack, AI service layer, database schema, security model, and cross-cutting concerns that satisfy `requirements.md`.

---

## 1. Architecture Overview

Campus Advisor is a **single deployable full-stack app on Vercel Free** — no microservices, no paid infrastructure, no credit card (R21):

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS (SPA served by **Vercel Free** static hosting).
- **Backend/API:** **Vercel Serverless Functions** (Free tier) under `/api/*` (Node runtime, TypeScript). All privileged work (AI calls, moderation, admin ops) happens server-side. No secrets in the browser bundle.
- **Database + Auth + Storage:** **Supabase Free** (Postgres, GoTrue Auth, Storage). Row-Level Security (RLS) enforces per-user data isolation. Storage used only where necessary (avatars, optional post images).
- **AI:** Provider-abstracted service in the serverless layer — **`FreeAIProvider`** (a free-tier AI API) with a deterministic **`MockAIProvider`** fallback for keyless/rate-limited demos.

```
Browser (React SPA)  — free/open-source libs only, Lucide icons, local assets
  │  Supabase JS (auth + public reads under RLS)
  │  fetch() → /api/* (privileged ops)
  ▼
Vercel Serverless Functions (Free)  ── AIProvider ──▶ FreeAIProvider | MockAIProvider
  │  supabase-js (service role, server only)
  ▼
Supabase Free: Postgres (RLS) + Auth + Storage
```

### Why this shape
- Solo-dev friendly, one repo, one deploy target, **entirely free tier** (R21/§21).
- Secrets (`AI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY`) live only in serverless env (§18/§22) — never in the frontend.
- Supabase Free gives auth, DB, storage, and RLS out of the box — no custom auth server, no microservices, no AWS, no paid SaaS.

---

## 2. Tech Stack & Libraries

**Every item below is free / open-source and requires no credit card (R21).**

| Concern | Choice | Cost |
|---|---|---|
| Framework | React 18 + Vite + TypeScript | free OSS |
| Styling | Tailwind CSS + CSS variables for theming (light/dark) | free OSS |
| Routing | React Router v6 (lazy routes) | free OSS |
| Server state | TanStack Query (caching, loading/error states) | free OSS |
| Forms/validation | React Hook Form + **Zod** (shared client+server schemas) | free OSS |
| Icons | **Lucide React** (open-source icons; local assets otherwise) | free OSS |
| Toasts | sonner (or react-hot-toast) | free OSS |
| Charts (admin) | Recharts (lazy-loaded) | free OSS |
| CV export | react-to-print + print CSS (**browser print-to-PDF**, no paid service) | free OSS |
| Auth/DB/Storage | **Supabase Free** (`@supabase/supabase-js`) | free tier, no card |
| Serverless | **Vercel Free** Functions (`/api`, Node) | free tier, no card |
| Repository | **GitHub Free** | free |
| AI | `AIProvider` interface → **`FreeAIProvider`** (free-tier API) + **`MockAIProvider`** | free tier / keyless |
| Jobs data | Seeded dataset behind `JobsSourceAdapter` (free/official API later) | free |
| Testing | Vitest + Testing Library (unit); Playwright optional (e2e) | free OSS |
| Lint/format | ESLint + Prettier | free OSS |

> **No AWS, no paid APIs, no paid SaaS, no paid DB/auth/storage, no credit-card services** are used in the MVP.

---

## 3. Application Layers (frontend)

```
src/
  app/            # router, providers, theme, error boundary
  components/ui/  # design-system primitives (Button, Card, Input, Badge, Skeleton, EmptyState, Toast host)
  components/     # composed feature components
  features/
    auth/         # sign up, login, session, guards
    profile/      # profile + subjects (max 7)
    dashboard/
    advisor/      # AI hub, agent selector, chat, routing UI
    jobs/         # list, filters, match badge
    notes/        # coding notes reader
    cv/           # builder + templates + AI advisor panel
    gpa/          # GPA + CGPA calculators
    community/    # feed, post CRUD, comments, report
    feedback/     # university feedback + portal feedback + feature requests
    rankings/
    admin/        # admin dashboard sections + analytics
  lib/
    supabase.ts   # browser client (anon key)
    api.ts        # typed fetch wrapper to /api
    grades.ts     # grade scales + GPA/CGPA math (pure, unit-tested)
    matching.ts   # deterministic job match scoring (pure, unit-tested)
    zodSchemas.ts # shared validation
  types/          # generated + hand-written DB types
```

### Backend layer (`/api`)
```
api/
  ai/advise.ts        # POST: routes/handles agent chat (server-side AI call)
  ai/cv-review.ts     # POST: CV analysis
  ai/route-intent.ts  # (optional) explicit intent classification endpoint
  jobs/match.ts       # POST: compute match + LLM explanation
  moderation/check.ts # POST: content check for community posts
  admin/*.ts          # admin-only mutations (guarded by role check)
  _lib/
    auth.ts           # verify Supabase JWT, load role
    supabaseAdmin.ts  # service-role client (server only)
    ai/               # AIProvider interface, FreeAIProvider, MockAIProvider, prompts, router
    jobs/adapter.ts   # JobsSourceAdapter interface (seed adapter now, free API later)
    rateLimit.ts      # simple token-bucket per user/IP
```

---

## 4. AI Service Layer (§24)

### Provider interface
```ts
interface AIProvider {
  complete(input: {
    system: string;
    messages: ChatMessage[];
    temperature?: number;
    maxTokens?: number;
  }): Promise<{ text: string }>;
}
```

**Provider selection is env-driven (R21):**

```
AI_MODE = "free" | "mock"   // default "mock" when no key present
AI_API_KEY   (serverless only, never in frontend)
AI_BASE_URL  (free-tier endpoint, OpenAI-compatible where possible)
AI_MODEL
```

- **`FreeAIProvider`** — calls a **free-tier** AI chat API using `AI_API_KEY` + `AI_BASE_URL` + `AI_MODEL`. Recommended free options (no credit card): **Google Gemini free tier** or **Groq free tier** (both OpenAI-compatible or thin-adapter friendly). The provider is written against the OpenAI-compatible request shape so any free-tier compatible endpoint can be swapped via env only.
- **`MockAIProvider`** — deterministic, template-based responses keyed by agent + intent, so the app is fully demoable with **no keys and zero cost**. Selected automatically when `AI_API_KEY` is absent or `AI_MODE=mock`, and used as a **runtime fallback** if `FreeAIProvider` errors or is rate-limited (the UI notes the fallback).

> **Cost note:** No paid model tiers are used in the MVP. If the free tier is exhausted, the system degrades gracefully to `MockAIProvider` rather than incurring cost.

### Agents & prompts
Each agent = a system prompt + allowed context fields. Prompts stored in `api/_lib/ai/prompts/`:
- **academicAdvisor** — inputs: department, semester, subjects (name/credits/grade), goals. Outputs study plans, prioritization, daily tasks.
- **careerAdvisor** — inputs: degree, department, semester, skills, interests, goals. Outputs roadmap, skills, interview prep.
- **codingMentor** — explains concepts + examples for the listed languages/topics.
- **cvAdvisor** — analyzes CV JSON, returns weaknesses/wording/missing-skills suggestions.

All prompts embed **safety rules** (R5): don't fabricate university facts, rankings, jobs, deadlines; tell the user to verify unavailable info; label recommendations vs verified data.

### Intent router
`router.ts` maps a free-text message to an agent using keyword/heuristic scoring (fast, deterministic, testable), with an optional LLM fallback classification. The chosen agent is returned to the UI so it can render the agent **badge**. Manual selection always overrides routing.

### Context minimization (R18/§24)
A `buildContext(profile, agent)` function passes only the fields each agent needs — never email, password, roll number, or private feedback.

---

## 5. Job Match Scoring (§8, R6)

Deterministic and explainable, computed in `lib/matching.ts` (also usable server-side):

```
score = 0.50 * skillOverlap
      + 0.20 * departmentRelevance
      + 0.20 * interestOverlap
      + 0.10 * semesterFit
→ clamp to 0..100
```
- `skillOverlap` = |student.skills ∩ job.required_skills| / |job.required_skills|
- `departmentRelevance` = mapping table (dept → job tags)
- `interestOverlap` = interests ∩ job tags
- `semesterFit` = internships favor lower semesters, full-time favors higher
The AI (`FreeAIProvider` or `MockAIProvider`) only turns the component breakdown into a human sentence ("Strong match: you have 4/5 required skills…"). The **number is never AI-generated**, so match quality is free, deterministic, and unaffected by AI availability.

### Jobs data source (free, no paid API — R21/§8)
Jobs are read through a `JobsSourceAdapter` interface:
```ts
interface JobsSourceAdapter { list(filter): Promise<Job[]>; get(id): Promise<Job | null>; }
```
- **MVP:** `SeedJobsAdapter` reads a curated, seeded dataset in the DB (`jobs` table). No external calls, no cost.
- **Future scope:** a `FreeApiJobsAdapter` can wrap a free/official jobs API later without touching feature code. **No scraping. No paid jobs API.**

---

## 6. Database Schema (Postgres / Supabase Free)

All tables have `id uuid primary key default gen_random_uuid()`, `created_at timestamptz default now()`, and (where mutable) `updated_at`. RLS enabled on every table.

### Identity & profile
- **users** *(mirrors auth.users)* — `id` (=auth uid), `email`, `role` enum(`student`,`admin`) default `student`, `is_disabled` bool.
- **student_profiles** — `user_id` FK→users (unique), `full_name`, `avatar_url`, `roll_number`, `university_id` FK, `department_id` FK, `semester` int, `skills` text[], `career_interests` text[], `bio`, `academic_info` jsonb.
- **universities** — `name`, `country`, `city`, `type`, `website`, `logo_url`.
- **departments** — `university_id` FK (nullable for generic), `name`.
- **subjects** *(catalog, optional)* — `name`, `department_id` FK.
- **student_subjects** — `profile_id` FK, `subject_name`, `credit_hours` numeric, `grade` text (nullable), `marks` numeric (nullable). **Constraint/trigger: max 7 rows per profile.**

### GPA
- **semester_records** — `profile_id` FK, `semester_label`, `gpa` numeric, `credits` numeric. (Prior semesters for CGPA.)

### AI
- **ai_conversations** — `profile_id` FK, `title`, `agent` enum(`academic`,`career`,`coding`,`cv`,`auto`).
- **ai_messages** — `conversation_id` FK, `role` enum(`user`,`assistant`,`system`), `agent` (resolved), `content`, `meta` jsonb.

### Jobs
- **jobs** — `title`, `company`, `location`, `is_remote` bool, `employment_type` enum(`internship`,`full_time`,`part_time`,`contract`), `required_skills` text[], `tags` text[], `experience_level`, `apply_url`, `posted_date`, `source`.
- **job_matches** *(cached, optional)* — `profile_id` FK, `job_id` FK, `score` int, `explanation`, unique(profile_id, job_id).

### Coding notes
- **coding_notes** — `technology`, `slug` unique, `title`, `sections` jsonb (introduction/fundamentals/syntax/concepts/examples/best_practices/interview_tips), `order`.

### CV
- **cv_profiles** — `profile_id` FK (unique), `template` text, `headline`, `summary`, `personal` jsonb, `skills` text[], `languages` text[], `links` jsonb, `certifications` jsonb, `achievements` jsonb.
- **cv_experience** — `cv_id` FK, `title`, `org`, `start`, `end`, `bullets` text[], `order`.
- **cv_projects** — `cv_id` FK, `name`, `description`, `tech` text[], `link`, `order`.
- **cv_education** — `cv_id` FK, `institution`, `degree`, `start`, `end`, `grade`, `order`.

### Community
- **posts** — `author_id` FK→profiles, `university_id` FK, `category` enum(8 values), `content`, `image_url`, `status` enum(`published`,`hidden`,`removed`) default `published`, `likes_count` int.
- **comments** — `post_id` FK, `author_id` FK, `content`, `status`.
- **post_likes** — `post_id` FK, `profile_id` FK, unique(post_id, profile_id).
- **post_reports** — `post_id` FK, `reporter_id` FK, `reason`, `status` enum(`open`,`reviewed`,`actioned`,`dismissed`).

### Feedback & requests
- **university_feedback** — `profile_id` FK, `university_id` FK, `category` enum(teachers/staff/facilities/academics/admin/other), `rating` int(1–5), `feedback`, `semester`, `department`, `is_private` bool default true.
- **portal_feedback** — `profile_id` FK, `type` enum(`bug`,`ux`,`general`), `message`.
- **feature_requests** — `profile_id` FK, `title`, `description`, `category`, `priority` enum(`low`,`medium`,`high`), `status` enum(`open`,`planned`,`in_progress`,`completed`,`rejected`) default `open`.

### Rankings
- **ranking_records** — `university_name`, `country`, `position` int, `source` text (e.g. "QS World University Rankings"), `year` int, `category` text. (Seeded; source+year mandatory.)

### Audit
- **admin_actions** — `admin_id` FK, `action`, `entity`, `entity_id`, `meta` jsonb.

### Relationships & indexes
- FKs as above with `on delete cascade` for owned child rows.
- Indexes: `student_profiles(user_id, university_id, department_id)`, `posts(university_id, category, status, created_at)`, `jobs(employment_type, is_remote)`, `ai_messages(conversation_id)`, `ranking_records(country, source, year)`, unique indexes on link tables.
- **Max-7-subjects** enforced via a `BEFORE INSERT` trigger counting rows per profile (belt-and-suspenders with app validation).

---

## 7. Security Model (§22, R18)

- **RLS policies:**
  - `student_profiles`, `cv_*`, `ai_*`, `university_feedback`, `portal_feedback`, `feature_requests`, `student_subjects`, `semester_records`: owner-only read/write (`profile.user_id = auth.uid()`); admins read all.
  - `posts`/`comments`: read published to all authenticated; write/update/delete only own; admins full.
  - `jobs`, `coding_notes`, `ranking_records`, `universities`, `departments`: read all authenticated; write admin-only.
  - `post_reports`, `admin_actions`: insert by owner/system; read admin-only.
- **API auth:** every `/api/*` verifies the Supabase JWT (`_lib/auth.ts`); admin endpoints assert `role='admin'`.
- **Secrets:** browser gets only `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`. `AI_API_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are serverless-only.
- **Validation:** Zod schemas shared client/server; server re-validates all mutations.
- **Rate limiting:** token-bucket per user/IP on AI + write endpoints (`_lib/rateLimit.ts`).
- **Error handling:** typed error envelope `{ error: { code, message } }`; no stack/internal leakage.
- **First admin:** promoted by seed script reading `ADMIN_EMAILS` env; never via signup.

---

## 8. Theming & Design System (§19/§20)

- CSS variables for palette: `--brand` (blue), `--brand-2` (light blue), `--accent` (green), plus neutral black/white; `data-theme="light|dark"` toggles token values; system-preference default with persisted override.
- UI primitives in `components/ui`: Button, Card, Input/Select/Textarea, Badge, Avatar, Skeleton, EmptyState, Toast, Modal, Tabs, Table. Subtle shadows, rounded-2xl cards, restrained motion (Tailwind transitions + a few Framer-style micro-interactions).
- Accessibility: WCAG-AA contrast, focus rings, keyboard nav, `aria-*` on interactive elements.

---

## 9. States (§26, R20)

Standard pattern per async view via TanStack Query:
`isLoading` → Skeleton · `isError` → ErrorState(retry) · empty data → EmptyState(CTA) · unauthorized → redirect/guard · invalid input → inline Zod messages · AI failure → inline retry + Mock fallback note.

---

## 10. Performance (§23, R19)

- Route-level `React.lazy` + Suspense; admin & charts code-split.
- TanStack Query caching + `staleTime` to cut redundant calls; job matches cached in `job_matches`.
- Image `loading="lazy"`, avatar size limits, Vite asset hashing.
- Minimal AI payloads (context minimization) to reduce latency/cost.

---

## 11. Seed & Demo (hackathon reliability)

`npm run seed` (Node script using service role) populates: universities/departments (PK-focused), coding notes, jobs, ranking_records (with real sources+years), a demo student (full profile + subjects + CV + posts) and an admin (from `ADMIN_EMAILS`). Combined with `AI_MODE=mock`, the whole §30 demo works without any external key.

---

## 12. Deployment (§15) — all free tier

- **Vercel Free** project; framework preset "Vite"; `/api` auto-detected as functions. No credit card required.
- Env vars set in Vercel dashboard (see `.env.example`).
- **Supabase Free** project provisioned; migrations in `supabase/migrations`, applied via Supabase CLI or SQL editor. No credit card required.
- **GitHub Free** repository connected to Vercel for CI/CD.
- `vercel.json` for SPA rewrite (`/* → /index.html`) excluding `/api`.

> **Sandbox note:** This build/planning environment has no outbound internet, so `npm install`, Supabase provisioning, and live AI calls run in the user's environment / Vercel, not here. Code is written to be install-and-deploy ready.

---

## 13. Cost Protection & Free-Tier Guarantees (R21)

**Cost-protection gate (applied before adding anything):** for every dependency/API/service, first ask *"Can this be done with free/open-source functionality?"* — prefer the free option; if a capability would require payment, ship a free MVP alternative and record the paid option under "future scope" only.

| Concern | Free MVP choice | Paid option (future scope only) |
|---|---|---|
| Hosting + serverless | Vercel Free | Vercel Pro |
| DB + Auth + Storage | Supabase Free | Supabase Pro |
| AI | `FreeAIProvider` (Gemini/Groq free tier) + `MockAIProvider` fallback | premium OpenAI/Anthropic models |
| PDF/CV | Browser print-to-PDF | managed PDF service |
| Jobs data | Seeded dataset via `JobsSourceAdapter` | paid jobs API |
| Rankings | Seeded verified data (source + year) | licensed rankings API |
| Images/icons | Lucide + local optimized assets | paid CDN/image API |
| Repo/CI | GitHub Free + Vercel Git integration | paid CI |

**Guarantees:**
- The full §30 demo runs with `AI_MODE=mock` — **zero external dependencies, zero cost**.
- If `FreeAIProvider` is missing a key, errors, or is rate-limited, the system **auto-falls back to `MockAIProvider`** (never to a paid service).
- No feature performs unbounded external calls or large media processing that could exceed free quotas.
- No secret/API key is shipped to the browser.
