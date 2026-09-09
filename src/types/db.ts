/**
 * Hand-written domain types mirroring the Supabase schema
 * (see .kiro/specs/design.md §6 and supabase/migrations).
 * Kept in one place so features and the API layer share one source of truth.
 */

export type Role = 'student' | 'admin';

export interface AppUser {
  id: string;
  email: string;
  role: Role;
  is_disabled: boolean;
  created_at: string;
}

export interface University {
  id: string;
  name: string;
  country: string;
  city: string | null;
  type: string | null;
  website: string | null;
  logo_url: string | null;
}

export interface Department {
  id: string;
  university_id: string | null;
  name: string;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url: string | null;
  roll_number: string | null;
  university_id: string | null;
  university_name: string | null;
  department_id: string | null;
  department_name: string | null;
  semester: number | null;
  skills: string[];
  career_interests: string[];
  bio: string | null;
  academic_info: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export interface StudentSubject {
  id: string;
  profile_id: string;
  subject_name: string;
  credit_hours: number;
  grade: string | null;
  marks: number | null;
  created_at: string;
}

export interface SemesterRecord {
  id: string;
  profile_id: string;
  semester_label: string;
  gpa: number;
  credits: number;
  created_at: string;
}

export type AgentKey = 'academic' | 'career' | 'coding' | 'cv' | 'auto';

export interface AiConversation {
  id: string;
  profile_id: string;
  title: string;
  agent: AgentKey;
  created_at: string;
}

export interface AiMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant' | 'system';
  agent: AgentKey | null;
  content: string;
  meta: Record<string, unknown> | null;
  created_at: string;
}

export type EmploymentType = 'internship' | 'full_time' | 'part_time' | 'contract';

export interface Job {
  id: string;
  title: string;
  company: string;
  location: string | null;
  is_remote: boolean;
  employment_type: EmploymentType;
  required_skills: string[];
  tags: string[];
  experience_level: string | null;
  apply_url: string | null;
  google_url?: string | null;
  posted_date: string | null;
  closes_date?: string | null;
  source: string | null;
  created_at: string;
}

export interface JobMatch {
  score: number;
  explanation: string;
  breakdown: {
    skillOverlap: number;
    departmentRelevance: number;
    interestOverlap: number;
    semesterFit: number;
  };
  matchedSkills: string[];
  missingSkills: string[];
}

export interface CodingNoteSection {
  introduction: string;
  fundamentals: string;
  syntax: string;
  concepts: string;
  examples: string;
  best_practices: string;
  interview_tips: string;
  /** Optional extended sections for longer, deeper notes. */
  deep_dive?: string;
  common_mistakes?: string;
  practice?: string;
}

export interface CodingNote {
  id: string;
  technology: string;
  slug: string;
  title: string;
  sections: CodingNoteSection;
  order: number;
}

export type PostCategory =
  | 'university_problem'
  | 'opportunity'
  | 'scholarship'
  | 'internship'
  | 'event'
  | 'achievement'
  | 'announcement'
  | 'general';

export type PostStatus = 'published' | 'hidden' | 'removed';

export interface Post {
  id: string;
  author_id: string;
  author_name: string;
  author_avatar: string | null;
  university_id: string | null;
  university_name: string | null;
  category: PostCategory;
  content: string;
  image_url: string | null;
  status: PostStatus;
  likes_count: number;
  comments_count: number;
  liked_by_me?: boolean;
  created_at: string;
}

export interface Comment {
  id: string;
  post_id: string;
  author_id: string;
  author_name: string;
  content: string;
  status: PostStatus;
  created_at: string;
}

export type ReportStatus = 'open' | 'reviewed' | 'actioned' | 'dismissed';

export interface PostReport {
  id: string;
  post_id: string;
  reporter_id: string;
  reason: string;
  status: ReportStatus;
  created_at: string;
}

export type FeedbackCategory =
  | 'teachers'
  | 'staff'
  | 'facilities'
  | 'academics'
  | 'administration'
  | 'other';

export interface UniversityFeedback {
  id: string;
  profile_id: string;
  university_id: string | null;
  university_name: string | null;
  category: FeedbackCategory;
  rating: number;
  feedback: string;
  semester: string | null;
  department: string | null;
  created_at: string;
}

export type PortalFeedbackType = 'bug' | 'ux' | 'general';

export interface PortalFeedback {
  id: string;
  profile_id: string;
  type: PortalFeedbackType;
  message: string;
  created_at: string;
}

export type FeatureStatus = 'open' | 'planned' | 'in_progress' | 'completed' | 'rejected';
export type FeaturePriority = 'low' | 'medium' | 'high';

export interface FeatureRequest {
  id: string;
  profile_id: string;
  title: string;
  description: string;
  category: string | null;
  priority: FeaturePriority;
  status: FeatureStatus;
  created_at: string;
}

export interface RankingRecord {
  id: string;
  university_name: string;
  country: string;
  position: number;
  source: string;
  year: number;
  category: string;
}

export interface CvProfile {
  id: string;
  profile_id: string;
  template: string;
  headline: string | null;
  summary: string | null;
  personal: {
    full_name?: string;
    email?: string;
    phone?: string;
    location?: string;
  } | null;
  skills: string[];
  languages: string[];
  links: { label: string; url: string }[];
  certifications: { name: string; issuer?: string; year?: string }[];
  achievements: string[];
  education: CvEducation[];
  experience: CvExperience[];
  projects: CvProject[];
}

export interface CvEducation {
  institution: string;
  degree: string;
  start: string;
  end: string;
  grade?: string;
}

export interface CvExperience {
  title: string;
  org: string;
  start: string;
  end: string;
  bullets: string[];
}

export interface CvProject {
  name: string;
  description: string;
  tech: string[];
  link?: string;
}
