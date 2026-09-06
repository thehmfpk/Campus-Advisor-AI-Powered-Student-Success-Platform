# Campus Advisor — Requirements

**Product:** Campus Advisor
**Tagline:** Your AI-Powered Campus Companion.
**Status:** Draft for approval (spec-driven, Kiro)

---

## 1. Introduction

Campus Advisor is an AI-powered web platform that acts as a university student's personal digital companion. It combines multi-agent AI guidance (academic, career, coding, CV), job/internship discovery with explainable matching, GPA/CGPA tooling, a CV builder, read-only coding notes, a cross-university student community, university feedback, portal feedback / feature requests, and university rankings — all behind secure authentication with student and admin roles.

The application is a solo-developer-friendly MVP built with React + Vite + TypeScript + Tailwind, deployed on **Vercel Free**, backed by **Supabase Free** (Postgres + Auth + Storage). AI is a first-class capability accessed through a provider-abstracted service layer (`FreeAIProvider` + `MockAIProvider`) that ships with a deterministic mock provider so the product is fully demoable with **no external keys and no cost**.

> **Guiding principle — Free-Tier-First:** Campus Advisor's MVP MUST run end-to-end on strictly free tiers with **no paid services, no paid APIs, no paid hosting/database/auth/storage, and no credit card required**. Before any dependency, API, or external service is added, the cost-protection gate (R21) applies.

### Key design decisions (resolved ambiguities)
- **Grading:** Configurable scale; default **HEC 4.0**. Calculations are deterministic and explained.
- **AI provider:** `AIProvider` interface with two implementations — **`FreeAIProvider`** (a free-tier AI API, e.g. Google Gemini free tier or Groq free tier, OpenAI-compatible where possible) and **`MockAIProvider`** (deterministic, keyless). Provider chosen via environment variables.
- **Job/ranking data:** Seeded structured datasets with explicit `source` + `year`. No scraping. No invented rankings. No paid jobs API — an adapter interface allows a free/official API later.
- **Match score:** Deterministic, explainable scoring; the AI only phrases the explanation.
- **Admin:** Role-based; first admin seeded via env/seed script, never self-signup.
- **CV export:** Browser **print-to-PDF** — no paid PDF service.
- **Images/icons:** Open-source icon library (Lucide) + locally optimized assets; no reliance on external/paid image APIs.

---

## 2. Roles

- **Guest** — unauthenticated; may view landing page only.
- **Student** — authenticated; owns a profile; uses all student features.
- **Admin** — authenticated with `role = 'admin'`; manages platform data and moderates.

---

## 3. Requirements (EARS format)

### R1 — Authentication & Session
**User story:** As a student, I want to securely register, log in, and stay logged in, so that my data is private and persistent.
- WHEN a guest submits the registration form with full name, email, password, roll number, university, department, and semester, THE SYSTEM SHALL create a user with role `student` and a linked `student_profiles` row.
- IF the email is already registered, THEN THE SYSTEM SHALL reject registration with a clear error and SHALL NOT create a duplicate.
- WHEN a user submits valid login credentials, THE SYSTEM SHALL establish a persisted session.
- WHEN a user's session exists and is valid, THE SYSTEM SHALL keep them authenticated across page reloads.
- WHEN an authenticated user logs out, THE SYSTEM SHALL terminate the session and redirect to the landing page.
- IF an unauthenticated user requests a protected student route, THEN THE SYSTEM SHALL redirect to login.
- IF a non-admin requests an admin route, THEN THE SYSTEM SHALL deny access and redirect.
- THE SYSTEM SHALL enforce password minimum length of 8 characters and validate email format.

### R2 — Student Profile
**User story:** As a student, I want a professional editable profile, so that AI guidance is personalized.
- THE SYSTEM SHALL store: avatar, full name, roll number, university, department, semester, subjects, skills, career interests, short bio, academic info.
- WHEN a student edits and saves their profile, THE SYSTEM SHALL persist changes and reflect them on the dashboard.
- THE SYSTEM SHALL allow a maximum of **7 subjects** per student.
- IF a student attempts to add an 8th subject, THEN THE SYSTEM SHALL block it with a clear message.
- Each subject SHALL support subject name, credit hours, and current marks/grade (optional).
- WHEN a student uploads an avatar, THE SYSTEM SHALL store it in object storage and reference it via a signed/public URL.

### R3 — Dashboard
**User story:** As a student, I want a personalized dashboard, so that I see my academic and career overview at a glance.
- THE SYSTEM SHALL display a time-aware welcome ("Good morning, {firstName} 👋").
- THE SYSTEM SHALL display Academic Overview: current semester, number of subjects, GPA, CGPA, academic progress.
- THE SYSTEM SHALL display AI Recommendations derived from the student profile.
- THE SYSTEM SHALL display a Career section: recommended jobs, recommended skills, career progress, CV status.
- THE SYSTEM SHALL display a Community preview: latest posts, opportunities, events.
- THE SYSTEM SHALL display Quick Actions: Ask AI Advisor, Calculate GPA, Build CV, Find Jobs, Coding Notes, Community.
- WHILE data is loading, THE SYSTEM SHALL show skeleton loaders; IF a section has no data, THE SYSTEM SHALL show an empty state.

### R4 — Multi-Agent AI Advisor
**User story:** As a student, I want specialized AI agents, so that I get expert-style help for each domain.
- THE SYSTEM SHALL provide four agents: Academic Advisor, Career Advisor, Coding Mentor, CV Advisor.
- WHEN a student sends a message, THE SYSTEM SHALL either use the manually selected agent OR route to an agent via intent detection.
- THE SYSTEM SHALL display the active agent clearly in the conversation (badge).
- THE SYSTEM SHALL pass relevant, minimized profile context (department, semester, subjects, skills, interests) to the agent.
- THE SYSTEM SHALL persist conversations and messages per student.
- IF the AI provider fails or times out, THEN THE SYSTEM SHALL show a graceful error and allow retry.

### R5 — AI Safety & Reliability
- THE SYSTEM SHALL instruct agents to not fabricate university-specific facts, rankings, jobs, or deadlines.
- WHEN information is not available in the system, THE SYSTEM SHALL state it should be verified.
- THE SYSTEM SHALL clearly distinguish AI recommendations from verified data in the UI.

### R6 — Jobs & Internships + AI Matching
**User story:** As a student, I want to discover and be matched to opportunities.
- THE SYSTEM SHALL list jobs with: title, company, location, remote/onsite, employment type, required skills, experience, application link, posted date.
- THE SYSTEM SHALL support filters: internship, full-time, part-time, remote, location, technology/skill.
- THE SYSTEM SHALL compute a deterministic match score (0–100%) from student skills, department, career interests, and semester.
- THE SYSTEM SHALL display "AI Match: N%" with a human-readable explanation.
- THE SYSTEM SHALL NOT scrape third-party sites; job data comes from a seeded dataset or an authorized API adapter.

### R7 — Coding Notes (read-only)
- THE SYSTEM SHALL provide read-only notes grouped by technology (HTML, CSS, JS, Python, Java, C++, SQL, React, Node.js, Git, DS, Algorithms).
- Each note SHALL contain: introduction, fundamentals, syntax, key concepts, examples, best practices, interview tips.
- THE SYSTEM SHALL NOT provide course/LMS features (no quizzes, progress tracking) in the MVP.

### R8 — AI CV Builder + CV Advisor
- THE SYSTEM SHALL let students enter personal info, education, skills, experience, projects, certifications, achievements, languages, links.
- THE SYSTEM SHALL provide at least one professional, ATS-friendly template (target: 2).
- WHEN a student requests CV help, THE CV Advisor SHALL analyze content, identify weaknesses, suggest improved wording, and flag missing skills.
- THE SYSTEM SHALL generate a clean printable/downloadable CV (browser print-to-PDF for MVP).

### R9 — GPA / CGPA Calculator
- THE SYSTEM SHALL compute semester GPA from (subject, credit hours, grade) using a configurable grade→grade-point map (default HEC 4.0).
- THE SYSTEM SHALL compute CGPA from prior-semester GPA + credits plus current semester.
- THE SYSTEM SHALL be mathematically accurate (weighted average) and SHALL show the calculation breakdown.
- IF inputs are invalid (negative credits, unknown grade), THEN THE SYSTEM SHALL reject with a clear message.

### R10 — University Community
- THE SYSTEM SHALL provide a public feed where students from different universities post.
- Categories: University Problem, Opportunity, Scholarship, Internship, Event, Achievement, Announcement, General.
- Each post SHALL support author, university, date, category, content, optional image, likes, comments.
- Students SHALL create, edit (own), delete (own), report, search, and filter (by university/category) posts.
- THE SYSTEM SHALL display the author's university on each post.

### R11 — Community Moderation
- Admin SHALL view, hide, and delete posts and review reported content.
- THE SYSTEM SHALL apply basic content checks (keyword + report queue; optional AI check) before/after publish.
- THE SYSTEM SHALL block publishing private/sensitive personal info about teachers/staff (guarded field + moderation).

### R12 — University Feedback (private)
- THE SYSTEM SHALL let students submit feedback on teachers, staff, facilities, academic system, administration, other services.
- Feedback SHALL include university, category, rating, feedback text, optional semester/department.
- Feedback SHALL NOT be public automatically; only admins review it.

### R13 — Portal Feedback & Feature Requests
- THE SYSTEM SHALL let students submit platform feedback (bug, UX, general).
- THE SYSTEM SHALL let students request features (title, description, category, priority).
- Admin SHALL update request status: planned, in-progress, completed, rejected.

### R14 — University Rankings
- THE SYSTEM SHALL provide Pakistani + international rankings with search, filter, sort, and detail.
- Each record SHALL include university name, country, ranking position, ranking organization/source, year, category.
- THE SYSTEM SHALL NOT invent ranking data; every record shows its source and year.

### R15 — Admin Dashboard
- Admin SHALL manage students (view/search/view profile/disable/delete), universities (CRUD), community (view/delete/hide/reports), jobs (CRUD), coding notes (CRUD), feedback (review), feature requests (status), rankings (CRUD with source/year).
- Admin SHALL see analytics: total students, universities, posts, active users, AI conversations, job listings, feedback submissions.

### R16 — Landing Page
- THE SYSTEM SHALL show hero, feature showcase, how-it-works, and final CTA per the product brief, before authentication.

### R17 — UI/UX
- THE SYSTEM SHALL support light and dark modes with an accessible blue/light-blue/green/black/white palette.
- THE SYSTEM SHALL provide skeleton loaders, empty states, success/error states, toasts, and responsive navigation.
- THE SYSTEM SHALL be fully responsive on desktop, tablet, and mobile.

### R18 — Security
- THE SYSTEM SHALL enforce authentication, authorization, and RBAC; protect admin routes.
- THE SYSTEM SHALL validate all inputs client- and server-side.
- THE SYSTEM SHALL keep secrets in environment variables; NO API keys in the frontend bundle.
- THE SYSTEM SHALL enforce row-level security so students access only their own private data.
- THE SYSTEM SHALL apply basic rate limiting to AI and write endpoints where practical.
- THE SYSTEM SHALL handle errors safely without leaking internals.

### R19 — Performance
- THE SYSTEM SHALL lazy-load routes/heavy components, optimize assets, and avoid redundant API calls.
- THE SYSTEM SHALL show loading and error states for all async operations.

### R20 — States (cross-cutting)
- Every major section SHALL handle loading, empty, API failure, unauthorized, invalid input, and AI failure without broken/blank UI.

### R21 — Free-Tier-First & Cost Protection (mandatory, cross-cutting)
**User story:** As a solo hackathon participant, I want the entire MVP to run on free tiers with no credit card, so that I incur zero cost.
- THE SYSTEM SHALL be deployable as a single project on **Vercel Free**.
- THE SYSTEM SHALL use **Supabase Free** for database and authentication, and Supabase Free Storage only where necessary.
- THE SYSTEM SHALL use only free/open-source frontend libraries and a free GitHub repository.
- THE SYSTEM SHALL support at least one **free-tier AI provider** via `FreeAIProvider`, selectable by environment variable.
- THE SYSTEM SHALL include a **`MockAIProvider` fallback** so the complete demo remains functional when the AI API is unavailable, rate-limited, or has no API key.
- THE SYSTEM SHALL NOT introduce AWS, paid APIs, paid SaaS, paid databases, paid authentication, or paid infrastructure for the MVP.
- THE SYSTEM SHALL NOT require a credit card for any core MVP capability.
- THE SYSTEM SHALL avoid features that create unexpected API or storage costs (e.g. unbounded external calls, large media pipelines).
- **Cost-protection gate:** BEFORE adding any dependency, API, integration, or external service, the design SHALL first answer "Can this be implemented with free/open-source functionality?" — IF yes, the free option SHALL be preferred; IF a feature requires payment, a free MVP alternative SHALL be implemented and the paid option documented as future scope only.
- THE SYSTEM SHALL NOT expose any AI API key or other secret in the frontend bundle (keys live only in serverless env).

---

## 4. Acceptance Criteria (end-to-end)

A new student can: register → login → create profile → add up to 7 subjects → view dashboard → calculate GPA/CGPA → ask AI Advisor → use specialized agents → discover jobs → get AI matching → read coding notes → build CV → get AI CV suggestions → view rankings → create community posts → interact cross-university → submit university feedback → submit platform feedback → request features → logout.

An admin can: manage platform data (students, universities, jobs, notes, rankings, feedback, feature requests) and moderate community content.

## 5. Out of Scope (MVP) / Future Paid Scope
Full LMS/courses, real-time chat, native mobile app, payment, multi-language i18n, server-side PDF rendering, web scraping, live third-party job feeds (adapter stubbed, not required).

**Documented as future (paid/optional) scope, explicitly excluded from the free MVP:**
- Paid or higher-tier AI models (e.g. premium OpenAI/Anthropic models) — MVP uses a free-tier provider + mock fallback.
- Managed/paid PDF generation services — MVP uses browser print-to-PDF.
- Paid jobs data APIs — MVP uses a curated seeded dataset behind a `JobsSourceAdapter` interface.
- Paid CDN/image transformation services — MVP uses local optimized assets + open-source icons.
- Any service requiring a credit card or exceeding free-tier quotas.
