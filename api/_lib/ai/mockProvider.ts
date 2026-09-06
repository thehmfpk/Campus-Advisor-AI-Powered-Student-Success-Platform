import type { AIProvider, CompleteInput, CompleteResult } from './types';

/**
 * MockAIProvider — deterministic, template-based responses so the entire demo
 * works with NO API key and ZERO cost (R21). It inspects the system prompt to
 * detect which agent is active and the latest user message for light keyword
 * shaping, then returns structured, helpful guidance.
 *
 * This is intentionally rule-based (not random) so demos are reproducible.
 */
export class MockAIProvider implements AIProvider {
  readonly kind = 'mock' as const;

  async complete(input: CompleteInput): Promise<CompleteResult> {
    const agent = detectAgent(input.system);
    const userMsg = [...input.messages].reverse().find((m) => m.role === 'user')?.content ?? '';
    const text = render(agent, userMsg);
    return { text, provider: 'mock' };
  }
}

type Agent = 'academic' | 'career' | 'coding' | 'cv' | 'generic';

function detectAgent(system: string): Agent {
  const s = system.toLowerCase();
  if (s.includes('academic advisor')) return 'academic';
  if (s.includes('career advisor')) return 'career';
  if (s.includes('coding mentor')) return 'coding';
  if (s.includes('cv advisor')) return 'cv';
  return 'generic';
}

const DISCLAIMER =
  '\n\n_Note: This is AI guidance (a recommendation, not verified fact). Please verify any university-specific details (deadlines, official rankings, policies) with your institution._';

function render(agent: Agent, msg: string): string {
  switch (agent) {
    case 'academic':
      return (
        `Here's a focused plan based on what you shared:\n\n` +
        `1. **Prioritize** the subjects you feel weakest in first — spend ~60% of study time there.\n` +
        `2. **Daily blocks:** two 90-minute deep-focus sessions with short breaks (Pomodoro).\n` +
        `3. **Active recall:** after reading, close the book and write what you remember.\n` +
        `4. **Past papers:** attempt at least one per subject under timed conditions.\n` +
        `5. **Weekly review:** revisit earlier topics so they stay fresh before the exam.\n\n` +
        `If you tell me your exact subjects and exam dates, I can build a day-by-day schedule.` +
        DISCLAIMER
      );
    case 'career':
      return (
        `Great goal! Here's a practical roadmap:\n\n` +
        `- **Foundations:** solidify the core skills your target role needs (ask me for a skill list).\n` +
        `- **Projects:** build 2–3 portfolio projects that demonstrate those skills.\n` +
        `- **Proof:** put them on GitHub with clear READMEs, and add them to your CV.\n` +
        `- **Network & apply:** target internships that match your semester and skills — check the Jobs section for AI-matched roles.\n` +
        `- **Interview prep:** practice fundamentals and behavioral questions weekly.\n\n` +
        `Tell me your target role and I'll tailor the skill list and timeline.` +
        DISCLAIMER
      );
    case 'coding': {
      const topic = /recursion/i.test(msg)
        ? 'recursion'
        : /array/i.test(msg)
          ? 'arrays'
          : 'this concept';
      return (
        `Let's break down **${topic}** clearly:\n\n` +
        `- **Idea:** a function that solves a big problem by calling itself on smaller inputs until a **base case** stops it.\n` +
        `- **Two parts:** (1) base case (when to stop) and (2) recursive case (reduce the problem).\n\n` +
        '```javascript\n' +
        'function factorial(n) {\n' +
        '  if (n <= 1) return 1;      // base case\n' +
        '  return n * factorial(n - 1); // recursive case\n' +
        '}\n' +
        '```\n\n' +
        `**Tip:** always define the base case first, then make sure each call moves toward it.\n\n` +
        `Want more examples (e.g. Fibonacci, tree traversal) or a practice problem?` +
        DISCLAIMER
      );
    }
    case 'cv':
      return (
        `Here's how to strengthen your CV:\n\n` +
        `- **Impact bullets:** start with a strong verb + quantify the result ("Built X, reducing load time by 40%").\n` +
        `- **Tailor to the role:** mirror the key skills from the job description near the top.\n` +
        `- **Trim fluff:** remove generic phrases like "hardworking team player"; show it instead.\n` +
        `- **Missing skills:** for a frontend role, ensure JavaScript, React, HTML/CSS, and Git are visible.\n` +
        `- **ATS-friendly:** single column, standard section headings, no images/tables.\n\n` +
        `Paste a bullet and I'll rewrite it for stronger impact.` +
        DISCLAIMER
      );
    default:
      return (
        `I'm your Campus Advisor. I can help with academics, careers, coding, and your CV. ` +
        `Ask me something specific — for example, "Plan my exam prep" or "How do I become a backend developer?"` +
        DISCLAIMER
      );
  }
}
