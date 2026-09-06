# Campus Advisor

**Your AI-Powered Campus Companion.**

An AI-powered platform that helps university students with academic guidance, career development, coding learning, job discovery, CV creation, GPA/CGPA tracking, university feedback, rankings, and a cross-university student community.

Built spec-driven with **[Kiro](https://kiro.dev)** — see [`.kiro/specs/`](.kiro/specs).

---

## 🆓 Free-Tier-First

This project runs **entirely on free tiers with no credit card**:

| Concern | Service |
|---|---|
| Hosting + serverless | **Vercel Free** |
| Database + Auth + Storage | **Supabase Free** |
| Repository | **GitHub Free** |
| AI | Free-tier provider (Groq / Gemini) + **Mock fallback** |
| CV export | Browser print-to-PDF |
| Icons | Lucide (open-source) |

If no AI key is set, the app uses a deterministic **Mock AI provider** so the full demo works with zero cost. See [`.kiro/specs/design.md`](.kiro/specs/design.md) §13 for the cost-protection guarantees.

---

## 🧱 Tech Stack

React 18 · Vite · TypeScript · Tailwind CSS · React Router · TanStack Query · React Hook Form + Zod · Supabase · Vercel Serverless Functions · Vitest.

---

## 🚀 Getting Started

> Requires Node.js 18+ (Node 22 recommended).

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
#    Fill in Supabase Free URL + anon key. AI can stay in mock mode (default).

# 3. Run the dev server
npm run dev            # http://localhost:5173

# Useful scripts
npm run build          # type-check + production build
npm run preview        # preview the production build
npm run test           # run unit tests (Vitest)
npm run lint           # ESLint
npm run typecheck      # tsc --noEmit
```

During development, visit `/kitchen-sink` to preview all UI primitives in light and dark mode.

---

## 📦 Deployment (Vercel Free)

1. Push to a **GitHub Free** repo.
2. Import the repo into **Vercel** (framework preset auto-detected as *Vite*; `/api` becomes serverless functions).
3. Add the environment variables from `.env.example` in the Vercel dashboard.
4. Deploy. No credit card required.

---

## 📁 Project Structure

```
.kiro/specs/         # requirements.md · design.md · tasks.md (Kiro spec-driven)
src/
  app/               # App shell, router, theme, error boundary
  components/ui/      # Design-system primitives
  features/           # Feature modules (landing, dashboard, advisor, …)
  lib/                # api client, supabase client, validation, utils
api/                  # Vercel serverless functions (added in later phases)
supabase/migrations/  # SQL migrations (added in Phase 3)
```

---

## ✨ Features

- **Auth & profiles** — secure sign up/login, session persistence, role-based access, editable profile with up to **7 subjects**.
- **Personalized dashboard** — academic overview, AI recommendations, career snapshot, quick actions.
- **Multi-agent AI Advisor** — Academic, Career, Coding Mentor, and CV agents with smart intent routing and safety rules. Free-tier provider + **Mock fallback**.
- **Jobs & internships** — filters + **explainable AI match score** (deterministic).
- **AI CV Builder** — ATS-friendly template, live preview, AI review, browser print-to-PDF.
- **GPA / CGPA calculator** — accurate HEC 4.0 math with transparent breakdown.
- **Coding notes** — read-only study notes by technology.
- **University community** — posts, likes, comments, reports, moderation.
- **Feedback** — private university feedback, platform feedback, feature requests.
- **University rankings** — verified data with cited source + year.
- **Admin dashboard** — analytics, student/university/job/ranking management, community moderation, feedback & feature-request review.

## 🔑 Demo credentials (after `npm run seed`)

- **Student:** `demo.student@campus-advisor.dev` / `DemoPass123`
- **Admin:** any email in `ADMIN_EMAILS` / `AdminPass123`

See [`DEMO.md`](DEMO.md) for the guided demo flow and [`DEPLOYMENT.md`](DEPLOYMENT.md) for setup.

## 🗺️ Status

Implemented phase-by-phase per [`.kiro/specs/tasks.md`](.kiro/specs/tasks.md).
**All MVP phases (1–16) complete.**

> **Note:** This build environment has no outbound network access, so
> `npm install`, Supabase provisioning, live AI calls, and Vercel deploy run in
> **your** environment. The codebase is written install- and deploy-ready.
