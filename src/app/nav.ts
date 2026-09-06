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
  label: string;
  icon: LucideIcon;
}

export const studentNav: NavItem[] = [
  { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/advisor', label: 'AI Advisor', icon: Bot },
  { to: '/app/jobs', label: 'Jobs', icon: Briefcase },
  { to: '/app/cv', label: 'CV Builder', icon: FileText },
  { to: '/app/gpa', label: 'GPA / CGPA', icon: Calculator },
  { to: '/app/notes', label: 'Coding Notes', icon: BookOpen },
  { to: '/app/community', label: 'Community', icon: Users },
  { to: '/app/rankings', label: 'Rankings', icon: Trophy },
  { to: '/app/feedback', label: 'Feedback', icon: MessageSquareWarning },
  { to: '/app/profile', label: 'Profile', icon: User },
];
