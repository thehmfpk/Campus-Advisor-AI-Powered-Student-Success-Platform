import {
  LayoutDashboard,
  User,
  Bot,
  Calculator,
  Briefcase,
  FileText,
  BookOpen,
  Users,
  MessageSquareWarning,
  Trophy,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  to: string;
  /** Translation key (see i18n/translations.ts). */
  key: string;
  /** English fallback label. */
  label: string;
  icon: LucideIcon;
}

export const studentNav: NavItem[] = [
  { to: '/app/dashboard', key: 'nav.dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/advisor', key: 'nav.advisor', label: 'AI Advisor', icon: Bot },
  { to: '/app/jobs', key: 'nav.jobs', label: 'Jobs', icon: Briefcase },
  { to: '/app/cv', key: 'nav.cv', label: 'CV Builder', icon: FileText },
  { to: '/app/gpa', key: 'nav.gpa', label: 'GPA / CGPA', icon: Calculator },
  { to: '/app/notes', key: 'nav.notes', label: 'Coding Notes', icon: BookOpen },
  { to: '/app/community', key: 'nav.community', label: 'Community', icon: Users },
  { to: '/app/rankings', key: 'nav.rankings', label: 'Rankings', icon: Trophy },
  { to: '/app/feedback', key: 'nav.feedback', label: 'Feedback', icon: MessageSquareWarning },
  { to: '/app/profile', key: 'nav.profile', label: 'Profile', icon: User },
];
