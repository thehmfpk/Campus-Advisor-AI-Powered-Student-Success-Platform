# Supabase Setup — one-time steps

The app **works out of the box** with bundled demo data (notes, jobs, rankings,
societies, community samples, and the AI chatbot all function with no setup).
Do the steps below to enable **accounts, saving data, admin, and media uploads**.

Everything here is on the **Supabase Free** tier — no credit card.

---

## 1. Run the database migrations (SQL Editor)

Supabase Dashboard → **SQL Editor** → run these files from the repo **in order**:

1. `supabase/migrations/0001_schema.sql`  — all tables
2. `supabase/migrations/0002_rls.sql`     — security policies
3. `supabase/migrations/0003_societies.sql` — societies & clubs

Each should end with **"Success. No rows returned."**
(If you ran 0001–0002 before, just run 0003.)

## 2. Enable email sign-in

Authentication → **Sign In / Providers** → **Email**: keep it enabled and turn
**OFF** "Confirm email" (so sign-up works instantly for the demo).

## 3. Create Storage buckets (for profile photos & post media)

Storage → **New bucket** → create **two public buckets**:

| Bucket name  | Public | Used for |
|--------------|--------|----------|
| `avatars`    | Yes    | Profile photos |
| `post-media` | Yes    | (optional) uploaded post images/videos |

> If you skip these, the app still works — profile photo falls back to a
> pasted image URL, and community posts accept image/video **URLs** directly.

## 4. Admin access (thehmfpk@gmail.com)

No manual step needed. Just **sign up / sign in with `thehmfpk@gmail.com`** —
the app automatically grants that account the **admin** role (and records it in
the database so admin data policies apply). Then:

- A discreet **"Admin"** link appears in the landing-page footer.
- Admins see an **Admin** item in the sidebar → `/admin`.
- Admin can view analytics (with charts), students, delete/hide posts, review
  reports, read feedback, manage jobs/universities/rankings, and update feature
  requests.

To add more admins later, edit `src/lib/adminConfig.ts` (`ADMIN_EMAILS`) and redeploy.

## 5. (Optional) Seed richer demo data into the database

Locally, with your `.env` filled in (see `.env.example`):

```bash
npm install
npm run seed
```

This inserts universities, jobs, notes, rankings, societies, a demo student,
and promotes any `ADMIN_EMAILS` to admin. Not required — the app shows bundled
data without it.

---

## Environment variables (Vercel → Project → Settings → Environment Variables)

```
VITE_SUPABASE_URL          = https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY     = <anon public key>
SUPABASE_SERVICE_ROLE_KEY  = <service_role secret key>   # server only
AI_MODE                    = mock                        # chatbot works free
ADMIN_EMAILS               = thehmfpk@gmail.com
```

Leave `AI_API_KEY`, `AI_BASE_URL`, `AI_MODEL` empty unless you add a free-tier
AI provider (e.g. Groq). The chatbot works fully in the browser regardless.

---

## Push → Live flow

Push to `main` on GitHub → **Vercel auto-rebuilds and redeploys**. The steps
above (Supabase migrations/buckets) are one-time and done in the Supabase
dashboard — they are not part of the auto-deploy.
