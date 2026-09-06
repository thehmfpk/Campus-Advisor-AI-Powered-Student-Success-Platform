/** Seed universities (Pakistan-focused, plus a few international). Free data. */
export interface SeedUniversity {
  name: string;
  country: string;
  city?: string;
  type?: string;
  website?: string;
}

export const SEED_UNIVERSITIES: SeedUniversity[] = [
  { name: 'FAST-NUCES', country: 'Pakistan', city: 'Islamabad', type: 'Private' },
  { name: 'NUST', country: 'Pakistan', city: 'Islamabad', type: 'Public' },
  { name: 'LUMS', country: 'Pakistan', city: 'Lahore', type: 'Private' },
  { name: 'COMSATS University', country: 'Pakistan', city: 'Islamabad', type: 'Public' },
  { name: 'University of the Punjab', country: 'Pakistan', city: 'Lahore', type: 'Public' },
  { name: 'GIKI', country: 'Pakistan', city: 'Topi', type: 'Private' },
  { name: 'UET Lahore', country: 'Pakistan', city: 'Lahore', type: 'Public' },
  { name: 'IBA Karachi', country: 'Pakistan', city: 'Karachi', type: 'Public' },
  { name: 'Air University', country: 'Pakistan', city: 'Islamabad', type: 'Public' },
  { name: 'Bahria University', country: 'Pakistan', city: 'Islamabad', type: 'Private' },
];

export const COMMON_DEPARTMENTS = [
  'Computer Science',
  'Software Engineering',
  'Electrical Engineering',
  'Data Science',
  'Business Administration',
  'Mechanical Engineering',
  'Artificial Intelligence',
  'Cyber Security',
];
