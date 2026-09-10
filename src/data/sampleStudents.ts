/**
 * Bundled sample (demo) student profiles so the Admin "Students" list is never
 * empty, even before the database has real signups or is seeded. Clearly
 * labeled placeholders (not real people). Real students always take precedence.
 */
export interface SampleStudent {
  id: string;
  user_id: string;
  full_name: string;
  roll_number: string;
  university_name: string;
  department_name: string;
  semester: number;
}

export const SAMPLE_STUDENTS: SampleStudent[] = [
  { id: 'sample-1', user_id: 'sample-1', full_name: 'Demo Student — Ayesha Khan', roll_number: 'BSCS-F22-045', university_name: 'NUST', department_name: 'Computer Science', semester: 4 },
  { id: 'sample-2', user_id: 'sample-2', full_name: 'Demo Student — Bilal Ahmed', roll_number: 'BSSE-F21-118', university_name: 'FAST-NUCES', department_name: 'Software Engineering', semester: 6 },
  { id: 'sample-3', user_id: 'sample-3', full_name: 'Demo Student — Fatima Riaz', roll_number: 'BSCS-F23-009', university_name: 'LUMS', department_name: 'Computer Science', semester: 2 },
  { id: 'sample-4', user_id: 'sample-4', full_name: 'Demo Student — Hamza Sheikh', roll_number: 'BSEE-F20-201', university_name: 'UET Lahore', department_name: 'Electrical Engineering', semester: 8 },
  { id: 'sample-5', user_id: 'sample-5', full_name: 'Demo Student — Sana Malik', roll_number: 'BSCY-F22-076', university_name: 'Air University', department_name: 'Cyber Security', semester: 5 },
  { id: 'sample-6', user_id: 'sample-6', full_name: 'Demo Student — Usman Tariq', roll_number: 'BSIT-F21-133', university_name: 'COMSATS University', department_name: 'Data Science', semester: 6 },
  { id: 'sample-7', user_id: 'sample-7', full_name: 'Demo Student — Zainab Hussain', roll_number: 'BBA-F22-058', university_name: 'IBA Karachi', department_name: 'Business Administration', semester: 4 },
  { id: 'sample-8', user_id: 'sample-8', full_name: 'Demo Student — Ali Raza', roll_number: 'BSAI-F23-014', university_name: 'GIKI', department_name: 'Artificial Intelligence', semester: 2 },
];
