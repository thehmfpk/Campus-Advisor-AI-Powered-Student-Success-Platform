import type { Job, JobMatch, StudentProfile } from '@/types/db';

/**
 * Deterministic, explainable job-match scoring (R6/§5). Pure function — no AI,
 * no external calls, no cost. The score is always reproducible; any AI is only
 * used elsewhere to phrase an explanation, never to produce the number.
 *
 *   score = 0.50*skillOverlap + 0.20*departmentRelevance
 *         + 0.20*interestOverlap + 0.10*semesterFit   (→ 0..100)
 */

const norm = (s: string) => s.trim().toLowerCase();

function overlapRatio(a: string[], b: string[]): { ratio: number; matched: string[]; missing: string[] } {
  const setA = new Set(a.map(norm));
  const matched: string[] = [];
  const missing: string[] = [];
  for (const item of b) {
    if (setA.has(norm(item))) matched.push(item);
    else missing.push(item);
  }
  const ratio = b.length === 0 ? 0 : matched.length / b.length;
  return { ratio, matched, missing };
}

function departmentRelevance(department: string | null | undefined, tags: string[]): number {
  if (!department) return 0;
  const d = norm(department);
  const tagSet = tags.map(norm);
  // Direct tag hit, or common department→tag associations.
  if (tagSet.includes(d)) return 1;
  const map: Record<string, string[]> = {
    'computer science': ['software engineering', 'frontend', 'backend', 'fullstack', 'web', 'computer science'],
    'software engineering': ['software engineering', 'frontend', 'backend', 'fullstack', 'web'],
    'data science': ['data science', 'ml', 'ai', 'analytics', 'artificial intelligence'],
    'artificial intelligence': ['ai', 'ml', 'data science', 'artificial intelligence'],
    'cyber security': ['security', 'cyber security', 'infosec'],
  };
  const related = map[d] ?? [];
  return related.some((r) => tagSet.includes(norm(r))) ? 0.7 : 0;
}

function semesterFit(semester: number | null | undefined, job: Job): number {
  if (!semester) return 0.5;
  if (job.employment_type === 'internship' || job.employment_type === 'part_time') {
    // Internships suit any student; slightly favor mid-degree.
    return semester >= 3 ? 1 : 0.7;
  }
  // Full-time/contract favor later semesters (closer to graduation).
  return semester >= 6 ? 1 : semester >= 4 ? 0.6 : 0.3;
}

export function computeMatch(profile: Pick<StudentProfile, 'skills' | 'career_interests' | 'department_name' | 'semester'>, job: Job): JobMatch {
  const skills = profile.skills ?? [];
  const interests = profile.career_interests ?? [];

  const skill = overlapRatio(skills, job.required_skills);
  const interest = overlapRatio(interests, job.tags);
  const dept = departmentRelevance(profile.department_name, job.tags);
  const sem = semesterFit(profile.semester, job);

  const breakdown = {
    skillOverlap: skill.ratio,
    departmentRelevance: dept,
    interestOverlap: interest.ratio,
    semesterFit: sem,
  };

  const raw =
    0.5 * breakdown.skillOverlap +
    0.2 * breakdown.departmentRelevance +
    0.2 * breakdown.interestOverlap +
    0.1 * breakdown.semesterFit;

  const score = Math.round(Math.max(0, Math.min(1, raw)) * 100);

  return {
    score,
    explanation: explain(score, skill.matched, skill.missing, job),
    breakdown,
    matchedSkills: skill.matched,
    missingSkills: skill.missing,
  };
}

function explain(score: number, matched: string[], missing: string[], job: Job): string {
  const strength = score >= 75 ? 'Strong match' : score >= 50 ? 'Good match' : 'Partial match';
  const parts: string[] = [];
  if (matched.length) {
    parts.push(
      `you have ${matched.length}/${job.required_skills.length} required skills (${matched.join(', ')})`,
    );
  } else {
    parts.push(`this role needs skills you haven't listed yet`);
  }
  if (missing.length) parts.push(`consider learning ${missing.slice(0, 3).join(', ')}`);
  return `${strength}: ${parts.join('; ')}.`;
}
