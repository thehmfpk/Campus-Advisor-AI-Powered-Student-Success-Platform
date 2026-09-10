/** Seed universities (Pakistan-focused, plus a few international). Free data. */
export interface SeedUniversity {
  name: string;
  country: string;
  city?: string;
  type?: string;
  website?: string;
}

export const SEED_UNIVERSITIES: SeedUniversity[] = [
  // ── Pakistan ──────────────────────────────────────────────────────────
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
  { name: 'Quaid-i-Azam University', country: 'Pakistan', city: 'Islamabad', type: 'Public' },
  { name: 'PIEAS', country: 'Pakistan', city: 'Islamabad', type: 'Public' },
  { name: 'University of Karachi', country: 'Pakistan', city: 'Karachi', type: 'Public' },
  { name: 'NED University of Engineering & Technology', country: 'Pakistan', city: 'Karachi', type: 'Public' },
  { name: 'Aga Khan University', country: 'Pakistan', city: 'Karachi', type: 'Private' },
  { name: 'University of Agriculture, Faisalabad', country: 'Pakistan', city: 'Faisalabad', type: 'Public' },
  { name: 'International Islamic University', country: 'Pakistan', city: 'Islamabad', type: 'Public' },
  { name: 'Government College University Lahore', country: 'Pakistan', city: 'Lahore', type: 'Public' },
  { name: 'University of Management & Technology (UMT)', country: 'Pakistan', city: 'Lahore', type: 'Private' },
  { name: 'Riphah International University', country: 'Pakistan', city: 'Islamabad', type: 'Private' },
  { name: 'Mehran University of Engineering & Technology', country: 'Pakistan', city: 'Jamshoro', type: 'Public' },
  { name: 'University of Peshawar', country: 'Pakistan', city: 'Peshawar', type: 'Public' },
  { name: 'University of Engineering & Technology Peshawar', country: 'Pakistan', city: 'Peshawar', type: 'Public' },
  { name: 'Bahauddin Zakariya University', country: 'Pakistan', city: 'Multan', type: 'Public' },
  { name: 'Islamia University Bahawalpur', country: 'Pakistan', city: 'Bahawalpur', type: 'Public' },
  { name: 'University of Gujrat', country: 'Pakistan', city: 'Gujrat', type: 'Public' },
  { name: 'Sir Syed University of Engineering & Technology', country: 'Pakistan', city: 'Karachi', type: 'Private' },
  { name: 'Institute of Space Technology (IST)', country: 'Pakistan', city: 'Islamabad', type: 'Public' },
  { name: 'Habib University', country: 'Pakistan', city: 'Karachi', type: 'Private' },
  { name: 'University of Balochistan', country: 'Pakistan', city: 'Quetta', type: 'Public' },

  // ── International ─────────────────────────────────────────────────────
  { name: 'Massachusetts Institute of Technology (MIT)', country: 'United States', city: 'Cambridge', type: 'Private' },
  { name: 'Stanford University', country: 'United States', city: 'Stanford', type: 'Private' },
  { name: 'Harvard University', country: 'United States', city: 'Cambridge', type: 'Private' },
  { name: 'University of California, Berkeley', country: 'United States', city: 'Berkeley', type: 'Public' },
  { name: 'Carnegie Mellon University', country: 'United States', city: 'Pittsburgh', type: 'Private' },
  { name: 'University of Oxford', country: 'United Kingdom', city: 'Oxford', type: 'Public' },
  { name: 'University of Cambridge', country: 'United Kingdom', city: 'Cambridge', type: 'Public' },
  { name: 'Imperial College London', country: 'United Kingdom', city: 'London', type: 'Public' },
  { name: 'University College London (UCL)', country: 'United Kingdom', city: 'London', type: 'Public' },
  { name: 'University of Edinburgh', country: 'United Kingdom', city: 'Edinburgh', type: 'Public' },
  { name: 'ETH Zurich', country: 'Switzerland', city: 'Zurich', type: 'Public' },
  { name: 'Technical University of Munich', country: 'Germany', city: 'Munich', type: 'Public' },
  { name: 'National University of Singapore (NUS)', country: 'Singapore', city: 'Singapore', type: 'Public' },
  { name: 'Nanyang Technological University', country: 'Singapore', city: 'Singapore', type: 'Public' },
  { name: 'University of Toronto', country: 'Canada', city: 'Toronto', type: 'Public' },
  { name: 'University of Waterloo', country: 'Canada', city: 'Waterloo', type: 'Public' },
  { name: 'McGill University', country: 'Canada', city: 'Montreal', type: 'Public' },
  { name: 'University of Melbourne', country: 'Australia', city: 'Melbourne', type: 'Public' },
  { name: 'University of Sydney', country: 'Australia', city: 'Sydney', type: 'Public' },
  { name: 'Tsinghua University', country: 'China', city: 'Beijing', type: 'Public' },
  { name: 'Peking University', country: 'China', city: 'Beijing', type: 'Public' },
  { name: 'University of Tokyo', country: 'Japan', city: 'Tokyo', type: 'Public' },
  { name: 'Seoul National University', country: 'South Korea', city: 'Seoul', type: 'Public' },
  { name: 'Indian Institute of Technology Bombay (IIT Bombay)', country: 'India', city: 'Mumbai', type: 'Public' },
  { name: 'Indian Institute of Technology Delhi (IIT Delhi)', country: 'India', city: 'Delhi', type: 'Public' },
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
