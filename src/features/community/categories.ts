import type { PostCategory } from '@/types/db';

export const POST_CATEGORIES: { value: PostCategory; label: string }[] = [
  { value: 'general', label: 'General' },
  { value: 'university_problem', label: 'University Problem' },
  { value: 'opportunity', label: 'Opportunity' },
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'internship', label: 'Internship' },
  { value: 'event', label: 'Event' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'announcement', label: 'Announcement' },
];

export function categoryLabel(c: PostCategory): string {
  return POST_CATEGORIES.find((x) => x.value === c)?.label ?? c;
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}
