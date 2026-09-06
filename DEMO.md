# Campus Advisor — Hackathon Demo Script (2–4 min)

**One-liner:** Campus Advisor doesn't just store student information — it
understands the student and helps them make better academic and career
decisions. Built spec-driven with Kiro, 100% free-tier.

**Demo login:** `demo.student@campus-advisor.dev` / `DemoPass123`
(Admin: an email you set in `ADMIN_EMAILS` / `AdminPass123`.)
Run in `AI_MODE=mock` for a guaranteed, zero-cost, offline-safe demo.

## Flow
1. **Landing page** — open `/`. Highlight the hero, features, and "free-tier / no credit card".
2. **Login** as the demo student → land on the personalized **Dashboard**
   (time-aware greeting, academic stats, AI recommendations, quick actions).
3. **Profile** — show the profile, skills, interests, and the **max-7 subjects** manager.
4. **AI Advisor** → ask the **Academic Advisor**:
   *"I have exams in two weeks and I am weak in Data Structures."* → study plan.
5. Switch to **Career Advisor**: *"I want to become a data scientist."* → roadmap.
   Point out the **agent badge** and the "recommendation, not verified fact" note.
6. **Jobs** — show an opportunity with **AI Match: NN%** and the explanation
   (deterministic, explainable — the number is never AI-invented).
7. **CV Builder** — edit a bullet, click **Review my CV** (AI suggestions), then
   **Download PDF** (browser print — ATS-friendly template).
8. **GPA / CGPA** — compute a CGPA and show the transparent breakdown.
9. **Community** — show the cross-university feed; create a post (moderation guard).
10. **Rankings** — show a ranking with its **source + year** clearly cited.
11. **Admin** → open `/admin`: **Analytics** counts, **Moderation** (hide/remove a
    reported post), **Feature Requests** status change, university management.

## Talking points for judges
- **Strong AI:** four specialized agents + smart intent routing + safety rules.
- **Reliable:** Mock AI fallback → the demo never breaks, even offline / rate-limited.
- **Explainable:** job match scoring is deterministic and transparent.
- **Responsible:** no fabricated rankings/jobs; private feedback stays private (RLS).
- **Free-tier-first:** Vercel + Supabase free, no credit card, no paid APIs.
- **Spec-driven:** see `.kiro/specs/{requirements,design,tasks}.md`.
