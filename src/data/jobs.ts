import type { EmploymentType } from '@/types/db';

/**
 * Curated seed jobs dataset (R6/§8). No scraping, no paid API.
 *
 * Apply links are REAL, working search URLs on LinkedIn Jobs and Google Jobs,
 * built from the job title + location. Clicking "Apply" always opens a live,
 * relevant listings page the student can act on — legal and always functional
 * (we never fabricate a private/expired posting URL).
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
  apply_url: string; // primary: LinkedIn Jobs search
  google_url: string; // secondary: Google Jobs search
  posted_date: string;
  closes_date: string; // application closing date
  source: string;
}

/** Build a real LinkedIn Jobs search URL for a role + location. */
export function linkedInSearchUrl(title: string, location = 'Pakistan'): string {
  const kw = encodeURIComponent(title);
  const loc = encodeURIComponent(location);
  return `https://www.linkedin.com/jobs/search/?keywords=${kw}&location=${loc}`;
}

/** Build a real Google Jobs search URL for a role + location. */
export function googleJobsUrl(title: string, location = 'Pakistan'): string {
  const q = encodeURIComponent(`${title} jobs ${location}`);
  return `https://www.google.com/search?q=${q}&ibp=htl;jobs`;
}

interface RawJob {
  title: string;
  company: string;
  location: string;
  is_remote: boolean;
  employment_type: EmploymentType;
  required_skills: string[];
  tags: string[];
  experience_level: string;
  posted_date: string;
}

/** Closing date = posted date + N days (varies a little per role for realism). */
function closingDate(posted: string, addDays: number): string {
  const d = new Date(posted);
  d.setDate(d.getDate() + addDays);
  return d.toISOString().slice(0, 10);
}

const RAW_JOBS: RawJob[] = [
  { title: 'Frontend Developer Intern', company: 'Systems Limited', location: 'Lahore, Pakistan', is_remote: false, employment_type: 'internship', required_skills: ['HTML', 'CSS', 'JavaScript', 'React'], tags: ['frontend', 'web', 'computer science', 'software engineering'], experience_level: 'Entry / Student', posted_date: '2026-08-20' },
  { title: 'Junior Backend Engineer', company: 'Devsinc', location: 'Remote (Pakistan)', is_remote: true, employment_type: 'full_time', required_skills: ['Node.js', 'SQL', 'JavaScript', 'Git'], tags: ['backend', 'api', 'computer science', 'software engineering'], experience_level: '0-1 years', posted_date: '2026-08-25' },
  { title: 'Data Science Intern', company: 'Afiniti', location: 'Karachi, Pakistan', is_remote: false, employment_type: 'internship', required_skills: ['Python', 'SQL', 'Statistics', 'Pandas'], tags: ['data science', 'ml', 'analytics', 'artificial intelligence'], experience_level: 'Student', posted_date: '2026-08-18' },
  { title: 'React Native Developer', company: 'VentureDive', location: 'Remote', is_remote: true, employment_type: 'contract', required_skills: ['React', 'JavaScript', 'React Native', 'Git'], tags: ['mobile', 'frontend', 'software engineering'], experience_level: '1-2 years', posted_date: '2026-08-28' },
  { title: 'Machine Learning Engineer', company: 'Techlogix', location: 'Islamabad, Pakistan', is_remote: false, employment_type: 'full_time', required_skills: ['Python', 'Machine Learning', 'SQL', 'Data Structures'], tags: ['ml', 'ai', 'data science', 'artificial intelligence'], experience_level: '0-2 years', posted_date: '2026-08-22' },
  { title: 'Full Stack Developer Intern', company: 'Arbisoft', location: 'Lahore, Pakistan', is_remote: false, employment_type: 'internship', required_skills: ['JavaScript', 'React', 'Node.js', 'SQL'], tags: ['fullstack', 'web', 'computer science', 'software engineering'], experience_level: 'Student', posted_date: '2026-08-30' },
  { title: 'QA Engineer', company: '10Pearls', location: 'Remote (Pakistan)', is_remote: true, employment_type: 'part_time', required_skills: ['Testing', 'JavaScript', 'Git'], tags: ['qa', 'testing', 'software engineering'], experience_level: 'Entry', posted_date: '2026-08-15' },
  { title: 'Cyber Security Analyst Intern', company: 'Trillium', location: 'Islamabad, Pakistan', is_remote: false, employment_type: 'internship', required_skills: ['Networking', 'Linux', 'Python', 'Security'], tags: ['security', 'cyber security', 'infosec'], experience_level: 'Student', posted_date: '2026-08-12' },
  { title: 'Python Developer', company: 'Contour Software', location: 'Karachi, Pakistan', is_remote: false, employment_type: 'full_time', required_skills: ['Python', 'SQL', 'Django', 'Git'], tags: ['backend', 'python', 'software engineering'], experience_level: '1-3 years', posted_date: '2026-09-01' },
  { title: 'UI/UX Design Intern', company: 'Bramerz', location: 'Lahore, Pakistan', is_remote: false, employment_type: 'internship', required_skills: ['Figma', 'UI Design', 'Prototyping'], tags: ['design', 'ui', 'ux'], experience_level: 'Student', posted_date: '2026-08-27' },
  { title: 'DevOps Intern', company: 'NETSOL Technologies', location: 'Lahore, Pakistan', is_remote: false, employment_type: 'internship', required_skills: ['Linux', 'Docker', 'Git', 'CI/CD'], tags: ['devops', 'cloud', 'software engineering'], experience_level: 'Student', posted_date: '2026-08-24' },
  { title: 'Junior Data Analyst', company: 'S&P Global', location: 'Islamabad, Pakistan', is_remote: false, employment_type: 'full_time', required_skills: ['SQL', 'Excel', 'Python', 'Statistics'], tags: ['data', 'analytics', 'data science'], experience_level: '0-1 years', posted_date: '2026-09-02' },
  { title: 'Flutter Developer', company: 'Cubix', location: 'Remote', is_remote: true, employment_type: 'full_time', required_skills: ['Flutter', 'Dart', 'Git'], tags: ['mobile', 'software engineering'], experience_level: '1-2 years', posted_date: '2026-08-19' },
  { title: 'Software Engineering Intern', company: 'Educative', location: 'Remote (Pakistan)', is_remote: true, employment_type: 'internship', required_skills: ['Data Structures', 'Algorithms', 'JavaScript', 'Git'], tags: ['software engineering', 'computer science'], experience_level: 'Student', posted_date: '2026-09-03' },
  { title: 'Cloud Engineer (AWS)', company: 'Systems Limited', location: 'Lahore, Pakistan', is_remote: false, employment_type: 'full_time', required_skills: ['AWS', 'Linux', 'Docker', 'Networking'], tags: ['cloud', 'devops', 'aws'], experience_level: '1-3 years', posted_date: '2026-08-29' },
  { title: 'Business Analyst Intern', company: 'Abacus Consulting', location: 'Islamabad, Pakistan', is_remote: false, employment_type: 'internship', required_skills: ['Excel', 'SQL', 'Communication'], tags: ['business', 'analytics'], experience_level: 'Student', posted_date: '2026-08-16' },
];

export const SEED_JOBS: SeedJob[] = RAW_JOBS.map((j, i) => ({
  ...j,
  apply_url: linkedInSearchUrl(j.title, j.is_remote ? 'Pakistan' : j.location),
  google_url: googleJobsUrl(j.title, j.is_remote ? 'Pakistan' : j.location),
  closes_date: closingDate(j.posted_date, 21 + (i % 4) * 7), // 21–42 days after posting
  source: 'Curated · apply via LinkedIn/Google Jobs',
}));
