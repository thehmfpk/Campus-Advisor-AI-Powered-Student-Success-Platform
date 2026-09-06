import type { CodingNoteSection } from '@/types/db';

export interface SeedNote {
  technology: string;
  slug: string;
  title: string;
  order: number;
  sections: CodingNoteSection;
}

/**
 * Read-only coding notes (R7). Each covers the seven required sections.
 * Content is concise, original summary material for study — not copied text.
 */
export const SEED_NOTES: SeedNote[] = [
  {
    technology: 'JavaScript',
    slug: 'javascript',
    title: 'JavaScript Fundamentals',
    order: 1,
    sections: {
      introduction:
        'JavaScript is the programming language of the web, running in browsers and on servers (Node.js). It is dynamically typed, single-threaded, and event-driven.',
      fundamentals:
        'Core ideas: variables (let/const), types (string, number, boolean, null, undefined, object, symbol, bigint), functions as first-class values, scope and closures, the event loop, and asynchronous programming with Promises and async/await.',
      syntax:
        'let name = "Ada";\nconst PI = 3.14;\nfunction add(a, b) { return a + b; }\nconst square = x => x * x;\nconst user = { name, age: 30 };',
      concepts:
        'Closures capture variables from their defining scope. Prototypal inheritance powers objects. `this` depends on call-site. The event loop processes the call stack, then microtasks (Promises), then macrotasks.',
      examples:
        'const nums = [1, 2, 3];\nconst doubled = nums.map(n => n * 2); // [2,4,6]\nasync function load() {\n  const res = await fetch("/api/data");\n  return res.json();\n}',
      best_practices:
        'Prefer const/let over var. Use strict equality (===). Handle Promise rejections. Keep functions small and pure where possible. Avoid mutating shared state.',
      interview_tips:
        'Be ready to explain closures, hoisting, the event loop, `this` binding, and the difference between == and ===. Practice debouncing/throttling and array methods (map/filter/reduce).',
    },
  },
  {
    technology: 'React',
    slug: 'react',
    title: 'React Essentials',
    order: 2,
    sections: {
      introduction:
        'React is a library for building user interfaces from composable components. It uses a virtual DOM and a declarative model where UI is a function of state.',
      fundamentals:
        'Components, props (inputs), state (local data), hooks (useState, useEffect, useMemo, useCallback, useContext), and unidirectional data flow.',
      syntax:
        'function Counter() {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;\n}',
      concepts:
        'Rendering is triggered by state/prop changes. Keys help reconcile lists. Effects run after render. Context avoids prop drilling. Memoization avoids unnecessary work.',
      examples:
        'useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id); // cleanup\n}, []);',
      best_practices:
        'Keep components small and focused. Lift state only as high as needed. Use keys correctly. Avoid unnecessary effects. Co-locate state with usage.',
      interview_tips:
        'Explain the virtual DOM, reconciliation, why keys matter, the rules of hooks, and when to use useMemo/useCallback. Know controlled vs uncontrolled inputs.',
    },
  },
  {
    technology: 'Python',
    slug: 'python',
    title: 'Python Basics',
    order: 3,
    sections: {
      introduction:
        'Python is a readable, general-purpose language popular in scripting, web, data science, and AI. It is dynamically typed with significant indentation.',
      fundamentals:
        'Data types (int, float, str, list, tuple, dict, set), control flow, functions, comprehensions, modules, and exceptions.',
      syntax:
        'def greet(name: str) -> str:\n    return f"Hello, {name}"\n\nsquares = [x*x for x in range(5)]',
      concepts:
        'Everything is an object. Lists are mutable; tuples are not. Dictionaries are hash maps. Generators produce values lazily. The GIL affects threading.',
      examples:
        'with open("data.txt") as f:\n    for line in f:\n        print(line.strip())',
      best_practices:
        'Follow PEP 8. Use virtual environments. Prefer comprehensions for clarity. Handle exceptions narrowly. Add type hints for maintainability.',
      interview_tips:
        'Know list vs tuple vs set, dict operations, comprehensions, generators, and mutability. Be ready for string manipulation and complexity questions.',
    },
  },
  {
    technology: 'Data Structures',
    slug: 'data-structures',
    title: 'Data Structures',
    order: 4,
    sections: {
      introduction:
        'Data structures organize data for efficient access and modification. Choosing the right one drives performance.',
      fundamentals:
        'Arrays, linked lists, stacks, queues, hash tables, trees (BST, heap), and graphs. Understand time/space trade-offs.',
      syntax:
        '// Stack via array\nconst stack = [];\nstack.push(1); stack.pop();\n// Map (hash table)\nconst m = new Map(); m.set("a", 1);',
      concepts:
        'Big-O describes growth. Hash tables give average O(1) lookup. Balanced trees give O(log n) operations. Graphs model relationships (BFS/DFS traversal).',
      examples:
        'BFS explores level by level using a queue; DFS goes deep using a stack or recursion.',
      best_practices:
        'Pick structures by access pattern. Watch for hash collisions and worst-case behavior. Consider memory overhead of pointers/objects.',
      interview_tips:
        'Master arrays, hash maps, two pointers, stacks/queues, trees, and graphs. Practice explaining complexity for each operation.',
    },
  },
  {
    technology: 'SQL',
    slug: 'sql',
    title: 'SQL & Databases',
    order: 5,
    sections: {
      introduction:
        'SQL is the language for relational databases, used to define schemas and query/manipulate data.',
      fundamentals:
        'SELECT, WHERE, JOIN, GROUP BY, ORDER BY, aggregate functions, indexes, and normalization.',
      syntax:
        'SELECT u.name, COUNT(p.id) AS posts\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nGROUP BY u.name\nORDER BY posts DESC;',
      concepts:
        'Primary/foreign keys enforce relationships. Indexes speed reads but cost writes. Transactions provide ACID guarantees. Normalization reduces redundancy.',
      examples:
        'CREATE INDEX idx_posts_user ON posts(user_id);',
      best_practices:
        'Select only needed columns. Index columns used in WHERE/JOIN. Use transactions for multi-step writes. Avoid N+1 queries.',
      interview_tips:
        'Know JOIN types, GROUP BY vs WHERE vs HAVING, indexing, and how to detect/fix slow queries. Practice writing aggregate queries.',
    },
  },
  {
    technology: 'Git',
    slug: 'git',
    title: 'Git & Version Control',
    order: 6,
    sections: {
      introduction:
        'Git is a distributed version control system that tracks changes and enables collaboration.',
      fundamentals: 'Repositories, commits, branches, merges, remotes, and pull requests.',
      syntax:
        'git checkout -b feature/login\ngit add .\ngit commit -m "Add login form"\ngit push origin feature/login',
      concepts:
        'A commit is a snapshot. Branches are movable pointers. Merging combines histories; rebasing rewrites them. HEAD points to the current commit.',
      examples: 'git log --oneline --graph\ngit stash\ngit revert <commit>',
      best_practices:
        'Commit small and often with clear messages. Use feature branches. Pull before pushing. Never force-push shared branches.',
      interview_tips:
        'Explain merge vs rebase, how to resolve conflicts, what HEAD is, and how to undo changes (revert vs reset).',
    },
  },
];
