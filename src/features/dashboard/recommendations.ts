import { BookOpen, Briefcase, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import type { StudentProfile, StudentSubject } from '@/types/db';

export interface Recommendation {
  text: string;
  icon: LucideIcon;
}

/**
 * Deterministic, profile-derived recommendations for the dashboard (R3).
 * No AI call — free, instant, and always available. The AI Advisor provides
 * richer conversational guidance separately.
 */
export function buildRecommendations(
  profile: StudentProfile | null,
  subjects: StudentSubject[],
): Recommendation[] {
  if (!profile) return [];
  const recs: Recommendation[] = [];

  const interests = profile.career_interests ?? [];
  const skills = (profile.skills ?? []).map((s) => s.toLowerCase());

  // Skill gap based on interests.
  if (interests.some((i) => /front|web|full/i.test(i)) && !skills.includes('javascript')) {
    recs.push({
      text: 'You should strengthen JavaScript — it is core to your frontend/web career goal.',
      icon: TrendingUp,
    });
  }
  if (interests.some((i) => /data|ml|ai/i.test(i)) && !skills.includes('python')) {
    recs.push({
      text: 'Consider learning Python and basic statistics to support your data/AI interests.',
      icon: TrendingUp,
    });
  }

  // Subjects without a grade yet → need study time.
  const ungraded = subjects.filter((s) => !s.grade);
  if (ungraded.length > 0) {
    recs.push({
      text: `Your current semester has ${ungraded.length} subject${ungraded.length > 1 ? 's' : ''} without recorded grades — allocate extra study time.`,
      icon: BookOpen,
    });
  }

  // Career discovery.
  if (skills.length >= 3) {
    recs.push({
      text: `Based on your ${skills.length} skills, explore matched internships in the Jobs section.`,
      icon: Briefcase,
    });
  }

  // Prompt to add interests.
  if (interests.length === 0) {
    recs.push({
      text: 'Add your career interests in your profile so we can tailor job matches and roadmaps.',
      icon: Target,
    });
  }

  return recs.slice(0, 4);
}
