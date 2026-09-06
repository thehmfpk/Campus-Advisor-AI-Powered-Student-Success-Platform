import type { CodingNoteSection } from '@/types/db';

export interface SeedNote {
  technology: string;
  slug: string;
  title: string;
  order: number;
  sections: CodingNoteSection;
}

/**
 * Read-only coding notes (R7). Comprehensive study material covering the seven
 * required sections for each technology. Original summary content written for
 * students — concise but thorough enough to learn and revise from.
 */
export const SEED_NOTES: SeedNote[] = [
  {
    technology: 'HTML',
    slug: 'html',
    title: 'HTML — Structure of the Web',
    order: 1,
    sections: {
      introduction:
        'HTML (HyperText Markup Language) is the standard markup language for creating web pages. It describes the structure and meaning of content using elements (tags). HTML is not a programming language — it has no logic — but it is the skeleton every website is built on. Browsers read HTML and render it into the pages you see.',
      fundamentals:
        'An HTML document has a doctype, an <html> root, a <head> (metadata: title, charset, links to CSS/JS) and a <body> (visible content). Elements are written as <tag>content</tag>; some are self-closing like <img> and <br>. Attributes add information: <a href="...">, <img src="..." alt="...">. Semantic elements (header, nav, main, section, article, aside, footer) describe meaning, which helps accessibility and SEO.',
      syntax:
        '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <title>My Page</title>\n  </head>\n  <body>\n    <header><h1>Hello</h1></header>\n    <main>\n      <p>A paragraph with a <a href="https://example.com">link</a>.</p>\n      <img src="photo.jpg" alt="A description" />\n    </main>\n  </body>\n</html>',
      concepts:
        'Block vs inline elements. Semantic HTML (use <button> for buttons, not <div onclick>). Forms and inputs (<form>, <input>, <label>, <select>, <textarea>). The alt attribute for images (accessibility). Nesting rules (a <p> cannot contain a <div>). The DOM: the browser turns HTML into a tree of nodes that JS can manipulate.',
      examples:
        '<form action="/submit" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required />\n  <button type="submit">Sign up</button>\n</form>\n\n<ul>\n  <li>First</li>\n  <li>Second</li>\n</ul>',
      best_practices:
        'Always set lang on <html> and alt on images. Use one <h1> per page and keep heading order logical (h1→h2→h3). Prefer semantic tags over <div> soup. Label every form field. Keep content and presentation separate (structure in HTML, styling in CSS). Validate your HTML.',
      interview_tips:
        'Know the difference between block and inline elements, semantic vs non-semantic tags, and why accessibility (alt, labels, ARIA) matters. Be ready to explain the DOM, the difference between <section> and <div>, and how the browser parses HTML.',
    },
  },
  {
    technology: 'CSS',
    slug: 'css',
    title: 'CSS — Styling the Web',
    order: 2,
    sections: {
      introduction:
        'CSS (Cascading Style Sheets) controls how HTML looks: colors, spacing, layout, typography, and responsiveness. The "cascade" means multiple rules can apply and are resolved by specificity and order. Good CSS makes a site beautiful, accessible, and responsive across devices.',
      fundamentals:
        'A rule = selector + declaration block: selector { property: value; }. Selectors target elements (p), classes (.btn), IDs (#main), attributes, and combinations. The box model (content, padding, border, margin) governs sizing. Layout is done with Flexbox (1D) and Grid (2D). Units: px, %, em, rem, vh/vw. Media queries make designs responsive.',
      syntax:
        '.card {\n  display: flex;\n  gap: 1rem;\n  padding: 16px;\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n}\n\n@media (max-width: 640px) {\n  .card { flex-direction: column; }\n}',
      concepts:
        'Specificity (inline > id > class > element) and the cascade. The box model and box-sizing: border-box. Flexbox (justify-content, align-items, flex) and Grid (grid-template-columns, gap). Positioning (static/relative/absolute/fixed/sticky). Responsive design with mobile-first media queries. CSS variables (--color) for theming.',
      examples:
        ':root { --brand: #2563eb; }\n.button {\n  background: var(--brand);\n  color: #fff;\n  padding: 8px 16px;\n}\n\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 1rem;\n}',
      best_practices:
        'Use box-sizing: border-box globally. Prefer classes over IDs for styling. Adopt a mobile-first approach. Use rem for scalable typography. Keep specificity low and avoid !important. Use CSS variables for consistent theming. Group related styles and name classes meaningfully (BEM or utility classes like Tailwind).',
      interview_tips:
        'Explain the box model, specificity, and the difference between Flexbox and Grid. Know position values and when to use each. Be ready to center a div (flex: justify-content + align-items). Understand em vs rem and how media queries create responsiveness.',
    },
  },
  {
    technology: 'JavaScript',
    slug: 'javascript',
    title: 'JavaScript — The Language of the Web',
    order: 3,
    sections: {
      introduction:
        'JavaScript is the programming language of the web, running in browsers and on servers (Node.js). It is dynamically typed, single-threaded, and event-driven, using an event loop to handle async work. It powers interactivity, from form validation to full single-page applications.',
      fundamentals:
        'Variables: let (reassignable), const (constant reference), avoid var. Types: string, number, boolean, null, undefined, object, symbol, bigint. Functions are first-class values (can be passed around). Objects and arrays hold structured data. Control flow: if/else, for, while, switch. Scope and closures are core to how JS works.',
      syntax:
        "const user = { name: 'Ada', age: 30 };\nfunction greet(name) { return `Hello, ${name}`; }\nconst square = (x) => x * x;\n\nconst nums = [1, 2, 3];\nconst doubled = nums.map((n) => n * 2); // [2,4,6]\nconst total = nums.reduce((a, b) => a + b, 0); // 6",
      concepts:
        'Closures (a function remembers variables from where it was defined). Hoisting. The `this` keyword (depends on call site; arrow functions inherit `this`). Prototypal inheritance. The event loop: synchronous code runs first, then microtasks (Promises), then macrotasks (setTimeout). Async with Promises and async/await. == (loose) vs === (strict) equality — always prefer ===.',
      examples:
        "async function loadUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error('Not found');\n    return await res.json();\n  } catch (err) {\n    console.error(err);\n  }\n}\n\n// Closure counter\nfunction counter() {\n  let count = 0;\n  return () => ++count;\n}",
      best_practices:
        'Use const by default, let when reassigning, never var. Always use === . Handle Promise rejections (try/catch or .catch). Keep functions small and pure. Avoid mutating shared state. Use array methods (map/filter/reduce) over manual loops when it improves clarity. Use optional chaining (?.) and nullish coalescing (??).',
      interview_tips:
        'Be ready to explain closures, hoisting, the event loop, `this` binding, and == vs ===. Know how to debounce/throttle. Understand Promises vs async/await and how to handle errors. Practice array/string manipulation with map/filter/reduce.',
    },
  },
  {
    technology: 'Python',
    slug: 'python',
    title: 'Python — Readable & Powerful',
    order: 4,
    sections: {
      introduction:
        'Python is a readable, general-purpose language widely used in scripting, web development, automation, data science, and AI. It is dynamically typed with significant indentation (whitespace defines blocks). Its huge standard library and ecosystem make it beginner-friendly yet powerful.',
      fundamentals:
        'Types: int, float, str, bool, list, tuple, dict, set. Lists are mutable, tuples are immutable, dicts are key-value maps, sets hold unique items. Control flow with if/elif/else, for, while. Functions with def and optional type hints. Comprehensions build collections concisely. Modules and packages organize code; pip installs libraries.',
      syntax:
        'def greet(name: str) -> str:\n    return f"Hello, {name}"\n\nsquares = [x * x for x in range(5)]  # [0,1,4,9,16]\nuser = {"name": "Ada", "age": 30}\n\nfor key, value in user.items():\n    print(key, value)',
      concepts:
        'Everything is an object. Mutability (list vs tuple). Dictionaries as hash maps. Generators (yield) produce values lazily to save memory. List/dict/set comprehensions. Exceptions (try/except/finally). The GIL limits true multithreading (use multiprocessing for CPU-bound work). Virtual environments isolate dependencies.',
      examples:
        'with open("data.txt") as f:      # auto-closes file\n    for line in f:\n        print(line.strip())\n\ndef fib():                       # generator\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b',
      best_practices:
        'Follow PEP 8 (naming, spacing). Use virtual environments (venv). Prefer comprehensions and built-ins for clarity. Handle specific exceptions, not bare except. Add type hints for readability. Use f-strings for formatting. Keep functions focused and documented with docstrings.',
      interview_tips:
        'Know list vs tuple vs set vs dict and their time complexities. Explain comprehensions, generators, and mutability. Be comfortable with string manipulation and slicing. Understand *args/**kwargs and decorators at a basic level.',
    },
  },
  {
    technology: 'Java',
    slug: 'java',
    title: 'Java — Write Once, Run Anywhere',
    order: 5,
    sections: {
      introduction:
        'Java is a statically typed, object-oriented, compiled language that runs on the Java Virtual Machine (JVM), making it portable across platforms. It powers enterprise systems, Android apps, and large-scale backends. Its strong typing and mature ecosystem make it reliable for big projects.',
      fundamentals:
        'Everything lives in classes. Primitive types (int, double, boolean, char) vs objects (String, Integer). Access modifiers (public, private, protected). Methods, constructors, and the main method are entry points. Strong typing means types are checked at compile time. Collections (List, Map, Set) hold data.',
      syntax:
        'public class Main {\n    public static void main(String[] args) {\n        String name = "Ada";\n        System.out.println("Hello, " + name);\n        List<Integer> nums = List.of(1, 2, 3);\n        int sum = nums.stream().mapToInt(Integer::intValue).sum();\n    }\n}',
      concepts:
        'OOP pillars: encapsulation, inheritance, polymorphism, abstraction. Interfaces vs abstract classes. Generics for type-safe collections. Exception handling (checked vs unchecked). The Collections framework (ArrayList, HashMap, HashSet). Streams for functional-style processing. Garbage collection manages memory automatically.',
      examples:
        'interface Shape { double area(); }\n\nclass Circle implements Shape {\n    private double r;\n    Circle(double r) { this.r = r; }\n    public double area() { return Math.PI * r * r; }\n}',
      best_practices:
        'Follow naming conventions (PascalCase classes, camelCase methods). Program to interfaces, not implementations. Prefer immutability where possible. Handle exceptions meaningfully. Use generics for type safety. Keep classes cohesive (single responsibility). Close resources with try-with-resources.',
      interview_tips:
        'Explain the four OOP pillars with examples. Know the difference between an interface and abstract class, == vs .equals(), and ArrayList vs LinkedList. Understand how HashMap works (hashing + buckets) and checked vs unchecked exceptions.',
    },
  },
  {
    technology: 'C++',
    slug: 'cpp',
    title: 'C++ — Power and Control',
    order: 6,
    sections: {
      introduction:
        'C++ is a fast, compiled, statically typed language that gives fine-grained control over memory and hardware. It supports both procedural and object-oriented styles and is used in systems programming, game engines, embedded devices, and competitive programming.',
      fundamentals:
        'Data types (int, double, char, bool) and pointers/references. Manual memory management with new/delete (or smart pointers). Functions, classes, and the Standard Template Library (STL: vector, map, set, algorithms). Header files declare, .cpp files define. Compilation produces native machine code.',
      syntax:
        '#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {3, 1, 2};\n    sort(nums.begin(), nums.end());\n    for (int n : nums) cout << n << " ";\n    return 0;\n}',
      concepts:
        'Pointers vs references and pointer arithmetic. Memory: stack vs heap; avoid leaks (prefer smart pointers: unique_ptr, shared_ptr). RAII (Resource Acquisition Is Initialization). The STL containers and algorithms. Templates for generic code. Const-correctness. Pass by value vs reference.',
      examples:
        '#include <memory>\n\nstruct Node { int val; };\n\nint main() {\n    auto p = std::make_unique<Node>();  // smart pointer, auto-frees\n    p->val = 42;\n}',
      best_practices:
        'Prefer STL containers over raw arrays. Use smart pointers instead of raw new/delete. Follow RAII. Pass large objects by const reference. Initialize variables. Avoid using namespace std in headers. Compile with warnings enabled (-Wall).',
      interview_tips:
        'Know stack vs heap, pointers vs references, and how to avoid memory leaks. Explain RAII and smart pointers. Be comfortable with STL vector/map/set and common algorithms (sort, binary_search). Understand pass-by-value vs pass-by-reference.',
    },
  },
  {
    technology: 'SQL',
    slug: 'sql',
    title: 'SQL & Relational Databases',
    order: 7,
    sections: {
      introduction:
        'SQL (Structured Query Language) is the standard language for relational databases. It lets you define schemas and create, read, update, and delete data. Relational databases organize data into tables with rows and columns, connected by keys.',
      fundamentals:
        'Core statements: SELECT (read), INSERT, UPDATE, DELETE, and DDL (CREATE/ALTER/DROP TABLE). Clauses: WHERE (filter), ORDER BY (sort), GROUP BY (aggregate), LIMIT. Keys: primary key (unique row id) and foreign key (link to another table). Data types: INT, VARCHAR, DATE, BOOLEAN, etc.',
      syntax:
        'SELECT u.name, COUNT(p.id) AS posts\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nWHERE u.active = true\nGROUP BY u.name\nHAVING COUNT(p.id) > 0\nORDER BY posts DESC\nLIMIT 10;',
      concepts:
        'JOINs: INNER (matching rows), LEFT (all left + matching right), RIGHT, FULL. WHERE (filters rows) vs HAVING (filters groups). Aggregate functions (COUNT, SUM, AVG, MIN, MAX). Indexes speed up reads on filtered/joined columns but slow writes. Transactions provide ACID guarantees. Normalization reduces data redundancy.',
      examples:
        'CREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE\n);\n\nCREATE INDEX idx_posts_user ON posts(user_id);\n\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;',
      best_practices:
        'Select only needed columns (avoid SELECT *). Index columns used in WHERE/JOIN. Use transactions for multi-step writes. Parameterize queries to prevent SQL injection. Normalize to reduce redundancy, denormalize only for performance when needed. Avoid N+1 queries.',
      interview_tips:
        'Know the JOIN types and draw them as Venn diagrams. Explain WHERE vs HAVING vs GROUP BY. Understand indexing trade-offs and how to spot a slow query. Be ready to write aggregate queries and explain ACID and normalization.',
    },
  },
  {
    technology: 'React',
    slug: 'react',
    title: 'React — Component-Based UIs',
    order: 8,
    sections: {
      introduction:
        'React is a JavaScript library for building user interfaces from reusable components. It uses a virtual DOM to efficiently update the page and a declarative model where the UI is a function of state. React powers many modern web and mobile (React Native) apps.',
      fundamentals:
        'Components are functions returning JSX. Props are read-only inputs passed from parent to child. State (useState) is local, mutable data that triggers re-renders. Hooks (useState, useEffect, useMemo, useCallback, useContext) add behavior to function components. Data flows one way: down via props, up via callbacks.',
      syntax:
        "import { useState, useEffect } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n  return <button onClick={() => setCount((c) => c + 1)}>{count}</button>;\n}",
      concepts:
        'The virtual DOM and reconciliation (React diffs and updates only what changed). Keys help React identify list items. useEffect runs side effects after render; its dependency array controls when. Context avoids prop drilling. Memoization (useMemo/useCallback/React.memo) avoids unnecessary work. Controlled vs uncontrolled inputs.',
      examples:
        "function TodoList({ todos }) {\n  return (\n    <ul>\n      {todos.map((t) => (\n        <li key={t.id}>{t.text}</li>\n      ))}\n    </ul>\n  );\n}\n\n// Cleanup in effect\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);",
      best_practices:
        'Keep components small and focused. Lift state only as high as needed. Always give list items stable keys (not the index if the list reorders). Avoid unnecessary effects — derive values during render when possible. Follow the Rules of Hooks (only call hooks at the top level). Co-locate state with where it is used.',
      interview_tips:
        'Explain the virtual DOM, reconciliation, and why keys matter. Know the Rules of Hooks and when to use useMemo/useCallback. Understand controlled vs uncontrolled components, and how useEffect dependency arrays work. Be ready to explain one-way data flow.',
    },
  },
  {
    technology: 'Node.js',
    slug: 'nodejs',
    title: 'Node.js — JavaScript on the Server',
    order: 9,
    sections: {
      introduction:
        'Node.js is a runtime that lets JavaScript run outside the browser, on servers. Built on the V8 engine, it uses a non-blocking, event-driven model that handles many concurrent connections efficiently. It powers APIs, real-time apps, and build tooling.',
      fundamentals:
        'The module system (CommonJS require / ES modules import). npm manages packages (package.json). Core modules: fs (files), http (server), path, events. The event loop enables non-blocking I/O. Express is the most popular framework for building web servers and APIs.',
      syntax:
        "import express from 'express';\nconst app = express();\napp.use(express.json());\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\napp.listen(3000, () => console.log('Server on :3000'));",
      concepts:
        'Non-blocking, asynchronous I/O and the event loop. Middleware in Express (functions that run on each request). Environment variables for config/secrets. Error handling in async routes. Streams for large data. The difference between CPU-bound (bad for Node) and I/O-bound (great for Node) work.',
      examples:
        "app.post('/api/users', async (req, res) => {\n  try {\n    const user = await db.createUser(req.body);\n    res.status(201).json(user);\n  } catch (err) {\n    res.status(400).json({ error: 'Invalid input' });\n  }\n});",
      best_practices:
        'Never block the event loop with heavy CPU work. Keep secrets in environment variables, never in code. Validate all incoming data. Handle errors in every async route. Use middleware for cross-cutting concerns (auth, logging). Return consistent JSON error shapes. Use a process manager in production.',
      interview_tips:
        'Explain the event loop and why Node is good for I/O-bound work. Know what middleware is and how Express handles requests. Understand async error handling and environment variables for secrets. Be able to build a simple REST endpoint.',
    },
  },
  {
    technology: 'Git',
    slug: 'git',
    title: 'Git & Version Control',
    order: 10,
    sections: {
      introduction:
        'Git is a distributed version control system that tracks changes to code over time and enables collaboration. Every developer has a full copy of the history. Platforms like GitHub/GitLab host repositories and add collaboration features (pull requests, issues).',
      fundamentals:
        'A repository stores your project and its history. A commit is a snapshot with a message. Branches are movable pointers that let you work in isolation. Remotes (origin) are hosted copies. The workflow: edit → stage (git add) → commit → push. Pull requests propose merging one branch into another.',
      syntax:
        'git init\ngit checkout -b feature/login    # create + switch branch\ngit add .                        # stage changes\ngit commit -m "Add login form"   # snapshot\ngit push origin feature/login    # upload, then open a PR',
      concepts:
        'The three areas: working directory, staging area (index), and repository. HEAD points to the current commit. Merge (combines histories, keeps both) vs rebase (rewrites history for a linear log). Resolving merge conflicts. Undoing: git revert (safe, new commit) vs git reset (rewrites history). .gitignore excludes files.',
      examples:
        'git status                 # what changed\ngit log --oneline --graph  # visual history\ngit stash                  # shelve changes temporarily\ngit revert <commit>        # undo a commit safely\ngit merge main             # bring main into your branch',
      best_practices:
        'Commit small and often with clear, present-tense messages. Use feature branches, not commits straight to main. Pull before you push. Never force-push shared branches. Write a .gitignore (node_modules, .env). Review changes before committing (git diff). Open pull requests for review.',
      interview_tips:
        'Explain merge vs rebase and when to use each. Know how to resolve a conflict, what HEAD is, and the staging area. Understand git revert vs reset. Be ready to describe a typical branching/PR workflow.',
    },
  },
  {
    technology: 'Data Structures',
    slug: 'data-structures',
    title: 'Data Structures',
    order: 11,
    sections: {
      introduction:
        'Data structures are ways of organizing and storing data so it can be accessed and modified efficiently. Choosing the right structure for a problem is one of the biggest factors in a program\u2019s performance. This is a core interview topic.',
      fundamentals:
        'Arrays (contiguous, O(1) index access). Linked lists (nodes with pointers, O(1) insert/delete at ends). Stacks (LIFO) and queues (FIFO). Hash tables/maps (average O(1) lookup). Trees (hierarchical; binary search trees, heaps). Graphs (nodes + edges, model relationships).',
      syntax:
        '// Stack via array\nconst stack = [];\nstack.push(1); stack.pop();\n\n// Queue\nconst q = [];\nq.push(1); q.shift();\n\n// Hash map\nconst map = new Map();\nmap.set("a", 1); map.get("a");',
      concepts:
        'Big-O notation describes how time/space grow with input size. Trade-offs: arrays are fast to index but slow to insert in the middle; linked lists are the opposite. Hash tables give average O(1) lookup but can degrade with collisions. Trees give O(log n) operations when balanced. Graphs are traversed with BFS (queue) and DFS (stack/recursion).',
      examples:
        '// BFS on a graph (level by level)\nfunction bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  while (queue.length) {\n    const node = queue.shift();\n    for (const n of graph[node]) {\n      if (!visited.has(n)) { visited.add(n); queue.push(n); }\n    }\n  }\n}',
      best_practices:
        'Pick the structure based on the operations you do most (lookup? insert? ordered iteration?). Watch worst-case behavior, not just average. Consider memory overhead (pointers, objects). Use built-in structures (Map, Set) before writing your own.',
      interview_tips:
        'Master arrays, hash maps, stacks/queues, linked lists, trees, and graphs, with the Big-O of each operation. Practice the two-pointer, sliding-window, and BFS/DFS patterns. Be able to choose the right structure and justify it.',
    },
  },
  {
    technology: 'Algorithms',
    slug: 'algorithms',
    title: 'Algorithms & Problem Solving',
    order: 12,
    sections: {
      introduction:
        'An algorithm is a step-by-step procedure to solve a problem. Studying algorithms teaches you to write efficient, correct code and is central to technical interviews. The goal is not memorization but recognizing patterns and analyzing complexity.',
      fundamentals:
        'Time & space complexity (Big-O). Searching: linear O(n) and binary search O(log n) on sorted data. Sorting: bubble/insertion O(n\u00b2), merge/quick sort O(n log n). Recursion and divide-and-conquer. Common patterns: two pointers, sliding window, hashing, greedy, dynamic programming.',
      syntax:
        '// Binary search (sorted array)\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}',
      concepts:
        'Big-O: O(1) < O(log n) < O(n) < O(n log n) < O(n\u00b2) < O(2\u207f). Recursion needs a base case + progress toward it. Dynamic programming stores subproblem results to avoid recomputation (memoization / tabulation). Greedy makes locally optimal choices. Know when a pattern applies (e.g., sliding window for subarray problems).',
      examples:
        '// Two-sum with a hash map — O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n}',
      best_practices:
        'Clarify the problem and constraints before coding. Think about brute force first, then optimize. State your approach and its complexity out loud. Test with edge cases (empty, single element, duplicates). Prefer clear code; optimize only where complexity matters.',
      interview_tips:
        'Practice patterns, not memorized solutions: two pointers, sliding window, hashing, BFS/DFS, binary search, and basic DP. Always state time/space complexity. Talk through your approach before coding, and test with edge cases. Do a few problems daily on a platform like LeetCode.',
    },
  },
];
