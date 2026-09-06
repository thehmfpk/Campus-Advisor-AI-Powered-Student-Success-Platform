/**
 * Built-in knowledge base for the role-based, knowledge-based advisor.
 *
 * This powers the MockAIProvider so the AI advisor gives genuinely useful,
 * detailed answers with NO API key and ZERO cost (R21). Each entry is matched
 * against the user's message with keyword scoring; the best entry (within the
 * active agent role) is returned. If nothing matches well, we fall back to a
 * helpful role-specific default.
 *
 * All content here is original study/guidance material.
 */

export type Role = 'academic' | 'career' | 'coding' | 'cv' | 'generic';

export interface KbEntry {
  role: Role;
  /** Keywords/patterns that indicate this entry is relevant. */
  keywords: string[];
  /** The answer (markdown supported by the chat renderer). */
  answer: string;
}

export const KNOWLEDGE_BASE: KbEntry[] = [
  // ── ACADEMIC ──────────────────────────────────────────────────────
  {
    role: 'academic',
    keywords: ['exam', 'test', 'midterm', 'final', 'prepare', 'revision', 'weak'],
    answer: `Here's a proven exam-prep plan:

1. **Audit & prioritize** — list every topic and rate your confidence 1–5. Spend ~60% of time on the lowest-rated ones.
2. **Active recall** — after reading, close the book and write everything you remember. Testing yourself beats re-reading.
3. **Spaced repetition** — review a topic after 1 day, 3 days, then 7 days so it sticks.
4. **Past papers** — attempt at least one per subject under timed, no-notes conditions. Mark it honestly.
5. **Daily blocks** — two focused 90-minute sessions (Pomodoro: 25 on / 5 off), one hard subject per session.
6. **The day before** — light review only, sleep 7–8 hours. Cramming hurts recall.

Tell me your exact subjects and exam dates and I'll turn this into a day-by-day schedule.`,
  },
  {
    role: 'academic',
    keywords: ['study plan', 'schedule', 'time management', 'time table', 'timetable', 'manage time', 'procrastinate'],
    answer: `A study schedule that actually works:

- **Fixed anchors first** — put classes, work, prayers/meals, and sleep on the calendar. Study fills the gaps.
- **Time-block by energy** — hard subjects when you're freshest (usually morning); revision/light reading when tired.
- **2–4 deep-work blocks/day** of 60–90 min with real breaks (walk, water — not the phone).
- **Weekly review (Sunday)** — plan the week, then adjust daily.
- **Beat procrastination** with the 2-minute rule: just start for 2 minutes; momentum does the rest.

Share your weekly commitments and I'll draft a realistic timetable.`,
  },
  {
    role: 'academic',
    keywords: ['assignment', 'project', 'report', 'submission', 'deadline', 'homework'],
    answer: `To handle assignments without last-minute stress:

1. **Break it down** — split into research → outline → draft → polish, each with its own mini-deadline.
2. **Start with the outline**, not the intro. Structure first makes writing 3x faster.
3. **Cite as you go** — keep a running list of sources so you don't scramble later.
4. **Draft ugly, edit smart** — get a rough version done, then improve it.
5. **Buffer** — aim to finish 1 day early for review.

⚠️ Always confirm the exact deadline and requirements with your instructor or LMS — I can't verify those.`,
  },
  {
    role: 'academic',
    keywords: ['semester', 'course', 'credit', 'gpa', 'cgpa', 'improve grade', 'grades'],
    answer: `To plan a strong semester and lift your GPA:

- **Balance the load** — mix heavy (high-credit / hard) courses with lighter ones each semester.
- **Front-load effort** — the first 3 weeks set your grade trajectory; don't fall behind early.
- **Target the highest-weight assessments** — know what % each quiz/midterm/final is worth and prioritize accordingly.
- **Track your GPA** — use the GPA/CGPA calculator here to model "what grade do I need?" scenarios.
- **Office hours** — a 10-minute chat with a teacher often unlocks a topic faster than an hour alone.

Want me to suggest a subject priority order? Share your current subjects and grades.`,
  },

  // ── CAREER ────────────────────────────────────────────────────────
  {
    role: 'career',
    keywords: ['data scientist', 'data science', 'machine learning', 'ml', 'ai engineer'],
    answer: `Roadmap to becoming a **Data Scientist / ML Engineer**:

1. **Foundations** — Python, statistics & probability, linear algebra basics.
2. **Data tools** — pandas, NumPy, SQL (querying is a daily skill).
3. **ML core** — scikit-learn: regression, classification, clustering, model evaluation.
4. **Deep learning (later)** — PyTorch or TensorFlow once ML basics are solid.
5. **Projects (most important)** — 3 end-to-end projects: clean data → model → evaluate → explain results. Put them on GitHub with clear READMEs.
6. **Show it** — a short blog/notebook per project + these on your CV.

Start applying for **data/ML internships** after projects 1–2. Check the Jobs section for matches.`,
  },
  {
    role: 'career',
    keywords: ['frontend', 'front-end', 'web developer', 'react developer', 'ui developer'],
    answer: `Roadmap to becoming a **Frontend Developer**:

1. **HTML + CSS** — semantic markup, flexbox, grid, responsive design.
2. **JavaScript** — DOM, ES6+, async/await, fetch. This is the core — go deep.
3. **React** — components, hooks, state, routing. Build real UIs.
4. **Tooling** — Git, npm, Vite, and basic testing.
5. **Projects** — a portfolio site, a dashboard, and an app that calls a real API. Deploy them (Vercel is free).
6. **Polish** — accessibility, performance, and clean, readable code stand out to recruiters.

Then target **frontend internships**. Your CV should show React + JS projects up top.`,
  },
  {
    role: 'career',
    keywords: ['backend', 'back-end', 'server', 'api developer', 'node developer'],
    answer: `Roadmap to becoming a **Backend Developer**:

1. **A language** — Node.js/Express, Python/Django, or Java/Spring. Pick one and go deep.
2. **Databases** — SQL fundamentals + one database (Postgres is great and free).
3. **APIs** — REST design, auth (JWT/sessions), validation, error handling.
4. **Fundamentals** — HTTP, status codes, caching, and basic security (OWASP top 10).
5. **Projects** — build & deploy a real API (auth + CRUD + a database). Document the endpoints.
6. **Bonus** — Docker basics and one cloud free tier.

Aim for **backend/full-stack internships** once you've shipped one real API.`,
  },
  {
    role: 'career',
    keywords: ['interview', 'hr round', 'technical interview', 'prepare for interview'],
    answer: `How to prepare for tech interviews:

**Technical**
- Practice **data structures & algorithms** (arrays, hashmaps, two pointers, recursion, trees). Do a few problems daily.
- Be able to explain your projects deeply: what, why, trade-offs, what you'd improve.

**Behavioral (STAR method)** — Situation, Task, Action, Result. Prepare 4–5 stories (a challenge, a conflict, a success, a failure/lesson).

**Logistics**
- Research the company and role.
- Prepare 2–3 thoughtful questions to ask them.
- Do a mock interview out loud — it exposes gaps fast.

Want practice questions for a specific role? Just tell me which one.`,
  },
  {
    role: 'career',
    keywords: ['skill', 'what should i learn', 'roadmap', 'career', 'which field', 'job'],
    answer: `Let's build your career plan:

1. **Pick a direction** — frontend, backend, data/ML, mobile, cybersecurity, or product. (Tell me your interests and I'll suggest one.)
2. **Learn the core 3–4 skills** for that path (ask me for the exact list).
3. **Build proof** — 2–3 portfolio projects that use those skills, on GitHub.
4. **Package it** — a clean CV (use the CV Builder here) + a strong GitHub + LinkedIn.
5. **Apply** — target internships that match your semester and skills (see the Jobs section for AI matches).

What field are you leaning toward? I'll tailor the roadmap and skill list.`,
  },

  // ── CODING ────────────────────────────────────────────────────────
  {
    role: 'coding',
    keywords: ['recursion', 'recursive', 'base case'],
    answer: `**Recursion** = a function that solves a problem by calling itself on a smaller input until a **base case** stops it.

Two parts every recursion needs:
1. **Base case** — when to stop.
2. **Recursive case** — reduce the problem toward the base case.

\`\`\`javascript
function factorial(n) {
  if (n <= 1) return 1;        // base case
  return n * factorial(n - 1);  // recursive case
}
factorial(5); // 120
\`\`\`

**Mental model:** trust that the recursive call "just works" for the smaller input, then combine. Common examples: factorial, Fibonacci, tree traversal, and divide-and-conquer (merge sort).

Want a practice problem or the Fibonacci example next?`,
  },
  {
    role: 'coding',
    keywords: ['array', 'list', 'loop', 'iterate', 'map filter reduce'],
    answer: `**Arrays** store ordered items with index access (O(1) to read by index).

\`\`\`javascript
const nums = [1, 2, 3, 4];
const doubled = nums.map(n => n * 2);        // [2,4,6,8]
const evens   = nums.filter(n => n % 2 === 0); // [2,4]
const sum     = nums.reduce((a, b) => a + b, 0); // 10
\`\`\`

- **map** → transform each item (same length).
- **filter** → keep items that pass a test.
- **reduce** → collapse to a single value.

For interviews, master the **two-pointer** and **sliding-window** patterns on arrays.`,
  },
  {
    role: 'coding',
    keywords: ['async', 'promise', 'await', 'callback', 'fetch'],
    answer: `**Async JavaScript** lets you do work without freezing the program.

\`\`\`javascript
async function loadUser() {
  try {
    const res = await fetch('/api/user');
    if (!res.ok) throw new Error('Request failed');
    return await res.json();
  } catch (err) {
    console.error(err);
  }
}
\`\`\`

- A **Promise** represents a future value (pending → fulfilled/rejected).
- **await** pauses inside an \`async\` function until the promise settles.
- Always handle errors with **try/catch** (or \`.catch()\`).`,
  },
  {
    role: 'coding',
    keywords: ['sql', 'query', 'join', 'database', 'select'],
    answer: `**SQL** basics:

\`\`\`sql
SELECT u.name, COUNT(p.id) AS posts
FROM users u
LEFT JOIN posts p ON p.user_id = u.id
WHERE u.active = true
GROUP BY u.name
ORDER BY posts DESC;
\`\`\`

- **JOIN** combines rows across tables on a key.
- **WHERE** filters rows *before* grouping; **HAVING** filters *after*.
- **Index** the columns you filter/join on to speed reads.
- Use **transactions** for multi-step writes so they all succeed or all fail.`,
  },
  {
    role: 'coding',
    keywords: ['git', 'commit', 'branch', 'merge', 'pull request', 'github'],
    answer: `**Git** essentials:

\`\`\`bash
git checkout -b feature/login   # new branch
git add .
git commit -m "Add login form"
git push origin feature/login   # then open a Pull Request
\`\`\`

- A **commit** is a snapshot; write clear messages.
- **Branches** isolate work; merge via Pull Requests.
- **Pull before you push** to avoid conflicts.
- Undo safely: \`git revert <commit>\` (keeps history) rather than force-resetting shared branches.`,
  },
  {
    role: 'coding',
    keywords: ['react', 'hook', 'usestate', 'useeffect', 'component', 'jsx'],
    answer: `**React** in a nutshell — UI is a function of state.

\`\`\`jsx
function Counter() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]); // runs when count changes
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
\`\`\`

- **useState** holds local state; updating it re-renders.
- **useEffect** runs side effects after render; the dependency array controls when.
- Keep components small; pass data down via **props**.`,
  },

  // ── CV ────────────────────────────────────────────────────────────
  {
    role: 'cv',
    keywords: ['cv', 'resume', 'improve', 'review', 'bullet', 'wording', 'weak'],
    answer: `How to strengthen your CV:

- **Impact bullets** — start with a strong verb + quantify: *"Built a React dashboard, cutting load time 40%."*
- **Tailor to the role** — mirror the job's key skills near the top.
- **Cut fluff** — remove "hardworking team player"; *show* it with results.
- **One page**, reverse-chronological, consistent formatting.
- **ATS-friendly** — single column, standard headings (Experience, Projects, Education, Skills), no images/tables/columns.
- **Links** — GitHub + LinkedIn + portfolio.

Paste one of your bullet points and I'll rewrite it for stronger impact.`,
  },
  {
    role: 'cv',
    keywords: ['ats', 'applicant tracking', 'keywords', 'pass ats'],
    answer: `To pass **ATS** (Applicant Tracking Systems):

- **Simple layout** — single column, no text boxes, tables, headers/footers, or images.
- **Standard section headings** — "Experience", "Education", "Skills", "Projects".
- **Match keywords** — use the exact skill terms from the job description (e.g. "React", "REST APIs").
- **Standard fonts** and a **.pdf** export (the CV Builder here prints a clean, ATS-safe PDF).
- **No fancy graphics** — they confuse parsers and can drop your CV.

Use the CV Builder's template — it's already ATS-friendly.`,
  },
];

const DEFAULTS: Record<Role, string> = {
  academic: `I'm your **Academic Advisor**. I can help with study plans, exam prep, time management, assignments, and semester planning. For example: "Plan my exam prep for Data Structures and Databases" or "Build me a weekly study timetable." What would you like help with?`,
  career: `I'm your **Career Advisor**. I can help you pick a direction, build a skills roadmap, and prepare for internships/interviews. Try: "I want to become a frontend developer — what should I learn?" or "How do I prepare for a technical interview?"`,
  coding: `I'm your **Coding Mentor**. Ask me to explain any programming concept with examples — e.g. "Explain recursion", "How do async/await work?", or "How do JOINs work in SQL?"`,
  cv: `I'm your **CV Advisor**. Paste your CV details or a bullet point and I'll suggest stronger wording, flag weaknesses, and list missing skills for your target role. You can also ask "How do I make my CV ATS-friendly?"`,
  generic: `I'm your Campus Advisor. I can help with academics, careers, coding, and your CV. Ask me something specific to get started.`,
};

const DISCLAIMER =
  '\n\n_This is AI guidance (a recommendation, not verified fact). Verify university-specific details — deadlines, official rankings, policies — with your institution._';

/** Score how well an entry matches the message (count of keyword hits). */
function scoreEntry(entry: KbEntry, msg: string): number {
  const m = msg.toLowerCase();
  let score = 0;
  for (const kw of entry.keywords) {
    if (m.includes(kw)) score += kw.includes(' ') ? 2 : 1; // multi-word phrases weigh more
  }
  return score;
}

/**
 * Return the best knowledge-base answer for a role + message. Falls back to a
 * helpful role default when nothing matches.
 */
export function answerFromKnowledge(role: Role, message: string): string {
  const candidates = KNOWLEDGE_BASE.filter((e) => e.role === role);
  let best: KbEntry | null = null;
  let bestScore = 0;
  for (const e of candidates) {
    const s = scoreEntry(e, message);
    if (s > bestScore) {
      best = e;
      bestScore = s;
    }
  }
  const body = best && bestScore > 0 ? best.answer : DEFAULTS[role] ?? DEFAULTS.generic;
  return body + DISCLAIMER;
}
