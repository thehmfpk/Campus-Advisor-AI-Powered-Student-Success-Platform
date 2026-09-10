# Campus Advisor

**Your AI-Powered Campus Companion.**

Campus Advisor is a production-quality, free-tier web application that acts as a university student's personal digital companion. It combines multi-agent AI guidance, career development, coding education, job discovery, CV creation, GPA/CGPA tracking, university feedback, rankings, and a cross-university student community into a single, cohesive platform.

Built spec-driven with [Kiro](https://kiro.dev). Deployed on Vercel with a Supabase backend, running entirely on free tiers with no credit card required.

---

## Table of Contents

1. [The Problem](#the-problem)
2. [The Idea](#the-idea)
3. [The Solution](#the-solution)
4. [Key Features](#key-features)
5. [How the AI Works](#how-the-ai-works)
6. [Tech Stack](#tech-stack)
7. [Architecture](#architecture)
8. [Project Workflow](#project-workflow)
9. [Data Model](#data-model)
10. [Getting Started](#getting-started)
11. [Supabase Setup](#supabase-setup)
12. [Deployment](#deployment)
13. [Project Structure](#project-structure)
14. [Security and Privacy](#security-and-privacy)
15. [Roadmap](#roadmap)
16. [Author](#author)

---

## The Problem

University students juggle many disconnected concerns at once, and the tools to manage them are scattered and generic:

- **Academic pressure without guidance.** Students struggle with study planning, exam preparation, and time management, often with no personalized help.
- **Career uncertainty.** Many students do not know which skills to learn, how to build a roadmap, or how to prepare for internships and interviews.
- **Fragmented tooling.** GPA calculators, CV builders, job boards, coding notes, and community forums all live in separate apps that do not understand the student.
- **Weak, impersonal job discovery.** Generic job boards do not explain why a role fits a specific student's skills and background.
- **No trustworthy, student-focused community.** Reliable, university-specific information and peer connections are hard to find in one place.
- **Cost barriers.** Students in developing regions often cannot afford paid tools or services that require a credit card.

## The Idea

Build one intelligent platform that does not merely store a student's information, but actually understands the student and helps them make better academic and career decisions. The platform should:

- Treat AI as a core capability, not a decorative add-on.
- Be genuinely useful out of the box, even without paid API keys.
- Combine every major student need (study, career, coding, CV, jobs, community, rankings) in a coherent, professional experience.
- Run at zero cost on free tiers so any student can use and any developer can deploy it.

## The Solution

Campus Advisor delivers a personalized dashboard, a multi-agent AI advisor, explainable job matching, an ATS-friendly CV builder, accurate GPA/CGPA tooling, comprehensive coding notes, a moderated cross-university community with societies, verified university rankings, and a full admin control center with analytics.

The AI advisor is powered by a provider abstraction: it uses a free-tier AI API when configured, and otherwise falls back to a built-in, knowledge-based responder that answers instantly in the browser. This guarantees the product works and demos reliably with no keys, no server dependency, and no cost.

---

## Key Features

**Authentication and profiles**
- Secure sign up, login, logout, and persistent sessions.
- Role-based access control for students and administrators.
- Editable student profile with avatar, university, department, semester, skills, interests, bio, and up to seven subjects.
- Live profile-completion meter that guides students to a complete profile.

**Personalized dashboard**
- Time-aware welcome and an academic overview (semester, subjects, GPA, skills).
- Deterministic, profile-derived AI recommendations.
- GPA trend visualization and profile-completion progress ring.
- Quick actions and career, community, and rankings shortcuts.

**Multi-agent AI Advisor**
- Four specialized agents: Academic Advisor, Career Advisor, Coding Mentor, and CV Advisor.
- Automatic intent routing, or manual agent selection, with the active agent shown clearly.
- Works fully in the browser with a built-in knowledge base, or via a configured free-tier AI provider.

**Jobs and internships**
- Curated listings with required skills, location, employment type, posted date, and closing date.
- Explainable AI match score computed deterministically from the student's skills, department, interests, and semester.
- Real, working apply links that open the relevant LinkedIn Jobs and Google Jobs searches.

**AI CV Builder**
- Structured builder for personal info, education, experience, projects, skills, certifications, achievements, languages, and links.
- Clean, ATS-friendly template with an optional profile photo.
- Browser print-to-PDF export and AI-assisted content review.

**GPA and CGPA calculator**
- Accurate, transparent calculations on the HEC 4.0 scale with a full breakdown.

**Coding notes**
- Long-form, read-only study material across HTML, CSS, JavaScript, TypeScript, Python, Java, C, C++, SQL, React, Node.js, Git, Data Structures, and Algorithms.
- Each topic covers introduction, fundamentals, syntax, key concepts, a deep dive, examples, practice exercises, common mistakes, best practices, and interview tips.

**University community and societies**
- Cross-university feed with categories, likes, comments, reporting, and moderation.
- Attach images or videos to posts; delete your own comments.
- Societies and clubs directory (GDGoC, AWS Cloud Club, GitHub Campus, IEEE, ACM, and more) that students can join and search.

**University rankings**
- Verified national (HEC) and global (QS, THE, QS Asia) rankings with clearly cited source and year.
- Search, filter, and sort across countries, categories, and sources.

**Feedback and requests**
- Private university feedback, platform feedback, and feature requests with status tracking.

**Admin control center**
- Dedicated, restricted admin login (no public sign-up).
- Analytics dashboard with charts, student management, community moderation, feedback review, and management of jobs, universities, and rankings.

---

## How the AI Works

The AI layer is designed for reliability and zero cost.

- **Provider abstraction.** An `AIProvider` interface has two implementations: a `FreeAIProvider` for a free-tier, OpenAI-compatible API (for example Groq or Gemini), and a `MockAIProvider` that answers from a built-in knowledge base.
- **Client-side knowledge base.** The advisor ships with more than fifty curated question-and-answer entries spanning academic, career, coding, and CV domains. It answers instantly in the browser, so the chatbot works with no API key and no server.
- **Explainable job matching.** Match percentages are computed by a deterministic scoring function (skills overlap, department relevance, interest overlap, and semester fit). The AI only phrases the explanation; it never invents the number.
- **Safety.** Prompts instruct the AI not to fabricate university-specific facts, rankings, jobs, or deadlines, and to clearly separate recommendations from verified information.

---

## Tech Stack

Every component runs on a free tier or open-source license.

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, TypeScript |
| Styling | Tailwind CSS with CSS-variable theming (light and dark) |
| Routing | React Router |
| Server state | TanStack Query |
| Forms and validation | React Hook Form, Zod |
| Icons | Lucide React |
| Backend and API | Vercel Serverless Functions (Node) |
| Database, Auth, Storage | Supabase (PostgreSQL, GoTrue, Storage) |
| AI | Provider abstraction (free-tier API + built-in knowledge base) |
| Testing | Vitest, Testing Library |
| Hosting | Vercel |
| Version control | Git and GitHub |

---

## Architecture

```
Browser (React SPA)
  |
  |  Supabase JS client (auth and row-level-secured reads/writes)
  |  fetch() to /api/* for privileged operations (AI, admin, moderation)
  v
Vercel Serverless Functions  --- AIProvider ---> Free-tier AI API | Built-in knowledge base
  |
  |  supabase-js with service role (server only)
  v
Supabase: PostgreSQL (Row-Level Security) + Auth + Storage
```

Principles:

- Single deployable project, no microservices, solo-developer friendly.
- Secrets live only in serverless environment variables and never reach the browser.
- Row-Level Security enforces that students access only their own private data, while public content is readable to authenticated users.
- The application degrades gracefully: with bundled data and the built-in AI, the full experience works even before the database is populated.

---

## Project Workflow

The project follows a spec-driven, incremental workflow with continuous delivery.

1. **Specify.** Requirements, design, and tasks are authored as Kiro specs in `.kiro/specs` before implementation.
2. **Design.** Architecture, data model, security policies, and the AI service layer are documented and reviewed.
3. **Build in phases.** Features are implemented in small, testable increments (authentication, profiles, dashboard, GPA tools, AI advisor, jobs, CV builder, coding notes, community, feedback, rankings, admin, then polish).
4. **Validate.** Pure logic (grade math, match scoring, intent routing) is covered by unit tests; every screen handles loading, empty, error, and unauthorized states.
5. **Ship continuously.** Each change is committed and pushed to the `main` branch on GitHub.
6. **Deploy automatically.** A push to `main` triggers an automatic Vercel build and deployment, taking the change live.
7. **Configure once.** Supabase migrations, storage buckets, and environment variables are one-time steps performed in the Supabase and Vercel dashboards.

Delivery flow:

```
Author change  ->  Commit  ->  Push to GitHub (main)  ->  Vercel auto-build  ->  Live
```

---

## Data Model

Core tables (managed by Row-Level Security):

- `users`, `student_profiles`, `universities`, `departments`, `subjects`, `student_subjects`, `semester_records`
- `ai_conversations`, `ai_messages`
- `jobs`, `job_matches`
- `coding_notes`
- `cv_profiles`
- `posts`, `comments`, `post_likes`, `post_reports`
- `societies`, `society_memberships`
- `university_feedback`, `portal_feedback`, `feature_requests`
- `ranking_records`, `admin_actions`

A trigger enforces the maximum of seven subjects per student. Helper functions provide the current user's profile id and admin status for policy checks.

---

## Getting Started

Requirements: Node.js 18 or later (Node 22 recommended).

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# Fill in Supabase URL and anon key. AI can stay in mock mode by default.

# 3. Run the development server
npm run dev            # http://localhost:5173

# Useful scripts
npm run build          # production build
npm run preview        # preview the production build
npm run test           # unit tests (Vitest)
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
```

The application works out of the box with bundled demo data and the built-in AI advisor, so it can be explored before any backend configuration.

---

## Supabase Setup

Full one-time steps are in [SUPABASE_SETUP.md](SUPABASE_SETUP.md). Summary:

1. In the Supabase SQL Editor, run the migrations in order:
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rls.sql`
   - `supabase/migrations/0003_societies.sql`
2. In Authentication, keep the Email provider enabled and turn off email confirmation for a smooth demo.
3. In Storage, create two public buckets: `avatars` and `post-media`.
4. Optionally run `npm run seed` locally to populate universities, jobs, notes, rankings, societies, and a demo student.

Admin access is granted automatically to a configured administrator email; that account signs in through the dedicated admin login and reaches the admin dashboard.

---

## Deployment

The application deploys as a single Vercel project.

1. Push the repository to GitHub.
2. Import the repository into Vercel (the Vite framework preset is detected automatically; the `/api` directory becomes serverless functions).
3. Add the environment variables from `.env.example` in the Vercel dashboard.
4. Deploy. No credit card is required.

Environment variables:

```
VITE_SUPABASE_URL          Supabase project URL
VITE_SUPABASE_ANON_KEY     Supabase anon public key
SUPABASE_SERVICE_ROLE_KEY  Supabase service role key (server only)
AI_MODE                    "mock" (default) or "free"
AI_API_KEY                 optional, only for a free-tier AI provider
AI_BASE_URL                optional AI endpoint
AI_MODEL                   optional AI model name
ADMIN_EMAILS               comma-separated administrator emails
```

Once configured, every push to `main` automatically rebuilds and redeploys the live site.

---

## Project Structure

```
.kiro/specs/            Requirements, design, and tasks (spec-driven)
public/                 Static assets (favicon)
src/
  app/                  App shell, router, theme, layout, error boundary
  components/           Design-system UI primitives and shared components
  features/             Feature modules
    auth/               Sign up, login, session, route guards
    dashboard/          Personalized student dashboard
    profile/            Profile and subjects management
    advisor/            Multi-agent AI advisor
    jobs/               Jobs listing and AI matching
    cv/                 CV builder and template
    gpa/                GPA and CGPA calculators
    notes/              Coding notes reader
    community/          Feed, posts, comments, societies
    feedback/           University feedback, platform feedback, feature requests
    rankings/           University rankings
    admin/              Admin login, dashboard, analytics, moderation
  data/                 Bundled datasets (jobs, rankings, notes, societies, demo)
  lib/                  API client, Supabase client, grade math, matching, utilities
  types/                Shared domain types
api/                    Vercel serverless functions
  _lib/                 Auth, rate limiting, AI provider, Supabase admin client
  ai/                   AI advise and CV review endpoints
  jobs/                 Job match endpoint
  admin/                Admin operations
  moderation/           Content moderation
supabase/migrations/    SQL schema, row-level security, societies
scripts/                Database seed script
```

---

## Security and Privacy

- Authentication, authorization, and role-based access control.
- Row-Level Security so students access only their own private data.
- Server-side validation and basic rate limiting on sensitive endpoints.
- All secrets kept in serverless environment variables; no API keys in the frontend bundle.
- Private university feedback is never made public automatically.
- Content moderation guards against abusive language and sharing of private personal information.

---

## Roadmap

- Optional integration with a free or official jobs API through the existing adapter interface.
- Real-time community updates and notifications.
- Additional CV templates.
- Expanded analytics for administrators.

These are documented as future scope and are not required for the current free-tier release.

---

## Author

**Hafiz Muhammad Faizan**

- Email: thehmfpk@gmail.com
- Website: https://www.hafizmfaizan.site

---

Campus Advisor. Your AI-Powered Campus Companion. Built free-tier-first and made with Kiro.
