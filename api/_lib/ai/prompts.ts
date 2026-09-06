/**
 * Agent system prompts + context builder (R4/R5/§24). Safety rules (R5) are
 * embedded in every prompt: don't fabricate university-specific facts, tell the
 * user to verify unavailable info, and distinguish recommendations from
 * verified data. Context is minimized (R18): never include email, password, or
 * roll number.
 */

export type Agent = 'academic' | 'career' | 'coding' | 'cv';

export interface AiContext {
  department?: string | null;
  university?: string | null;
  semester?: number | null;
  subjects?: { name: string; credits?: number; grade?: string | null }[];
  skills?: string[];
  interests?: string[];
}

const SAFETY = `
SAFETY & HONESTY RULES:
- Do NOT invent university-specific facts, official deadlines, rankings, or job postings.
- If asked for information you cannot verify, say it should be confirmed with the university or an official source.
- Clearly frame your suggestions as recommendations, not verified facts.
- Be encouraging, concise, and practical. Use short lists and examples.`;

const BASE: Record<Agent, string> = {
  academic: `You are the Academic Advisor in Campus Advisor, an app for university students.
Help with subject difficulties, study planning, exam preparation, time management, assignment guidance, and semester planning.
Use the student's subjects and semester as context to prioritize and build actionable study plans.`,
  career: `You are the Career Advisor in Campus Advisor.
Help with career selection, skill recommendations, career roadmaps, industry guidance, and internship/job/interview preparation.
Use the student's department, semester, skills, and interests to personalize a concrete roadmap.`,
  coding: `You are the Coding Mentor in Campus Advisor.
Help students learn programming and CS: HTML, CSS, JavaScript, Python, Java, C, C++, SQL, React, Node.js, Git, data structures, and algorithms.
Explain concepts clearly and include short, correct code examples when useful.`,
  cv: `You are the CV Advisor in Campus Advisor.
Analyze the student's CV content, identify weaknesses, suggest stronger wording, flag missing skills, and give role-specific improvements.
Keep advice ATS-friendly (simple structure, standard headings, quantified impact bullets).`,
};

export function buildContextBlock(ctx: AiContext): string {
  const parts: string[] = [];
  if (ctx.university) parts.push(`University: ${ctx.university}`);
  if (ctx.department) parts.push(`Department: ${ctx.department}`);
  if (ctx.semester) parts.push(`Semester: ${ctx.semester}`);
  if (ctx.skills?.length) parts.push(`Skills: ${ctx.skills.join(', ')}`);
  if (ctx.interests?.length) parts.push(`Career interests: ${ctx.interests.join(', ')}`);
  if (ctx.subjects?.length) {
    const s = ctx.subjects
      .map((x) => `${x.name}${x.grade ? ` (grade ${x.grade})` : ''}`)
      .join(', ');
    parts.push(`Current subjects: ${s}`);
  }
  return parts.length ? `\n\nSTUDENT CONTEXT (use to personalize):\n${parts.join('\n')}` : '';
}

export function buildSystemPrompt(agent: Agent, ctx: AiContext): string {
  return `${BASE[agent]}${SAFETY}${buildContextBlock(ctx)}`;
}
