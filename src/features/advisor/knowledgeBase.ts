import type { ResolvableAgent } from '@/lib/intentRouter';

/**
 * Client-side knowledge base (50+ entries) that powers the AI Advisor entirely
 * in the browser — no API key, no server, no database required. Each entry is
 * matched against the user's message with keyword scoring within the active
 * agent role. This guarantees the chatbot works on any deployment.
 *
 * All content is original guidance/study material written for students.
 */

export interface KbEntry {
  role: ResolvableAgent;
  keywords: string[];
  answer: string;
}

export const KB: KbEntry[] = [
  // ─────────────── ACADEMIC (advisor) ───────────────
  {
    role: 'academic',
    keywords: ['exam', 'test', 'midterm', 'final', 'weak', 'two weeks', 'prepare'],
    answer:
      'Here is a focused exam-prep plan:\n\n1. **Rate every topic** 1-5 by confidence and spend ~60% of time on the weakest.\n2. **Active recall** — after reading, close the book and write what you remember.\n3. **Spaced repetition** — review after 1 day, 3 days, then 7 days.\n4. **Past papers** — one per subject under timed, no-notes conditions.\n5. **Two 90-minute deep sessions/day** (25 on / 5 off).\n6. **Sleep 7-8 hours** the night before — cramming hurts recall.\n\nTell me your subjects and exam dates and I will turn this into a day-by-day schedule.',
  },
  {
    role: 'academic',
    keywords: ['study plan', 'schedule', 'timetable', 'time table', 'manage time', 'time management'],
    answer:
      'A study schedule that works:\n\n- **Fix anchors first** — classes, meals, sleep. Study fills the gaps.\n- **Hard subjects when fresh** (usually morning); light revision when tired.\n- **2-4 deep blocks/day** of 60-90 minutes with real breaks.\n- **Weekly review** every Sunday, then adjust daily.\n- Share your weekly commitments and I will draft a realistic timetable.',
  },
  {
    role: 'academic',
    keywords: ['procrastinate', 'procrastination', 'lazy', 'motivation', 'focus', 'distracted'],
    answer:
      'To beat procrastination:\n\n- Use the **2-minute rule**: commit to just 2 minutes; momentum does the rest.\n- **Remove friction** — phone in another room, site blockers on.\n- **Break big tasks** into tiny next actions ("open the doc", "write one line").\n- **Body doubling** — study with a friend or in a library.\n- Reward yourself after each focused block.',
  },
  {
    role: 'academic',
    keywords: ['assignment', 'homework', 'report', 'submission', 'project deadline'],
    answer:
      'To handle assignments without last-minute stress:\n\n1. Split into research -> outline -> draft -> polish, each with a mini-deadline.\n2. Start with the **outline**, not the intro.\n3. **Cite as you go** so you do not scramble later.\n4. Draft rough, then edit.\n5. Aim to finish 1 day early.\n\nAlways confirm the exact deadline and requirements with your instructor or LMS.',
  },
  {
    role: 'academic',
    keywords: ['data structures', 'algorithms', 'dsa', 'ds'],
    answer:
      'To master Data Structures & Algorithms for exams:\n\n- Learn each structure with its **Big-O**: arrays, linked lists, stacks, queues, hash maps, trees, graphs.\n- Practice **patterns**: two pointers, sliding window, recursion, BFS/DFS, binary search.\n- Do a few problems daily; explain your approach out loud.\n- For exams, be able to trace algorithms on paper and state complexity.',
  },
  {
    role: 'academic',
    keywords: ['database', 'dbms', 'sql exam', 'normalization', 'er diagram'],
    answer:
      'Database Systems exam focus:\n\n- **ER diagrams** -> relational schema mapping.\n- **Normalization**: 1NF, 2NF, 3NF, BCNF — know why each removes redundancy.\n- **SQL**: JOINs, GROUP BY vs HAVING, subqueries, aggregate functions.\n- **Transactions & ACID**, and basic indexing.\n- Practice writing queries by hand — most marks come from that.',
  },
  {
    role: 'academic',
    keywords: ['operating system', 'os', 'process', 'thread', 'deadlock', 'scheduling'],
    answer:
      'Operating Systems key topics: processes vs threads, CPU scheduling (FCFS, SJF, Round Robin), synchronization (mutex, semaphores), deadlocks (conditions + prevention), and memory management (paging, virtual memory). Draw diagrams and work through scheduling examples numerically.',
  },
  {
    role: 'academic',
    keywords: ['gpa', 'cgpa', 'grade', 'improve gpa', 'raise gpa'],
    answer:
      'To lift your GPA:\n\n- **Front-load effort** — the first 3 weeks set your trajectory.\n- Prioritize the **highest-weight assessments** (know each item\u2019s %).\n- Use the GPA/CGPA calculator here to model "what grade do I need?".\n- Attend office hours — a 10-minute chat often beats an hour alone.',
  },
  {
    role: 'academic',
    keywords: ['semester', 'course selection', 'credit hours', 'plan semester', 'workload'],
    answer:
      'Plan a balanced semester: mix heavy/hard courses with lighter ones, keep total credit hours realistic, and avoid stacking all difficult subjects together. Track deadlines in one place and review your plan weekly.',
  },
  {
    role: 'academic',
    keywords: ['note taking', 'notes', 'memorize', 'remember', 'retain'],
    answer:
      'Better notes & retention: use the **Cornell method** (cues | notes | summary), rewrite key ideas in your own words, and turn notes into questions for active recall. Teach the concept to someone else — if you can explain it simply, you understand it.',
  },
  {
    role: 'academic',
    keywords: ['group study', 'study group', 'peers'],
    answer:
      'Effective group study: keep groups small (3-4), set an agenda, and have each person teach a topic. Use groups for discussion and problem-solving, but do the initial learning solo so the session stays productive.',
  },
  {
    role: 'academic',
    keywords: ['stress', 'anxiety', 'burnout', 'overwhelmed', 'pressure'],
    answer:
      'Managing academic stress: break work into small wins, keep a consistent sleep schedule, take short movement breaks, and talk to someone you trust. If stress feels overwhelming, reach out to your university counselling service. Progress over perfection.',
  },

  // ─────────────── CAREER ───────────────
  {
    role: 'career',
    keywords: ['data scientist', 'data science', 'machine learning', 'ml engineer'],
    answer:
      'Roadmap to **Data Scientist / ML Engineer**:\n\n1. Python + statistics + linear algebra basics.\n2. pandas, NumPy, SQL.\n3. scikit-learn (regression, classification, clustering, evaluation).\n4. Deep learning later (PyTorch/TensorFlow).\n5. **3 end-to-end projects** on GitHub with clear READMEs.\n\nApply for data/ML internships after projects 1-2.',
  },
  {
    role: 'career',
    keywords: ['frontend', 'front-end', 'react developer', 'ui developer', 'web developer'],
    answer:
      'Roadmap to **Frontend Developer**:\n\n1. HTML + CSS (flexbox, grid, responsive).\n2. JavaScript deeply (DOM, ES6+, async, fetch).\n3. React (components, hooks, state, routing).\n4. Git, npm, Vite, testing.\n5. Deploy 2-3 projects (Vercel is free).\n\nThen target frontend internships with React projects at the top of your CV.',
  },
  {
    role: 'career',
    keywords: ['backend', 'back-end', 'server', 'api developer', 'node developer'],
    answer:
      'Roadmap to **Backend Developer**:\n\n1. One language (Node/Express, Python/Django, or Java/Spring).\n2. SQL + one database (Postgres).\n3. REST API design, auth (JWT), validation, error handling.\n4. HTTP, caching, OWASP security basics.\n5. Build & deploy one real API (auth + CRUD + DB).',
  },
  {
    role: 'career',
    keywords: ['full stack', 'fullstack', 'full-stack'],
    answer:
      'Full-Stack path: get comfortable with frontend (React) AND backend (Node + a database), then build one app that does it all — auth, a database, and a clean UI. Deploy it. Employers love a single project that proves you can ship end-to-end.',
  },
  {
    role: 'career',
    keywords: ['mobile', 'android', 'ios', 'flutter', 'react native', 'app developer'],
    answer:
      'Mobile developer path: pick **Flutter (Dart)** or **React Native (JS)** for cross-platform, or Kotlin (Android) / Swift (iOS) for native. Build 2-3 apps (a to-do, an API-driven app, one with local storage) and publish or demo them.',
  },
  {
    role: 'career',
    keywords: ['cyber security', 'cybersecurity', 'security', 'ethical hacking', 'pentest'],
    answer:
      'Cybersecurity path: learn networking + Linux fundamentals, then the OWASP Top 10, basic cryptography, and hands-on labs (TryHackMe/HackTheBox). Consider certifications like CompTIA Security+ later. Ethics and legality first — always get permission.',
  },
  {
    role: 'career',
    keywords: ['cloud', 'aws', 'azure', 'devops', 'docker', 'kubernetes'],
    answer:
      'Cloud/DevOps path: Linux + networking basics, one cloud (AWS free tier), Docker, CI/CD pipelines, and infrastructure-as-code. A free AWS/Azure fundamentals certification is a strong resume booster for students.',
  },
  {
    role: 'career',
    keywords: ['interview', 'technical interview', 'hr round', 'behavioral'],
    answer:
      'Interview prep:\n\n**Technical** — daily DSA practice; explain your projects deeply (what/why/trade-offs).\n**Behavioral (STAR)** — prepare 4-5 stories (challenge, conflict, success, failure/lesson).\n**Logistics** — research the company, prepare 2-3 questions, do a mock out loud.',
  },
  {
    role: 'career',
    keywords: ['internship', 'find internship', 'apply internship', 'summer'],
    answer:
      'Landing an internship: build 2 solid projects, put them on GitHub + your CV, then apply widely and early. Use the Jobs section here for AI-matched roles, and check LinkedIn/company career pages. Personalize each application to the role.',
  },
  {
    role: 'career',
    keywords: ['linkedin', 'network', 'networking', 'connections'],
    answer:
      'LinkedIn tips: a clear headline (role + skills), a short summary, your projects and skills listed, and a professional photo. Connect with alumni and recruiters with a short personal note. Post about what you build — visibility helps.',
  },
  {
    role: 'career',
    keywords: ['freelance', 'freelancing', 'fiverr', 'upwork', 'earn'],
    answer:
      'Freelancing as a student: start with a narrow skill (e.g. landing pages in React), build 2-3 portfolio samples, then create profiles on Upwork/Fiverr. Deliver small jobs well to earn reviews — early reputation matters most.',
  },
  {
    role: 'career',
    keywords: ['portfolio', 'github profile', 'projects to build', 'project ideas'],
    answer:
      'Strong student portfolio: 3 projects that each show a different skill (a UI-heavy app, an API/backend, and one with data or auth). Clean READMEs with screenshots, live demo links, and clear "what I learned". Quality over quantity.',
  },
  {
    role: 'career',
    keywords: ['skill', 'what should i learn', 'roadmap', 'career path', 'which field'],
    answer:
      'Let us build your plan: pick a direction (frontend, backend, data/ML, mobile, cloud, or security), learn its core 3-4 skills, build 2-3 projects, package a CV + GitHub, then apply. Tell me your interests and I will tailor the exact skill list.',
  },
  {
    role: 'career',
    keywords: ['salary', 'pay', 'expected salary', 'negotiate'],
    answer:
      'For salary: research typical ranges for the role and city (levels.fyi, Glassdoor, local groups). As a student/fresher, prioritize learning and mentorship over pay for the first role. When negotiating, give a researched range, not a single number.',
  },

  // ─────────────── CODING (mentor) ───────────────
  {
    role: 'coding',
    keywords: ['recursion', 'recursive', 'base case'],
    answer:
      '**Recursion** = a function that calls itself on a smaller input until a base case stops it.\n\n```javascript\nfunction factorial(n) {\n  if (n <= 1) return 1;        // base case\n  return n * factorial(n - 1); // recursive case\n}\n```\n\nAlways define the base case first, then ensure each call moves toward it.',
  },
  {
    role: 'coding',
    keywords: ['array', 'map', 'filter', 'reduce', 'list'],
    answer:
      '**Arrays** in JS:\n\n```javascript\nconst nums = [1, 2, 3, 4];\nconst doubled = nums.map(n => n * 2);          // transform\nconst evens   = nums.filter(n => n % 2 === 0);  // keep\nconst sum     = nums.reduce((a, b) => a + b, 0); // collapse\n```\n\nmap = transform, filter = keep, reduce = combine into one value.',
  },
  {
    role: 'coding',
    keywords: ['async', 'await', 'promise', 'callback', 'fetch'],
    answer:
      '**Async/await**:\n\n```javascript\nasync function load() {\n  try {\n    const res = await fetch("/api/data");\n    if (!res.ok) throw new Error("Failed");\n    return await res.json();\n  } catch (e) { console.error(e); }\n}\n```\n\nA Promise is a future value; await pauses until it settles. Always handle errors.',
  },
  {
    role: 'coding',
    keywords: ['closure', 'scope', 'lexical'],
    answer:
      'A **closure** is a function that remembers variables from where it was defined, even after that scope has returned.\n\n```javascript\nfunction counter() {\n  let count = 0;\n  return () => ++count; // remembers `count`\n}\nconst next = counter();\nnext(); // 1\nnext(); // 2\n```',
  },
  {
    role: 'coding',
    keywords: ['sql', 'join', 'query', 'select', 'group by'],
    answer:
      '**SQL JOIN + aggregate**:\n\n```sql\nSELECT u.name, COUNT(p.id) AS posts\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nGROUP BY u.name\nORDER BY posts DESC;\n```\n\nWHERE filters rows before grouping; HAVING filters after. Index join/filter columns.',
  },
  {
    role: 'coding',
    keywords: ['git', 'commit', 'branch', 'merge', 'pull request', 'github'],
    answer:
      '**Git basics**:\n\n```bash\ngit checkout -b feature/login\ngit add .\ngit commit -m "Add login form"\ngit push origin feature/login\n```\n\nCommit small & often, use branches, pull before you push, and open Pull Requests for review.',
  },
  {
    role: 'coding',
    keywords: ['react', 'usestate', 'useeffect', 'hook', 'component', 'jsx'],
    answer:
      '**React** — UI is a function of state.\n\n```jsx\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => { document.title = `Count: ${count}`; }, [count]);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}\n```\n\nuseState holds state; useEffect runs side effects; the dependency array controls when.',
  },
  {
    role: 'coding',
    keywords: ['python', 'list comprehension', 'dictionary', 'dict'],
    answer:
      '**Python** essentials:\n\n```python\nsquares = [x*x for x in range(5)]      # comprehension\nuser = {"name": "Ada", "age": 30}        # dict\nfor k, v in user.items():\n    print(k, v)\n```\n\nLists are mutable, tuples immutable, dicts are key-value maps, sets hold unique items.',
  },
  {
    role: 'coding',
    keywords: ['oop', 'class', 'object', 'inheritance', 'polymorphism', 'encapsulation'],
    answer:
      '**OOP** has four pillars:\n- **Encapsulation** — bundle data + methods, hide internals.\n- **Inheritance** — reuse via a base class.\n- **Polymorphism** — same interface, different behavior.\n- **Abstraction** — expose only what matters.\n\nProgram to interfaces, not implementations.',
  },
  {
    role: 'coding',
    keywords: ['pointer', 'memory', 'c++', 'cpp', 'reference'],
    answer:
      '**C++ pointers/memory**: a pointer holds an address. Prefer **smart pointers** (`unique_ptr`, `shared_ptr`) over raw `new`/`delete` to avoid leaks, and follow RAII (acquire in constructor, release in destructor). Pass large objects by `const&`.',
  },
  {
    role: 'coding',
    keywords: ['big o', 'complexity', 'time complexity', 'space complexity'],
    answer:
      '**Big-O** describes how cost grows with input size:\nO(1) < O(log n) < O(n) < O(n log n) < O(n\u00b2) < O(2\u207f). Hash map lookup is average O(1); binary search is O(log n); good sorts are O(n log n). Always state both time and space.',
  },
  {
    role: 'coding',
    keywords: ['binary search', 'sorted', 'search'],
    answer:
      '**Binary search** (sorted array, O(log n)):\n\n```javascript\nfunction search(arr, t) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === t) return mid;\n    arr[mid] < t ? (lo = mid + 1) : (hi = mid - 1);\n  }\n  return -1;\n}\n```',
  },
  {
    role: 'coding',
    keywords: ['linked list', 'node', 'pointer next'],
    answer:
      'A **linked list** is nodes each holding a value + a pointer to the next node. Great for O(1) insert/delete at the ends, but O(n) to access by index (no random access like arrays). Watch for null pointers when traversing.',
  },
  {
    role: 'coding',
    keywords: ['stack', 'queue', 'lifo', 'fifo'],
    answer:
      '**Stack** = LIFO (push/pop from the top) — used for undo, call stacks, DFS. **Queue** = FIFO (enqueue at back, dequeue at front) — used for scheduling and BFS. In JS, an array with push/pop is a stack; push/shift approximates a queue.',
  },
  {
    role: 'coding',
    keywords: ['hash', 'hashmap', 'hash table', 'map', 'dictionary lookup'],
    answer:
      'A **hash map** stores key-value pairs with average O(1) insert/lookup by hashing the key to a bucket. Use it for fast lookups, counting frequencies, and de-duplication. In JS use `Map`; in Python use `dict`.',
  },
  {
    role: 'coding',
    keywords: ['bfs', 'dfs', 'graph', 'traversal', 'tree traversal'],
    answer:
      '**Graph/tree traversal**: BFS explores level-by-level using a **queue**; DFS goes deep using a **stack or recursion**. BFS finds shortest paths in unweighted graphs; DFS is great for exploring all paths, cycle detection, and topological sort.',
  },
  {
    role: 'coding',
    keywords: ['html', 'tag', 'semantic', 'element'],
    answer:
      '**HTML** structures content with semantic tags: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`. Use `<button>` for actions and always add `alt` on images and `<label>` on inputs for accessibility.',
  },
  {
    role: 'coding',
    keywords: ['css', 'flexbox', 'grid', 'center', 'responsive'],
    answer:
      '**CSS layout**: use **Flexbox** for 1D layouts (`display:flex; justify-content; align-items`) and **Grid** for 2D. Center a box with flex: `display:flex; justify-content:center; align-items:center;`. Use media queries for responsiveness.',
  },
  {
    role: 'coding',
    keywords: ['node', 'nodejs', 'express', 'server', 'backend js'],
    answer:
      '**Node.js + Express** server:\n\n```javascript\nimport express from "express";\nconst app = express();\napp.use(express.json());\napp.get("/api/health", (req, res) => res.json({ status: "ok" }));\napp.listen(3000);\n```\n\nNode is great for I/O-bound work; keep secrets in env vars, validate all input.',
  },
  {
    role: 'coding',
    keywords: ['debug', 'error', 'bug', 'not working', 'fix'],
    answer:
      'Debugging approach: **read the error message carefully** (it usually names the file + line), reproduce it reliably, then isolate by commenting out code or adding logs. Check assumptions with `console.log`, and change one thing at a time. Rubber-duck it — explain the code aloud.',
  },
  {
    role: 'coding',
    keywords: ['dynamic programming', 'dp', 'memoization', 'fibonacci'],
    answer:
      '**Dynamic programming** solves problems by storing sub-results to avoid recomputation.\n\n```javascript\nconst memo = {};\nfunction fib(n) {\n  if (n < 2) return n;\n  if (memo[n]) return memo[n];\n  return (memo[n] = fib(n-1) + fib(n-2));\n}\n```\n\nSpot DP when a problem has overlapping subproblems + optimal substructure.',
  },
  {
    role: 'coding',
    keywords: ['api', 'rest', 'endpoint', 'http'],
    answer:
      '**REST APIs** use HTTP verbs: GET (read), POST (create), PUT/PATCH (update), DELETE. Return proper status codes (200 ok, 201 created, 400 bad input, 401 unauthorized, 404 not found, 500 server error) and JSON bodies. Validate input and never trust the client.',
  },

  // ─────────────── CV (advisor) ───────────────
  {
    role: 'cv',
    keywords: ['cv', 'resume', 'improve', 'review', 'better', 'weak'],
    answer:
      'Strengthen your CV:\n\n- **Impact bullets**: verb + result + number ("Built a React dashboard, cutting load time 40%").\n- **Tailor** to the role; mirror its key skills near the top.\n- Cut fluff like "hardworking team player".\n- One page, reverse-chronological, consistent formatting.\n- Add GitHub, LinkedIn, and a portfolio link.',
  },
  {
    role: 'cv',
    keywords: ['ats', 'applicant tracking', 'keywords', 'pass ats', 'rejected'],
    answer:
      'To pass **ATS** systems: single-column layout, standard headings (Experience, Education, Skills, Projects), no images/tables/columns, standard fonts, and export as PDF. Match the exact skill keywords from the job description. The CV Builder here already prints an ATS-safe layout.',
  },
  {
    role: 'cv',
    keywords: ['no experience', 'fresher', 'student cv', 'first job', 'entry'],
    answer:
      'CV with no work experience: lead with **Projects** and **Skills** instead of jobs. Include coursework, a strong summary, hackathons, open-source contributions, and any freelance/volunteer work. Numbers still help ("Built X used by 30 classmates").',
  },
  {
    role: 'cv',
    keywords: ['summary', 'objective', 'about me', 'headline'],
    answer:
      'A great CV summary is 2-3 lines: who you are + your top skills + what you are looking for. Example: "Final-year CS student skilled in React, Node.js, and SQL. Built 3 full-stack projects. Seeking a frontend internship." Keep it specific, not generic.',
  },
  {
    role: 'cv',
    keywords: ['project section', 'projects on cv', 'describe project'],
    answer:
      'Describe each project in 2-3 bullets: what it does, the tech used, and a measurable outcome or what you learned. Add a live link and GitHub. Example: "Campus Advisor — React + Supabase student platform with AI advisor; deployed on Vercel."',
  },
  {
    role: 'cv',
    keywords: ['skills section', 'list skills', 'which skills'],
    answer:
      'Group skills by category: Languages (JS, Python), Frameworks (React, Node), Tools (Git, Docker), and Databases (SQL). List only skills you can defend in an interview, and put the ones matching the target role first.',
  },
  {
    role: 'cv',
    keywords: ['cover letter', 'letter'],
    answer:
      'A cover letter in 3 short paragraphs: (1) the role + why this company, (2) 2-3 relevant achievements that match the job, (3) a confident close asking for a conversation. Tailor it — never send a generic one.',
  },
];

const DEFAULTS: Record<ResolvableAgent, string> = {
  academic:
    'I am your Academic Advisor. Ask me about study plans, exam prep, time management, assignments, or specific subjects like Data Structures, Databases, or Operating Systems. For example: "I have exams in two weeks and I am weak in Data Structures."',
  career:
    'I am your Career Advisor. I can build a roadmap for frontend, backend, full-stack, data science, mobile, cloud, or cybersecurity, and help with internships and interviews. Try: "I want to become a data scientist. What should I learn?"',
  coding:
    'I am your Coding Mentor. Ask me to explain any concept with examples — recursion, arrays, async/await, closures, SQL joins, React hooks, Big-O, binary search, and more. Try: "Explain recursion" or "How do JOINs work in SQL?"',
  cv:
    'I am your CV Advisor. Ask how to improve your CV, make it ATS-friendly, write a summary, describe projects, or build a CV with no experience. Paste a bullet and I will rewrite it for stronger impact.',
};

const DISCLAIMER =
  '\n\n_This is AI guidance (a recommendation, not verified fact). Verify university-specific details — deadlines, official rankings, policies — with your institution._';

function score(entry: KbEntry, msg: string): number {
  const m = msg.toLowerCase();
  let s = 0;
  for (const kw of entry.keywords) {
    if (m.includes(kw)) s += kw.includes(' ') ? 2 : 1;
  }
  return s;
}

/** Answer a message for a given agent role, entirely client-side. */
export function answerLocally(role: ResolvableAgent, message: string): string {
  let best: KbEntry | null = null;
  let bestScore = 0;
  for (const e of KB) {
    if (e.role !== role) continue;
    const s = score(e, message);
    if (s > bestScore) {
      best = e;
      bestScore = s;
    }
  }
  const body = best && bestScore > 0 ? best.answer : DEFAULTS[role];
  return body + DISCLAIMER;
}
