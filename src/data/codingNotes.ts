import type { CodingNoteSection } from '@/types/db';

export interface SeedNote {
  technology: string;
  slug: string;
  title: string;
  order: number;
  sections: CodingNoteSection;
}

/**
 * Read-only coding notes (R7). Comprehensive, long-form study material for each
 * technology, covering all seven sections. Original content written for
 * students — thorough enough to learn and revise a whole topic from.
 */
export const SEED_NOTES: SeedNote[] = [
  {
    technology: 'HTML',
    slug: 'html',
    title: 'HTML — Structure of the Web',
    order: 1,
    sections: {
      introduction:
        'HTML (HyperText Markup Language) is the standard markup language for building web pages. It is the very first thing every browser reads to construct a page. HTML is not a programming language — it has no variables, loops, or logic — instead it describes the structure and meaning of content using elements called tags. When you open any website, the browser downloads an HTML document, parses it into a tree (the DOM), and renders it visually. HTML works together with CSS (for styling) and JavaScript (for behavior). Learning HTML well means understanding not just how to place content on a page, but how to make it meaningful, accessible, and machine-readable so search engines and assistive technologies can understand it too.',
      fundamentals:
        'Every HTML document begins with <!DOCTYPE html> and an <html> root element. Inside it are two main parts: the <head> (metadata the user does not see directly — the page title, character set, viewport settings, and links to CSS/JS files) and the <body> (all the visible content). Elements are written as <tag>content</tag>; a few are self-closing such as <img>, <br>, <input>, and <hr>. Attributes add extra information inside the opening tag, e.g. <a href="page.html">, <img src="pic.jpg" alt="A cat">. Common text elements include headings <h1>–<h6>, paragraphs <p>, links <a>, images <img>, and lists <ul>/<ol>/<li>. Semantic structural elements — <header>, <nav>, <main>, <section>, <article>, <aside>, <footer> — describe the role of each part of the page, which is vital for accessibility and SEO. Forms use <form>, <input>, <label>, <select>, <textarea>, and <button> to collect user input.',
      syntax:
        '<!DOCTYPE html>\n<html lang="en">\n  <head>\n    <meta charset="UTF-8" />\n    <meta name="viewport" content="width=device-width, initial-scale=1.0" />\n    <title>My Page</title>\n  </head>\n  <body>\n    <header>\n      <h1>Welcome</h1>\n      <nav>\n        <a href="/">Home</a>\n        <a href="/about">About</a>\n      </nav>\n    </header>\n    <main>\n      <section>\n        <h2>Introduction</h2>\n        <p>A paragraph with a <a href="https://example.com">link</a>.</p>\n        <img src="photo.jpg" alt="A description of the photo" />\n      </section>\n    </main>\n    <footer>&copy; 2025</footer>\n  </body>\n</html>',
      concepts:
        'Block vs inline elements: block elements (div, p, section, h1) start on a new line and take full width; inline elements (span, a, strong, img) sit within a line. Semantic HTML: use the element that matches the meaning — a real <button> for a clickable action, not a styled <div>, because it is keyboard-focusable and announced correctly by screen readers. The DOM (Document Object Model): the browser turns HTML into a tree of nodes that JavaScript can read and change dynamically. Accessibility: the alt attribute describes images for screen readers, <label> ties text to form fields, and ARIA attributes add roles/states when native elements are not enough. Nesting rules matter — for example a <p> cannot contain a <div>. Forms: the method (GET/POST) and action attributes control where and how data is submitted; input types (email, number, date, checkbox, radio) give built-in validation and better mobile keyboards.',
      examples:
        '<!-- A form with proper labels and validation -->\n<form action="/signup" method="post">\n  <label for="email">Email</label>\n  <input id="email" name="email" type="email" required />\n\n  <label for="age">Age</label>\n  <input id="age" name="age" type="number" min="16" />\n\n  <button type="submit">Sign up</button>\n</form>\n\n<!-- Lists -->\n<ul>\n  <li>Unordered item</li>\n</ul>\n<ol>\n  <li>Ordered item</li>\n</ol>\n\n<!-- A table -->\n<table>\n  <thead><tr><th>Name</th><th>Score</th></tr></thead>\n  <tbody><tr><td>Ada</td><td>95</td></tr></tbody>\n</table>',
      best_practices:
        'Always set lang on <html> and a descriptive alt on every meaningful image (use alt="" for purely decorative images). Use exactly one <h1> per page and keep heading levels in logical order (do not skip from h1 to h4). Prefer semantic tags over generic <div>/<span> "soup". Label every form field. Keep structure in HTML and appearance in CSS — never use HTML for layout hacks. Include the viewport meta tag so pages are responsive on mobile. Validate your markup (W3C validator) and test with a keyboard (Tab) and a screen reader. Write clean, indented, lowercase markup.',
      interview_tips:
        'Be ready to explain: the difference between block and inline elements; semantic vs non-semantic elements and why semantics matter for accessibility and SEO; what the DOM is; the difference between <section>, <article>, and <div>; why the alt attribute exists; and how the browser parses HTML into a render tree. Know the common input types and the purpose of the <label> element. A frequent question: "How would you make a page accessible?" — answer with semantic tags, alt text, labels, keyboard support, and sufficient color contrast.',
    },
  },
  {
    technology: 'CSS',
    slug: 'css',
    title: 'CSS — Styling & Layout',
    order: 2,
    sections: {
      introduction:
        'CSS (Cascading Style Sheets) controls the presentation of HTML: colors, fonts, spacing, sizing, layout, animations, and responsiveness across screen sizes. The word "cascading" refers to how the browser resolves conflicts when multiple rules target the same element — it uses origin, specificity, and source order. CSS transformed the web from plain documents into rich, responsive interfaces. Mastering CSS means understanding the box model, the two main layout systems (Flexbox and Grid), how specificity decides which rule wins, and how media queries adapt a design to phones, tablets, and desktops. Good CSS is maintainable, accessible (readable contrast, respects reduced motion), and performant.',
      fundamentals:
        'A CSS rule is a selector plus a declaration block: selector { property: value; }. Selectors target elements by tag (p), class (.btn), id (#main), attribute ([type="text"]), or relationships (.card > p, ul li). You can apply CSS three ways: inline (style=""), internal (<style>), or external (<link rel="stylesheet">) — external is preferred. The box model wraps every element in content, padding, border, and margin; setting box-sizing: border-box makes width include padding and border, which is far easier to reason about. Units: px (fixed), % (relative to parent), em (relative to font size), rem (relative to root font size — great for scalable typography), and viewport units vw/vh. Colors can be named, hex (#2563eb), rgb()/rgba(), or hsl()/hsla().',
      syntax:
        '/* External stylesheet */\n* { box-sizing: border-box; }\n\n:root {\n  --brand: #2563eb;      /* CSS variable */\n  --space: 16px;\n}\n\n.card {\n  display: flex;\n  gap: var(--space);\n  padding: var(--space);\n  border: 1px solid #e5e7eb;\n  border-radius: 12px;\n  background: #fff;\n  box-shadow: 0 2px 8px rgba(0,0,0,0.08);\n}\n\n.button {\n  background: var(--brand);\n  color: #fff;\n  padding: 8px 16px;\n  border-radius: 8px;\n}\n\n@media (max-width: 640px) {\n  .card { flex-direction: column; }\n}',
      concepts:
        'Specificity & the cascade: inline styles beat IDs, IDs beat classes, classes beat element selectors; when specificity ties, the later rule wins. Avoid !important — it breaks the cascade. Layout with Flexbox (one-dimensional: a row OR a column) uses display:flex with justify-content (main axis), align-items (cross axis), and flex on children. Grid (two-dimensional: rows AND columns) uses display:grid with grid-template-columns, grid-template-rows, and gap. Positioning: static (default), relative (offset from itself), absolute (relative to nearest positioned ancestor), fixed (relative to viewport), sticky (scrolls then sticks). Responsive design: mobile-first — write base styles for small screens, then add min-width media queries for larger ones. CSS variables enable theming (light/dark). Transitions and transforms create smooth, GPU-friendly animations.',
      examples:
        '/* Center anything with flexbox */\n.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-height: 100vh;\n}\n\n/* Responsive auto-fitting grid */\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 1rem;\n}\n\n/* Smooth hover transition */\n.btn {\n  transition: transform 0.2s ease, box-shadow 0.2s ease;\n}\n.btn:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(0,0,0,0.15);\n}',
      best_practices:
        'Set box-sizing: border-box globally. Prefer classes over IDs for styling (lower, reusable specificity). Adopt a mobile-first workflow. Use rem for font sizes so text scales with user settings. Keep specificity low and flat; avoid deep selector chains and !important. Use CSS variables for colors/spacing to enable theming and consistency. Group related styles and name classes meaningfully (BEM like .card__title--active, or a utility system like Tailwind). Respect prefers-reduced-motion for accessibility. Minimize layout thrash by animating transform/opacity rather than width/top.',
      interview_tips:
        'Explain the box model and the effect of box-sizing:border-box. Describe specificity and how the cascade resolves conflicts. Compare Flexbox (1D) vs Grid (2D) and give a use case for each. Be able to center a div both ways. Explain position values, especially the difference between absolute, fixed, and sticky. Know em vs rem. Explain how media queries create responsiveness and what "mobile-first" means. A common task: build a responsive card grid — reach for Grid with auto-fit/minmax.',
    },
  },
  {
    technology: 'JavaScript',
    slug: 'javascript',
    title: 'JavaScript — The Language of the Web',
    order: 3,
    sections: {
      introduction:
        'JavaScript (JS) is the programming language that makes web pages interactive. It runs in every browser and, thanks to Node.js, on servers too. JS is dynamically typed (you do not declare types), single-threaded (one thing at a time on the main thread), and event-driven, using an "event loop" to handle asynchronous work like network requests without freezing the page. Originally built for small scripts, JavaScript now powers entire applications — from interactive UIs and single-page apps to backends, mobile apps, and build tooling. Understanding JavaScript deeply — scope, closures, the event loop, and asynchronous programming — is the single highest-leverage skill for a web developer.',
      fundamentals:
        'Variables: use const for values that will not be reassigned, let when they will, and avoid var (it is function-scoped and hoists confusingly). Primitive types: string, number, boolean, null, undefined, symbol, bigint; everything else is an object (including arrays and functions). Functions are first-class values — you can store them in variables, pass them as arguments, and return them. Objects hold key-value pairs; arrays hold ordered lists. Control flow: if/else, for, while, switch, and the ternary operator. Modern syntax includes arrow functions, template literals (`Hello ${name}`), destructuring ({ a, b } = obj), the spread/rest operator (...), default parameters, optional chaining (obj?.prop), and nullish coalescing (a ?? b). Modules (import/export) split code into files.',
      syntax:
        "// Variables & types\nconst name = 'Ada';\nlet age = 30;\n\n// Objects & arrays\nconst user = { name, age, skills: ['JS', 'React'] };\nconst { skills } = user;             // destructuring\n\n// Functions\nfunction add(a, b) { return a + b; }\nconst square = (x) => x * x;         // arrow function\n\n// Array methods\nconst nums = [1, 2, 3, 4];\nconst doubled = nums.map((n) => n * 2);            // [2,4,6,8]\nconst evens   = nums.filter((n) => n % 2 === 0);   // [2,4]\nconst total   = nums.reduce((sum, n) => sum + n, 0); // 10",
      concepts:
        'Scope & closures: a function "closes over" the variables in the scope where it was defined and remembers them even after that scope returns — the basis for data privacy and many patterns. Hoisting: declarations are moved to the top of their scope (let/const are hoisted but not initialized — the "temporal dead zone"). The `this` keyword depends on how a function is called; arrow functions do not have their own `this` and inherit it from the surrounding scope. Prototypal inheritance: objects can inherit from other objects via the prototype chain. The event loop: synchronous code runs first on the call stack; then microtasks (resolved Promises) run; then macrotasks (setTimeout, events). Asynchronous JS: callbacks -> Promises -> async/await. Equality: always use === (strict) over == (loose) to avoid surprising type coercion.',
      examples:
        "// Closure: a private counter\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst next = makeCounter();\nnext(); // 1\nnext(); // 2\n\n// Async/await with error handling\nasync function loadUser(id) {\n  try {\n    const res = await fetch(`/api/users/${id}`);\n    if (!res.ok) throw new Error('Request failed');\n    const data = await res.json();\n    return data;\n  } catch (err) {\n    console.error('Could not load user:', err);\n  }\n}\n\n// Promise.all — run in parallel\nconst [a, b] = await Promise.all([fetch('/a'), fetch('/b')]);",
      best_practices:
        'Use const by default, let only when reassigning, never var. Always compare with ===. Handle every Promise rejection (try/catch with async/await, or .catch()). Keep functions small and pure (no side effects) where possible; avoid mutating shared state. Prefer array methods (map/filter/reduce) when they improve readability. Use optional chaining (?.) and nullish coalescing (??) to handle missing data safely. Name things clearly. Avoid deeply nested callbacks — flatten with async/await. Do not block the main thread with heavy loops. Lint your code (ESLint) and format it (Prettier).',
      interview_tips:
        'Core questions: explain closures (and give a use case); the event loop and the order of sync code, microtasks, and macrotasks; how `this` is determined and how arrow functions differ; the difference between == and ===; var vs let vs const and hoisting; and how Promises and async/await work. Be able to implement debounce/throttle and to manipulate arrays/strings with map/filter/reduce. Know the difference between deep and shallow copies. Practice explaining your reasoning out loud.',
    },
  },
  {
    technology: 'Python',
    slug: 'python',
    title: 'Python — Readable & Powerful',
    order: 4,
    sections: {
      introduction:
        'Python is a high-level, readable, general-purpose programming language created by Guido van Rossum. Its clean, English-like syntax and enormous ecosystem make it one of the most popular languages for beginners and experts alike. Python is used everywhere: automation and scripting, web backends (Django, Flask, FastAPI), data science and machine learning (pandas, NumPy, scikit-learn, PyTorch, TensorFlow), scientific computing, and DevOps. Python is dynamically typed and uses indentation (whitespace) instead of braces to define code blocks, which enforces readable structure. Its "batteries included" standard library and huge third-party ecosystem (PyPI) mean you can build almost anything quickly.',
      fundamentals:
        'Core data types: int, float, str, bool, and the collections list (ordered, mutable), tuple (ordered, immutable), dict (key-value map), and set (unique, unordered). Variables need no type declaration. Indentation defines blocks — no braces. Control flow: if/elif/else, for loops (iterate over any iterable), while loops, break/continue. Functions use def with optional type hints and default arguments; they can return multiple values as a tuple. Comprehensions build lists/dicts/sets concisely. Modules are files you import; packages are folders of modules; pip installs third-party libraries; virtual environments (venv) isolate a project\u2019s dependencies. f-strings (f"{name}") are the modern way to format text.',
      syntax:
        'def greet(name: str) -> str:\n    return f"Hello, {name}"\n\n# Collections\nnums = [1, 2, 3, 4]\nuser = {"name": "Ada", "age": 30}\nunique = {1, 2, 2, 3}          # {1, 2, 3}\n\n# Comprehensions\nsquares = [x * x for x in range(5)]           # [0,1,4,9,16]\nevens = [x for x in nums if x % 2 == 0]        # [2, 4]\n\n# Iterating a dict\nfor key, value in user.items():\n    print(key, value)\n\n# Reading a file safely\nwith open("data.txt") as f:\n    for line in f:\n        print(line.strip())',
      concepts:
        'Everything in Python is an object, including functions and classes. Mutability: lists, dicts, and sets are mutable; strings, tuples, ints are immutable — this affects how they behave when passed to functions. Dictionaries are hash maps with average O(1) lookup. Generators (using yield) produce values lazily, saving memory for large sequences. Comprehensions are the Pythonic way to transform data. Exceptions are handled with try/except/else/finally; raise your own with raise. The Global Interpreter Lock (GIL) means threads do not run Python bytecode truly in parallel — use multiprocessing for CPU-bound work and async/threads for I/O-bound work. Decorators (@) wrap functions to add behavior. Context managers (with) handle setup/cleanup (like closing files).',
      examples:
        '# A generator\ndef fib():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\ngen = fib()\n[next(gen) for _ in range(6)]   # [0,1,1,2,3,5]\n\n# Exception handling\ntry:\n    result = 10 / 0\nexcept ZeroDivisionError:\n    result = None\nfinally:\n    print("done")\n\n# A simple class\nclass Circle:\n    def __init__(self, r):\n        self.r = r\n    def area(self):\n        return 3.14159 * self.r ** 2',
      best_practices:
        'Follow PEP 8 (snake_case for variables/functions, 4-space indents, meaningful names). Always work inside a virtual environment (python -m venv). Prefer comprehensions and built-in functions (sum, sorted, enumerate, zip) for clarity and speed. Catch specific exceptions, never a bare except. Add type hints for readability and tooling. Use f-strings for formatting. Write docstrings for functions and modules. Keep functions short and single-purpose. Use with for files/resources so they close automatically.',
      interview_tips:
        'Know list vs tuple vs set vs dict, their mutability, and time complexities. Explain comprehensions, generators (and why they save memory), and the difference between mutable and immutable types. Be comfortable with string slicing and manipulation. Understand *args/**kwargs, decorators, and the GIL at a basic level. Common questions: "How would you remove duplicates from a list?" (use a set), "How do you reverse a string?" (slicing s[::-1]).',
    },
  },
  {
    technology: 'Java',
    slug: 'java',
    title: 'Java — Robust, Object-Oriented',
    order: 5,
    sections: {
      introduction:
        'Java is a statically typed, class-based, object-oriented language that compiles to bytecode and runs on the Java Virtual Machine (JVM). Its motto, "write once, run anywhere," comes from the JVM abstracting away the operating system. Java powers massive enterprise systems, Android apps, banking backends, and large-scale distributed systems. Its strong typing catches many errors at compile time, and its mature ecosystem (Spring, Maven/Gradle, a vast standard library) makes it reliable for big, long-lived projects. Java automatically manages memory through garbage collection, so you rarely free memory manually.',
      fundamentals:
        'Everything lives inside classes; the program entry point is public static void main(String[] args). Primitive types (int, long, double, float, boolean, char) are value types; objects (String, arrays, and your classes) are reference types. Access modifiers control visibility: public, private, protected, and package-private (default). Java is strongly typed — every variable has a declared type checked at compile time. The Collections Framework provides List (ArrayList, LinkedList), Set (HashSet, TreeSet), and Map (HashMap, TreeMap). Generics (List<String>) give type-safe collections. Streams (since Java 8) enable functional-style data processing. Exceptions are either checked (must be declared/handled) or unchecked (runtime).',
      syntax:
        'import java.util.*;\nimport java.util.stream.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        String name = "Ada";\n        System.out.println("Hello, " + name);\n\n        List<Integer> nums = List.of(1, 2, 3, 4);\n        int sum = nums.stream()\n                      .filter(n -> n % 2 == 0)\n                      .mapToInt(Integer::intValue)\n                      .sum();                     // 6\n\n        Map<String, Integer> ages = new HashMap<>();\n        ages.put("Ada", 30);\n    }\n}',
      concepts:
        'The four pillars of OOP: Encapsulation (keep fields private, expose via methods), Inheritance (extends a superclass to reuse code), Polymorphism (a subclass overrides methods; the same call behaves differently), and Abstraction (interfaces/abstract classes define "what", not "how"). Interfaces define a contract multiple classes can implement; abstract classes can hold shared state and partial implementation. Generics provide compile-time type safety. The Collections Framework: ArrayList (fast random access) vs LinkedList (fast insert/delete at ends); HashMap (average O(1) lookup via hashing + buckets). Exception handling: try/catch/finally; checked vs unchecked. equals() and hashCode() must be consistent for objects used as map keys. The JVM handles memory via garbage collection.',
      examples:
        'interface Shape {\n    double area();\n}\n\nclass Circle implements Shape {\n    private final double r;\n    Circle(double r) { this.r = r; }\n    public double area() { return Math.PI * r * r; }\n}\n\nclass Rectangle implements Shape {\n    private final double w, h;\n    Rectangle(double w, double h) { this.w = w; this.h = h; }\n    public double area() { return w * h; }\n}\n\n// Polymorphism\nList<Shape> shapes = List.of(new Circle(2), new Rectangle(3, 4));\ndouble total = shapes.stream().mapToDouble(Shape::area).sum();',
      best_practices:
        'Follow naming conventions: PascalCase for classes, camelCase for methods/variables, UPPER_SNAKE for constants. Program to interfaces, not implementations (List instead of ArrayList in declarations). Prefer immutability (final fields) where possible. Override equals() and hashCode() together. Use generics for type safety. Handle exceptions meaningfully — do not swallow them. Close resources with try-with-resources. Keep classes cohesive (single responsibility). Favor composition over deep inheritance hierarchies.',
      interview_tips:
        'Explain the four OOP pillars with concrete examples. Know the difference between an interface and an abstract class, and when to use each. Explain == (reference equality) vs .equals() (value equality). Compare ArrayList vs LinkedList and describe how HashMap works internally (hashing, buckets, collisions). Distinguish checked vs unchecked exceptions. Understand why equals()/hashCode() must agree. Know what the JVM and garbage collection do.',
    },
  },
  {
    technology: 'C++',
    slug: 'cpp',
    title: 'C++ — Power and Control',
    order: 6,
    sections: {
      introduction:
        'C++ is a fast, statically typed, compiled language that gives fine-grained control over memory and hardware while also supporting high-level abstractions. It extends C with object-oriented and generic programming. C++ is the language of choice where performance is critical: game engines, operating systems, embedded systems, high-frequency trading, and competitive programming. With great power comes responsibility — C++ lets you manage memory directly, so you must avoid leaks and undefined behavior. Modern C++ (C++11 and later) adds smart pointers, auto type deduction, lambdas, and move semantics that make the language safer and more expressive.',
      fundamentals:
        'C++ programs are compiled into native machine code. Basic types: int, double, float, char, bool, plus pointers and references. A pointer stores a memory address (int* p = &x;); a reference is an alias (int& r = x;). Memory lives on the stack (automatic, fast) or the heap (manual, via new/delete — or better, smart pointers). Header files (.h) declare interfaces; source files (.cpp) define them. The Standard Template Library (STL) provides containers (vector, map, set, unordered_map), iterators, and algorithms (sort, find, binary_search). Classes support constructors, destructors, and operator overloading. Templates enable generic, type-independent code.',
      syntax:
        '#include <iostream>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    vector<int> nums = {3, 1, 4, 1, 5};\n    sort(nums.begin(), nums.end());\n    for (int n : nums) cout << n << " ";\n    cout << "\\n";\n\n    // Find\n    auto it = find(nums.begin(), nums.end(), 4);\n    if (it != nums.end()) cout << "found\\n";\n    return 0;\n}',
      concepts:
        'Pointers vs references: pointers can be reassigned and be null; references cannot. Memory management: prefer RAII (Resource Acquisition Is Initialization) — acquire resources in a constructor, release in the destructor, so cleanup is automatic. Use smart pointers (unique_ptr for sole ownership, shared_ptr for shared ownership) instead of raw new/delete to prevent leaks. The STL: vector (dynamic array), map/set (ordered, tree-based, O(log n)), unordered_map/unordered_set (hash-based, average O(1)). Templates provide compile-time generics. Const-correctness (const parameters and methods) documents intent and prevents bugs. Move semantics (std::move, rvalue references) avoid expensive copies. Pass large objects by const reference.',
      examples:
        '#include <memory>\n#include <vector>\n\nstruct Node {\n    int value;\n    Node(int v) : value(v) {}\n};\n\nint main() {\n    // Smart pointer — memory freed automatically\n    auto n = std::make_unique<Node>(42);\n\n    // Template function\n    // template <typename T> T maxOf(T a, T b) { return a > b ? a : b; }\n\n    std::vector<int> v = {1, 2, 3};\n    for (const auto& x : v) { /* read-only iteration */ }\n}',
      best_practices:
        'Prefer STL containers (vector, map) over raw arrays. Use smart pointers (unique_ptr/shared_ptr) instead of manual new/delete. Follow RAII so resources clean up automatically. Pass large objects by const reference to avoid copies. Always initialize variables. Mark methods and parameters const where they do not modify state. Avoid "using namespace std;" in header files. Compile with warnings enabled (-Wall -Wextra). Prefer nullptr over NULL, and range-based for loops for readability.',
      interview_tips:
        'Explain stack vs heap and when each is used. Describe the difference between pointers and references. Explain how to avoid memory leaks (RAII + smart pointers) and what unique_ptr vs shared_ptr mean. Know the common STL containers and their complexities (vector, map O(log n), unordered_map O(1) avg). Explain pass-by-value vs pass-by-reference vs pass-by-const-reference. Be ready for pointer/array manipulation questions and to reason about time complexity.',
    },
  },
  {
    technology: 'SQL',
    slug: 'sql',
    title: 'SQL & Relational Databases',
    order: 7,
    sections: {
      introduction:
        'SQL (Structured Query Language) is the standard language for working with relational databases such as PostgreSQL, MySQL, SQL Server, SQLite, and Oracle. A relational database organizes data into tables (relations) made of rows (records) and columns (fields), and links tables using keys. SQL lets you define the structure (DDL), and create, read, update, and delete data (DML/CRUD). It is declarative — you describe what data you want, and the database engine figures out how to get it efficiently. SQL is one of the most valuable and long-lived skills in software: nearly every application stores data in a database.',
      fundamentals:
        'Data lives in tables with typed columns (INT, VARCHAR, TEXT, DATE, BOOLEAN, DECIMAL). Keys: a PRIMARY KEY uniquely identifies each row; a FOREIGN KEY references a primary key in another table to model relationships. Core statements: SELECT (read), INSERT (create), UPDATE (modify), DELETE (remove), and DDL like CREATE/ALTER/DROP TABLE. Query clauses run in a logical order: FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT. Constraints (NOT NULL, UNIQUE, CHECK, DEFAULT) enforce data integrity. Relationships are one-to-one, one-to-many, or many-to-many (via a join table).',
      syntax:
        '-- Create\nCREATE TABLE users (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(100) NOT NULL,\n  email VARCHAR(255) UNIQUE,\n  created_at TIMESTAMP DEFAULT now()\n);\n\n-- Read with join + aggregate\nSELECT u.name, COUNT(p.id) AS posts\nFROM users u\nLEFT JOIN posts p ON p.user_id = u.id\nWHERE u.active = true\nGROUP BY u.name\nHAVING COUNT(p.id) > 0\nORDER BY posts DESC\nLIMIT 10;\n\n-- Update / Delete\nUPDATE users SET name = \'Ada L.\' WHERE id = 1;\nDELETE FROM users WHERE id = 5;',
      concepts:
        'JOINs combine rows across tables: INNER JOIN (only matching rows), LEFT JOIN (all left rows + matches), RIGHT JOIN, FULL OUTER JOIN. WHERE filters individual rows before grouping; GROUP BY collapses rows into groups; HAVING filters the groups afterward. Aggregate functions: COUNT, SUM, AVG, MIN, MAX. Indexes are data structures (usually B-trees) that make lookups on indexed columns fast (O(log n)) at the cost of slower writes and extra storage. Transactions group statements so they all succeed or all fail (ACID: Atomicity, Consistency, Isolation, Durability). Normalization (1NF, 2NF, 3NF) organizes data to reduce redundancy; sometimes you denormalize for read performance. Subqueries and CTEs (WITH) structure complex queries.',
      examples:
        '-- Index for fast lookups\nCREATE INDEX idx_posts_user ON posts(user_id);\n\n-- Transaction (bank transfer — all or nothing)\nBEGIN;\nUPDATE accounts SET balance = balance - 100 WHERE id = 1;\nUPDATE accounts SET balance = balance + 100 WHERE id = 2;\nCOMMIT;\n\n-- Common Table Expression\nWITH active_users AS (\n  SELECT id, name FROM users WHERE active = true\n)\nSELECT * FROM active_users ORDER BY name;',
      best_practices:
        'Select only the columns you need (avoid SELECT *). Add indexes on columns used in WHERE and JOIN conditions. Wrap multi-step writes in transactions. Always parameterize queries (use placeholders) to prevent SQL injection — never concatenate user input into SQL. Normalize to remove redundancy; denormalize deliberately only for performance. Avoid the N+1 query problem (one query per row) — use a JOIN instead. Use meaningful table/column names and consistent conventions.',
      interview_tips:
        'Know the JOIN types and be able to draw them as Venn diagrams. Explain the difference between WHERE and HAVING, and where GROUP BY fits. Understand how and why indexes speed up reads (and slow writes). Explain ACID and what a transaction guarantees. Be ready to write an aggregate query (e.g., top N by count) and to explain normalization vs denormalization. Know how to prevent SQL injection (parameterized queries).',
    },
  },
  {
    technology: 'React',
    slug: 'react',
    title: 'React — Component-Based UIs',
    order: 8,
    sections: {
      introduction:
        'React is a JavaScript library (created by Facebook/Meta) for building user interfaces out of reusable, composable components. Its central idea is declarative UI: you describe what the interface should look like for a given state, and React efficiently updates the real DOM to match using a lightweight in-memory representation called the Virtual DOM. React powers a huge share of modern web apps and, via React Native, mobile apps. Modern React uses function components and Hooks (introduced in React 16.8) instead of class components. Learning React well means mastering components, props, state, the rules of hooks, and how re-rendering works.',
      fundamentals:
        'A component is a function that returns JSX (an HTML-like syntax that compiles to function calls). Props are read-only inputs passed from a parent to a child. State is local, mutable data managed with the useState hook; changing state triggers a re-render. Hooks add capabilities to function components: useState (state), useEffect (side effects after render), useMemo (cache a computed value), useCallback (cache a function), useContext (read shared context), useRef (a mutable value that does not cause re-renders). Data flows one way — down through props, and up through callback functions. Lists are rendered with .map() and require a stable key prop.',
      syntax:
        "import { useState, useEffect } from 'react';\n\nfunction Counter() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]); // runs whenever count changes\n\n  return (\n    <div>\n      <p>Count: {count}</p>\n      <button onClick={() => setCount((c) => c + 1)}>Increment</button>\n    </div>\n  );\n}",
      concepts:
        'The Virtual DOM: React keeps an in-memory tree; on a state change it computes the minimal set of real DOM updates (reconciliation). Keys help React match list items across renders — use a stable id, not the array index if the list can reorder. useEffect runs after render; its dependency array controls when it re-runs (empty array = once on mount; a cleanup function handles unmount). Context provides values deep in the tree without "prop drilling". Memoization (useMemo/useCallback/React.memo) prevents unnecessary recomputation/renders — use it where it measurably helps, not everywhere. Controlled components tie an input\u2019s value to state; uncontrolled components use refs. Lifting state up shares data between siblings via a common parent.',
      examples:
        "// Fetching data with cleanup\nfunction Users() {\n  const [users, setUsers] = useState([]);\n  const [loading, setLoading] = useState(true);\n\n  useEffect(() => {\n    let active = true;\n    fetch('/api/users')\n      .then((r) => r.json())\n      .then((data) => { if (active) setUsers(data); })\n      .finally(() => active && setLoading(false));\n    return () => { active = false; }; // cleanup\n  }, []);\n\n  if (loading) return <p>Loading...</p>;\n  return (\n    <ul>{users.map((u) => <li key={u.id}>{u.name}</li>)}</ul>\n  );\n}",
      best_practices:
        'Keep components small and focused on one job. Lift state only as high as it needs to go. Give list items stable keys (never the index if items reorder). Do not put derived data in state — compute it during render. Avoid unnecessary useEffect; only use it for true side effects (network, subscriptions, DOM). Follow the Rules of Hooks: only call hooks at the top level, never in loops/conditions. Co-locate state near where it is used. Split large components; extract reusable pieces. Use a key on lists and stable callbacks to avoid needless re-renders.',
      interview_tips:
        'Explain the Virtual DOM and reconciliation, and why keys matter. State the Rules of Hooks. Explain how useEffect dependency arrays work and how cleanup functions run. Compare controlled vs uncontrolled inputs. Explain one-way data flow and how children communicate with parents (callbacks). Know when useMemo/useCallback are worth it. Common task: build a list with add/remove and controlled input; be ready to explain each re-render.',
    },
  },
  {
    technology: 'Node.js',
    slug: 'nodejs',
    title: 'Node.js — JavaScript on the Server',
    order: 9,
    sections: {
      introduction:
        'Node.js is a runtime that lets you run JavaScript outside the browser — on servers, in command-line tools, and in build systems. Built on Google\u2019s V8 engine, Node uses a non-blocking, event-driven, single-threaded model with an event loop, which makes it excellent at handling many simultaneous connections (I/O-bound work) efficiently. Node powers REST/GraphQL APIs, real-time apps (chat, live updates), microservices, and the tooling behind most frontend frameworks. Its package manager, npm, hosts the largest software registry in the world. Express is the most popular minimal web framework built on Node.',
      fundamentals:
        'Modules organize code: modern Node uses ES modules (import/export) or the older CommonJS (require/module.exports). package.json declares your project, dependencies, and scripts; npm/pnpm/yarn install packages into node_modules. Core built-in modules include fs (file system), http (servers), path, os, and events. The event loop enables asynchronous, non-blocking I/O — file and network operations do not freeze the program. Express provides routing (app.get/post), middleware (functions that run on each request), and request/response objects. Environment variables (process.env) store configuration and secrets, kept out of source code.',
      syntax:
        "import express from 'express';\n\nconst app = express();\napp.use(express.json()); // parse JSON bodies\n\napp.get('/api/health', (req, res) => {\n  res.json({ status: 'ok' });\n});\n\napp.post('/api/users', async (req, res) => {\n  try {\n    const user = await createUser(req.body);\n    res.status(201).json(user);\n  } catch (err) {\n    res.status(400).json({ error: 'Invalid input' });\n  }\n});\n\napp.listen(3000, () => console.log('Server on :3000'));",
      concepts:
        'Non-blocking I/O and the event loop: instead of waiting for a file or network response, Node registers a callback and continues; when the operation completes, the callback runs. This makes Node great for I/O-bound work but poor for heavy CPU-bound tasks (which block the single thread — offload those to worker threads or another service). Middleware in Express is a pipeline: each function can modify the request/response or pass control with next(). Use middleware for logging, authentication, parsing, and error handling. Streams process large data piece by piece without loading it all into memory. Always keep secrets in environment variables and validate incoming data on the server.',
      examples:
        "// Middleware for auth\nfunction requireAuth(req, res, next) {\n  const token = req.headers.authorization;\n  if (!token) return res.status(401).json({ error: 'Unauthorized' });\n  next();\n}\napp.use('/api/private', requireAuth);\n\n// Reading a file asynchronously\nimport { readFile } from 'fs/promises';\nconst text = await readFile('data.txt', 'utf-8');\n\n// Environment variables\nconst dbUrl = process.env.DATABASE_URL;",
      best_practices:
        'Never block the event loop with heavy synchronous CPU work. Keep API keys and passwords in environment variables — never in code or git. Validate and sanitize every incoming request (a library like Zod or Joi helps). Handle errors in every async route (try/catch) and return consistent JSON error shapes with proper status codes. Use middleware for cross-cutting concerns (auth, logging, rate limiting). Do not commit node_modules. Use a process manager (PM2) or the platform\u2019s runtime in production, and enable graceful shutdown.',
      interview_tips:
        'Explain the event loop and why Node is well-suited to I/O-bound (not CPU-bound) workloads. Describe what middleware is and how an Express request flows through it. Explain how to handle errors in async routes and how to keep secrets safe (env vars). Know the difference between CommonJS and ES modules. Be able to sketch a simple REST endpoint with proper status codes. Understand streams at a high level.',
    },
  },
  {
    technology: 'Git',
    slug: 'git',
    title: 'Git & Version Control',
    order: 10,
    sections: {
      introduction:
        'Git is a distributed version control system created by Linus Torvalds. It tracks every change to your code over time, lets you experiment safely on branches, and enables teams to collaborate without overwriting each other\u2019s work. "Distributed" means every developer has a full copy of the project\u2019s history locally. Platforms like GitHub, GitLab, and Bitbucket host Git repositories in the cloud and add collaboration features: pull/merge requests, issues, code review, and CI/CD. Git is an essential professional skill — every serious software team uses it.',
      fundamentals:
        'A repository (repo) contains your project and its complete history. A commit is a snapshot of your files at a point in time, with a message describing the change. Branches are lightweight, movable pointers that let you develop features in isolation from the main branch (main/master). Remotes (commonly named origin) are hosted copies you push to and pull from. The everyday workflow: edit files -> stage them (git add) -> commit (git commit) -> push to the remote (git push). A pull request (PR) proposes merging one branch into another and is where code review happens. .gitignore lists files Git should not track (node_modules, .env, build output).',
      syntax:
        'git init                          # start a repo\ngit clone <url>                   # copy an existing repo\n\ngit status                        # what changed\ngit add .                         # stage all changes\ngit commit -m "Add login form"    # snapshot\n\ngit checkout -b feature/login     # create + switch branch\ngit push origin feature/login     # upload branch, then open a PR\n\ngit pull                          # fetch + merge remote changes\ngit log --oneline --graph         # visual history',
      concepts:
        'Git has three areas: the working directory (your files), the staging area/index (changes marked for the next commit), and the repository (committed history). HEAD is a pointer to your current commit/branch. Merging combines two branches\u2019 histories and creates a merge commit, preserving both; rebasing replays your commits on top of another branch for a linear history (do not rebase shared/public branches). Merge conflicts happen when the same lines change in two branches — Git marks them and you resolve manually. Undoing safely: git revert creates a new commit that undoes a previous one (safe for shared branches); git reset moves the branch pointer (rewrites history — use with care). Fetch downloads remote changes without merging; pull does both.',
      examples:
        '# Resolve a conflict\ngit merge main            # conflict appears\n# ... edit the conflicted files, remove <<<< ==== >>>> markers ...\ngit add <file>\ngit commit                # completes the merge\n\n# Temporarily shelve work\ngit stash\ngit stash pop\n\n# Undo the last commit but keep the changes\ngit reset --soft HEAD~1\n\n# Safely undo a pushed commit\ngit revert <commit-hash>',
      best_practices:
        'Commit small, logical changes often, with clear present-tense messages ("Add", "Fix", "Refactor"). Never commit directly to main on a team — use feature branches and pull requests. Pull before you push to avoid conflicts. Never force-push to shared branches. Write a .gitignore early (exclude node_modules, .env, dist). Review your changes with git diff before committing. Keep secrets out of the repo. Use meaningful branch names (feature/…, fix/…). Rebase your own local branch to keep history clean, but never rewrite public history.',
      interview_tips:
        'Explain the difference between merge and rebase, and when each is appropriate. Describe how to resolve a merge conflict. Explain the three areas (working dir, staging, repo) and what HEAD is. Distinguish git revert vs git reset. Explain fetch vs pull. Walk through a typical branching + pull-request workflow. Know how to undo the last commit and how to ignore files.',
    },
  },
  {
    technology: 'Data Structures',
    slug: 'data-structures',
    title: 'Data Structures',
    order: 11,
    sections: {
      introduction:
        'Data structures are ways of organizing and storing data so that it can be accessed and modified efficiently. Choosing the right data structure is one of the biggest factors in a program\u2019s performance and clarity. Different structures make different operations fast: some optimize lookup, others insertion or ordered traversal. This is a core topic for technical interviews and for writing efficient real-world software. Understanding the trade-offs — measured with Big-O notation — lets you pick the best tool for each problem.',
      fundamentals:
        'Arrays store elements in contiguous memory with O(1) access by index, but inserting/removing in the middle is O(n). Linked lists store nodes each pointing to the next, giving O(1) insert/delete at known positions but O(n) access by index. Stacks are LIFO (last-in, first-out) — push/pop from one end. Queues are FIFO (first-in, first-out). Hash tables/maps store key-value pairs with average O(1) insert and lookup by hashing keys into buckets. Trees are hierarchical: a binary search tree keeps sorted order with O(log n) operations when balanced; a heap gives fast access to the min/max. Graphs are sets of nodes (vertices) connected by edges, modeling networks and relationships.',
      syntax:
        '// JavaScript built-ins\nconst stack = [];\nstack.push(1); stack.pop();          // LIFO\n\nconst queue = [];\nqueue.push(1); queue.shift();        // FIFO (approx)\n\nconst map = new Map();\nmap.set("a", 1); map.get("a");       // hash map — O(1) avg\n\nconst set = new Set([1, 2, 2, 3]);   // unique values\n\n// A tree/graph as an adjacency list\nconst graph = { A: ["B", "C"], B: ["D"], C: [], D: [] };',
      concepts:
        'Big-O notation describes how time or space grows as input size n grows; it captures the worst/average case, not exact timings. Key trade-offs: arrays are great for random access and iteration but costly for middle insertion; linked lists are the reverse. Hash tables give average O(1) lookup but can degrade to O(n) with many collisions and have no inherent order. Balanced binary search trees keep data sorted with O(log n) search/insert/delete. Heaps (priority queues) give O(1) peek and O(log n) insert/extract of the min or max. Graphs are traversed with BFS (breadth-first, uses a queue, finds shortest paths in unweighted graphs) and DFS (depth-first, uses a stack or recursion). Choose the structure by the operations you perform most.',
      examples:
        '// Breadth-First Search (level by level)\nfunction bfs(graph, start) {\n  const visited = new Set([start]);\n  const queue = [start];\n  const order = [];\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const next of graph[node]) {\n      if (!visited.has(next)) {\n        visited.add(next);\n        queue.push(next);\n      }\n    }\n  }\n  return order;\n}\n\n// Count frequencies with a hash map — O(n)\nfunction freq(arr) {\n  const m = new Map();\n  for (const x of arr) m.set(x, (m.get(x) ?? 0) + 1);\n  return m;\n}',
      best_practices:
        'Pick the structure based on the operations you do most often: frequent lookups by key -> hash map; ordered iteration + range queries -> balanced tree; LIFO/FIFO processing -> stack/queue; fixed-size fast index access -> array. Consider worst-case behavior, not just average (e.g., hash collisions). Account for memory overhead (linked lists and trees store pointers). Prefer language built-ins (Map, Set, arrays) before implementing your own. Keep invariants simple and document them.',
      interview_tips:
        'Master the core structures and the Big-O of each operation: array, linked list, stack, queue, hash map, binary search tree, heap, and graph. Practice the patterns that use them: two pointers and sliding window (arrays), BFS/DFS (graphs/trees), and using a hash map for O(1) lookups (e.g., two-sum). Always state complexity. Be able to justify why you chose a particular structure for a problem.',
    },
  },
  {
    technology: 'Algorithms',
    slug: 'algorithms',
    title: 'Algorithms & Problem Solving',
    order: 12,
    sections: {
      introduction:
        'An algorithm is a well-defined, step-by-step procedure for solving a problem. Studying algorithms trains you to write correct, efficient code and to reason about performance — skills tested heavily in technical interviews and essential in real engineering. The goal is not to memorize solutions but to recognize patterns, analyze complexity with Big-O, and combine known techniques to solve new problems. Strong algorithmic thinking helps you turn a vague problem into a clear, efficient solution.',
      fundamentals:
        'Complexity analysis (Big-O) measures how running time and memory scale with input size. Searching: linear search is O(n); binary search is O(log n) but requires sorted data. Sorting: simple sorts (bubble, insertion, selection) are O(n\u00b2); efficient sorts (merge sort, quicksort, heapsort) are O(n log n). Recursion solves a problem in terms of smaller subproblems and needs a base case. Divide and conquer splits a problem, solves parts, and combines (merge sort, binary search). Core patterns: two pointers, sliding window, hashing for O(1) lookups, greedy algorithms, and dynamic programming.',
      syntax:
        '// Binary search on a sorted array — O(log n)\nfunction binarySearch(arr, target) {\n  let lo = 0, hi = arr.length - 1;\n  while (lo <= hi) {\n    const mid = (lo + hi) >> 1;\n    if (arr[mid] === target) return mid;\n    if (arr[mid] < target) lo = mid + 1;\n    else hi = mid - 1;\n  }\n  return -1;\n}\n\n// Merge sort — O(n log n)\nfunction mergeSort(a) {\n  if (a.length <= 1) return a;\n  const mid = a.length >> 1;\n  const l = mergeSort(a.slice(0, mid));\n  const r = mergeSort(a.slice(mid));\n  const out = [];\n  let i = 0, j = 0;\n  while (i < l.length && j < r.length) out.push(l[i] <= r[j] ? l[i++] : r[j++]);\n  return out.concat(l.slice(i), r.slice(j));\n}',
      concepts:
        'The Big-O hierarchy from best to worst: O(1) < O(log n) < O(n) < O(n log n) < O(n\u00b2) < O(2\u207f) < O(n!). Recursion needs a base case plus progress toward it; watch for stack depth. Dynamic programming (DP) applies when a problem has overlapping subproblems and optimal substructure — store subresults via memoization (top-down) or tabulation (bottom-up) to avoid recomputation (e.g., Fibonacci, knapsack, longest common subsequence). Greedy algorithms make the locally best choice at each step and work only when that yields a global optimum (e.g., interval scheduling). Recognize which pattern fits: sliding window for contiguous subarray problems, two pointers for sorted arrays, BFS for shortest path in unweighted graphs.',
      examples:
        '// Two-sum with a hash map — O(n)\nfunction twoSum(nums, target) {\n  const seen = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const need = target - nums[i];\n    if (seen.has(need)) return [seen.get(need), i];\n    seen.set(nums[i], i);\n  }\n  return [];\n}\n\n// Dynamic programming — Fibonacci with memoization\nfunction fib(n, memo = {}) {\n  if (n < 2) return n;\n  if (memo[n] !== undefined) return memo[n];\n  return (memo[n] = fib(n - 1, memo) + fib(n - 2, memo));\n}',
      best_practices:
        'Clarify the problem, inputs, outputs, and constraints before coding. Start with a brute-force idea, then optimize. State your approach and its time/space complexity out loud. Test with edge cases: empty input, one element, duplicates, very large input, negative numbers. Write clean, readable code first; micro-optimize only when the complexity matters. Re-use known patterns rather than inventing from scratch. Practice consistently — a few problems daily beats cramming.',
      interview_tips:
        'Focus on patterns, not memorized answers: two pointers, sliding window, hashing, BFS/DFS, binary search, sorting, recursion, and basic dynamic programming. Always analyze and state time and space complexity. Talk through your plan before you code, and test with edge cases. If stuck, start with brute force and optimize step by step. Practice explaining clearly — communication matters as much as the solution. Platforms like LeetCode, HackerRank, and Codeforces are great for practice.',
    },
  },
];
