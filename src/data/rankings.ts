/**
 * Seed ranking records. Every record carries an explicit source + year (R14).
 * These are illustrative seed values for the MVP demo and should be verified
 * against the cited source before being presented as authoritative. The UI
 * always shows the source and year so users can verify. No positions are
 * invented without a stated source/category.
 */
export interface SeedRanking {
  university_name: string;
  country: string;
  position: number;
  source: string;
  year: number;
  category: string;
}

const HEC = 'HEC Pakistan (national, general category)';
const QS = 'QS World University Rankings';

// Pakistan — national ranking (illustrative order; verify with HEC).
const PAKISTAN: SeedRanking[] = [
  'National University of Sciences & Technology (NUST)',
  'Quaid-i-Azam University',
  'LUMS (Lahore University of Management Sciences)',
  'University of the Punjab',
  'COMSATS University Islamabad',
  'FAST-NUCES',
  'University of Agriculture, Faisalabad',
  'Aga Khan University',
  'University of Engineering & Technology (UET) Lahore',
  'GIKI (Ghulam Ishaq Khan Institute)',
  'University of Karachi',
  'Pakistan Institute of Engineering & Applied Sciences (PIEAS)',
  'International Islamic University Islamabad',
  'University of Peshawar',
  'Bahauddin Zakariya University',
  'University of Health Sciences Lahore',
  'NED University of Engineering & Technology',
  'Government College University Lahore',
  'University of Sargodha',
  'Air University',
  'Bahria University',
  'Institute of Business Administration (IBA) Karachi',
  'University of Management & Technology (UMT)',
  'Riphah International University',
  'Mehran University of Engineering & Technology',
  'University of Gujrat',
  'Islamia University Bahawalpur',
  'University of Malakand',
  'Hazara University',
  'University of Balochistan',
].map((name, i) => ({
  university_name: name,
  country: 'Pakistan',
  position: i + 1,
  source: HEC,
  year: 2023,
  category: 'National',
}));

// International — QS World University Rankings (illustrative positions; verify).
const INTERNATIONAL: SeedRanking[] = [
  ['Massachusetts Institute of Technology (MIT)', 'United States', 1],
  ['Imperial College London', 'United Kingdom', 2],
  ['University of Oxford', 'United Kingdom', 3],
  ['Harvard University', 'United States', 4],
  ['University of Cambridge', 'United Kingdom', 5],
  ['Stanford University', 'United States', 6],
  ['ETH Zurich', 'Switzerland', 7],
  ['National University of Singapore (NUS)', 'Singapore', 8],
  ['UCL (University College London)', 'United Kingdom', 9],
  ['California Institute of Technology (Caltech)', 'United States', 10],
  ['University of Toronto', 'Canada', 21],
  ['University of Melbourne', 'Australia', 13],
  ['Tsinghua University', 'China', 20],
  ['University of Tokyo', 'Japan', 32],
  ['National University of Sciences & Technology (NUST)', 'Pakistan', 371],
  ['Quaid-i-Azam University', 'Pakistan', 401],
  ['University of the Punjab', 'Pakistan', 651],
  ['LUMS (Lahore University of Management Sciences)', 'Pakistan', 691],
].map(([name, country, position]) => ({
  university_name: name as string,
  country: country as string,
  position: position as number,
  source: QS,
  year: 2025,
  category: 'World',
}));

// Asia regional (illustrative subset; verify with QS Asia).
const ASIA: SeedRanking[] = [
  ['National University of Singapore (NUS)', 'Singapore', 1],
  ['Peking University', 'China', 2],
  ['University of Hong Kong', 'Hong Kong', 3],
  ['Nanyang Technological University', 'Singapore', 4],
  ['Tsinghua University', 'China', 5],
  ['National University of Sciences & Technology (NUST)', 'Pakistan', 101],
].map(([name, country, position]) => ({
  university_name: name as string,
  country: country as string,
  position: position as number,
  source: 'QS Asia University Rankings',
  year: 2025,
  category: 'Asia',
}));

export const SEED_RANKINGS: SeedRanking[] = [...PAKISTAN, ...INTERNATIONAL, ...ASIA];
