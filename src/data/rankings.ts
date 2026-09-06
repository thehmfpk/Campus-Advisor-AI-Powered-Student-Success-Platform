/**
 * Seed ranking records. Every record carries an explicit source + year (R14).
 * These are illustrative seed values for the MVP demo and MUST be verified
 * against the cited source before being presented as authoritative. The UI
 * always shows the source and year so users can verify.
 */
export interface SeedRanking {
  university_name: string;
  country: string;
  position: number;
  source: string;
  year: number;
  category: string;
}

export const SEED_RANKINGS: SeedRanking[] = [
  // Pakistan — HEC category (illustrative; verify with HEC before citing).
  { university_name: 'NUST', country: 'Pakistan', position: 1, source: 'HEC Pakistan (national, general category)', year: 2023, category: 'National' },
  { university_name: 'LUMS', country: 'Pakistan', position: 2, source: 'HEC Pakistan (national, general category)', year: 2023, category: 'National' },
  { university_name: 'University of the Punjab', country: 'Pakistan', position: 3, source: 'HEC Pakistan (national, general category)', year: 2023, category: 'National' },
  { university_name: 'FAST-NUCES', country: 'Pakistan', position: 4, source: 'HEC Pakistan (national, general category)', year: 2023, category: 'National' },
  { university_name: 'COMSATS University', country: 'Pakistan', position: 5, source: 'HEC Pakistan (national, general category)', year: 2023, category: 'National' },

  // International — QS World University Rankings (illustrative positions; verify).
  { university_name: 'Massachusetts Institute of Technology (MIT)', country: 'United States', position: 1, source: 'QS World University Rankings', year: 2025, category: 'World' },
  { university_name: 'Imperial College London', country: 'United Kingdom', position: 2, source: 'QS World University Rankings', year: 2025, category: 'World' },
  { university_name: 'University of Oxford', country: 'United Kingdom', position: 3, source: 'QS World University Rankings', year: 2025, category: 'World' },
  { university_name: 'Stanford University', country: 'United States', position: 6, source: 'QS World University Rankings', year: 2025, category: 'World' },
  { university_name: 'National University of Singapore (NUS)', country: 'Singapore', position: 8, source: 'QS World University Rankings', year: 2025, category: 'World' },
  { university_name: 'NUST', country: 'Pakistan', position: 371, source: 'QS World University Rankings', year: 2025, category: 'World' },
  { university_name: 'Quaid-i-Azam University', country: 'Pakistan', position: 401, source: 'QS World University Rankings', year: 2025, category: 'World' },
];
