# Deploying Campus Advisor (100% free tier)

This guide deploys Campus Advisor on **Vercel Free** + **Supabase Free** with **no credit card**.

## 1. Create a Supabase project (free)
1. Go to https://supabase.com → New project (free tier).
2. In **SQL Editor**, run the migrations in order:
   - `supabase/migrations/0001_schema.sql`
   - `supabase/migrations/0002_rls.sql`
3. In **Project Settings → API**, copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
   - `service_role` secret key → `SUPABASE_SERVICE_ROLE_KEY` (server-only!)
4. (Auth) In **Authentication → Providers → Email**, keep email/password enabled.
   For a smooth demo, you may disable "Confirm email".

## 2. Seed demo data (optional but recommended)
Locally, with `.env` filled in:
```bash
npm install
npm run seed
```
This creates universities, coding notes, jobs, rankings, a demo student
(`demo.student@campus-advisor.dev` / `DemoPass123`) and any admins listed in
`ADMIN_EMAILS` (password `AdminPass123`).

## 3. Configure AI (free tier, optional)
- Leave `AI_MODE=mock` (default) for a fully working, zero-cost demo.
- To use a free-tier LLM, set `AI_MODE=free` and provide an OpenAI-compatible
  free endpoint, e.g. **Groq** (free tier, no credit card):
  ```
  AI_MODE=free
  AI_API_KEY=<your groq key>
  AI_BASE_URL=https://api.groq.com/openai/v1
  AI_MODEL=llama-3.1-8b-instant
  ```
  If the free tier errors or is rate-limited, the app automatically falls back
  to the Mock provider — it never incurs cost.

## 4. Deploy to Vercel (free)
1. Push this repo to **GitHub (free)**.
2. In Vercel → **Add New Project** → import the repo. Framework preset:
   **Vite** (auto-detected). `/api` becomes serverless functions automatically.
3. Add Environment Variables (from `.env.example`):
   - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `AI_MODE` (and AI vars if using a free provider)
   - `ADMIN_EMAILS`
4. Deploy. No credit card required.

## 5. Create the first admin
Admins are never created via signup. Either:
- add the admin email to `ADMIN_EMAILS` and run `npm run seed`, **or**
- in Supabase, set `users.role = 'admin'` for the desired user id.

## Cost guarantees
- All services above are free tier.
- Mock AI + seeded data mean the full demo runs at zero cost even without keys.
- No feature makes unbounded external calls.
