import type { AgentKey } from '@/types/db';

/**
 * Deterministic intent router (R4/§6). Maps a free-text student message to the
 * best specialized agent using keyword scoring. Fast, testable, and free — no
 * LLM call required. Used both client-side (to show the agent badge) and
 * server-side (to pick the prompt). Manual selection always overrides this.
 */

export type ResolvableAgent = Exclude<AgentKey, 'auto'>;

const SIGNALS: Record<ResolvableAgent, RegExp[]> = {
  cv: [/\bcv\b/i, /resume/i, /cover letter/i, /ats/i, /my resume/i],
  coding: [
    /recursion/i,
    /algorithm/i,
    /data structure/i,
    /\bcode\b/i,
    /\bbug\b/i,
    /function/i,
    /javascript|typescript|python|java\b|c\+\+|\bc#\b|react|node|sql|html|css|git\b/i,
    /compile|syntax|loop|array|pointer|api\b/i,
  ],
  career: [
    /career/i,
    /\bjob\b/i,
    /internship/i,
    /interview/i,
    /roadmap/i,
    /become a|want to be|data scientist|developer|engineer/i,
    /skill.*(learn|need)/i,
    /salary|industry|hiring/i,
  ],
  academic: [
    /exam/i,
    /study/i,
    /semester/i,
    /assignment/i,
    /gpa|cgpa|grade/i,
    /subject/i,
    /time management/i,
    /quiz|midterm|final/i,
    /prepare for/i,
  ],
};

export interface RouteResult {
  agent: ResolvableAgent;
  scores: Record<ResolvableAgent, number>;
}

/** Score each agent by keyword hits; highest wins. Ties break toward academic. */
export function routeIntent(message: string): RouteResult {
  const scores: Record<ResolvableAgent, number> = {
    academic: 0,
    career: 0,
    coding: 0,
    cv: 0,
  };
  for (const agent of Object.keys(SIGNALS) as ResolvableAgent[]) {
    for (const re of SIGNALS[agent]) {
      if (re.test(message)) scores[agent] += 1;
    }
  }

  // CV signals are strong intent; give a small boost so "improve my CV for a
  // frontend job" routes to CV rather than career/coding.
  if (scores.cv > 0) scores.cv += 1;

  let best: ResolvableAgent = 'academic';
  let bestScore = -1;
  const priority: ResolvableAgent[] = ['academic', 'career', 'coding', 'cv'];
  for (const agent of priority) {
    if (scores[agent] > bestScore) {
      best = agent;
      bestScore = scores[agent];
    }
  }
  return { agent: best, scores };
}

export const AGENT_META: Record<
  ResolvableAgent,
  { label: string; blurb: string; emoji: string }
> = {
  academic: {
    label: 'Academic Advisor',
    blurb: 'Study plans, exams, semester planning',
    emoji: '📚',
  },
  career: { label: 'Career Advisor', blurb: 'Careers, skills, interviews', emoji: '🚀' },
  coding: { label: 'Coding Mentor', blurb: 'Programming & CS concepts', emoji: '💻' },
  cv: { label: 'CV Advisor', blurb: 'Resume review & improvement', emoji: '📄' },
};
