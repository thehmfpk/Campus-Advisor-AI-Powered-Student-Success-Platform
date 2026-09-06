import type { EmploymentType } from '@/types/db';

/**
 * Curated seed jobs dataset (R6/§8). No scraping, no paid API. Realistic roles
 * for Pakistani students + remote roles. Consumed via the SeedJobsAdapter.
 */
export interface SeedJob {
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  employment_type: EmploymentType;
  required_skills: string[];
  tags: string[];
  experience_level: string;
  apply_url: string;
  posted_date: string;
  source: string;
}

export const SEED_JOBS: SeedJob[] = [
  {
    title: 'Frontend Developer Intern',
    company: 'Systems Limited',
    location: 'Lahore, Pakistan',
    is_remote: false,
    employment_type: 'internship',
    required_skills: ['HTML', 'CSS', 'JavaScript', 'React'],
    tags: ['frontend', 'web', 'computer science', 'software engineering'],
    experience_level: 'Entry / Student',
    apply_url: 'https://example.com/apply/frontend-intern',
    posted_date: '2026-08-20',
    source: 'Curated seed dataset',
  },
  {
    title: 'Junior Backend Engineer',
    company: 'Devsinc',
    location: 'Remote (Pakistan)',
    is_remote: true,
    employment_type: 'full_time',
    required_skills: ['Node.js', 'SQL', 'JavaScript', 'Git'],
    tags: ['backend', 'api', 'computer science', 'software engineering'],
    experience_level: '0-1 years',
    apply_url: 'https://example.com/apply/junior-backend',
    posted_date: '2026-08-25',
    source: 'Curated seed dataset',
  },
  {
    title: 'Data Science Intern',
    company: 'Afiniti',
    location: 'Karachi, Pakistan',
    is_remote: false,
    employment_type: 'internship',
    required_skills: ['Python', 'SQL', 'Statistics', 'Pandas'],
    tags: ['data science', 'ml', 'analytics', 'artificial intelligence'],
    experience_level: 'Student',
    apply_url: 'https://example.com/apply/ds-intern',
    posted_date: '2026-08-18',
    source: 'Curated seed dataset',
  },
  {
    title: 'React Native Developer',
    company: 'VentureDive',
    location: 'Remote',
    is_remote: true,
    employment_type: 'contract',
    required_skills: ['React', 'JavaScript', 'React Native', 'Git'],
    tags: ['mobile', 'frontend', 'software engineering'],
    experience_level: '1-2 years',
    apply_url: 'https://example.com/apply/react-native',
    posted_date: '2026-08-28',
    source: 'Curated seed dataset',
  },
  {
    title: 'Machine Learning Engineer (Junior)',
    company: 'Techlogix',
    location: 'Islamabad, Pakistan',
    is_remote: false,
    employment_type: 'full_time',
    required_skills: ['Python', 'Machine Learning', 'SQL', 'Data Structures'],
    tags: ['ml', 'ai', 'data science', 'artificial intelligence'],
    experience_level: '0-2 years',
    apply_url: 'https://example.com/apply/ml-engineer',
    posted_date: '2026-08-22',
    source: 'Curated seed dataset',
  },
  {
    title: 'Full-Stack Developer Intern',
    company: 'Arbisoft',
    location: 'Lahore, Pakistan',
    is_remote: false,
    employment_type: 'internship',
    required_skills: ['JavaScript', 'React', 'Node.js', 'SQL'],
    tags: ['fullstack', 'web', 'computer science', 'software engineering'],
    experience_level: 'Student',
    apply_url: 'https://example.com/apply/fullstack-intern',
    posted_date: '2026-08-30',
    source: 'Curated seed dataset',
  },
  {
    title: 'QA Engineer (Part-time)',
    company: '10Pearls',
    location: 'Remote (Pakistan)',
    is_remote: true,
    employment_type: 'part_time',
    required_skills: ['Testing', 'JavaScript', 'Git'],
    tags: ['qa', 'testing', 'software engineering'],
    experience_level: 'Entry',
    apply_url: 'https://example.com/apply/qa-part-time',
    posted_date: '2026-08-15',
    source: 'Curated seed dataset',
  },
  {
    title: 'Cyber Security Analyst Intern',
    company: 'Trillium',
    location: 'Islamabad, Pakistan',
    is_remote: false,
    employment_type: 'internship',
    required_skills: ['Networking', 'Linux', 'Python', 'Security'],
    tags: ['security', 'cyber security', 'infosec'],
    experience_level: 'Student',
    apply_url: 'https://example.com/apply/security-intern',
    posted_date: '2026-08-12',
    source: 'Curated seed dataset',
  },
];
