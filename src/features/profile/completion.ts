import type { StudentProfile } from '@/types/db';

export interface CompletionItem {
  label: string;
  done: boolean;
}

export interface CompletionResult {
  percent: number;
  done: number;
  total: number;
  items: CompletionItem[];
}

/**
 * Deterministic profile-completion score used by the dashboard + profile page.
 * Pure and free — no AI, no network.
 */
export function profileCompletion(
  profile: StudentProfile | null,
  subjectCount: number,
): CompletionResult {
  const items: CompletionItem[] = [
    { label: 'Add your full name', done: Boolean(profile?.full_name && profile.full_name.trim().length > 1) },
    { label: 'Set your university', done: Boolean(profile?.university_name) },
    { label: 'Set your department', done: Boolean(profile?.department_name) },
    { label: 'Choose your semester', done: Boolean(profile?.semester) },
    { label: 'Add at least one subject', done: subjectCount > 0 },
    { label: 'Add 3+ skills', done: (profile?.skills?.length ?? 0) >= 3 },
    { label: 'Add career interests', done: (profile?.career_interests?.length ?? 0) >= 1 },
    { label: 'Write a short bio', done: Boolean(profile?.bio && profile.bio.trim().length >= 10) },
  ];
  const done = items.filter((i) => i.done).length;
  const total = items.length;
  const percent = Math.round((done / total) * 100);
  return { percent, done, total, items };
}
