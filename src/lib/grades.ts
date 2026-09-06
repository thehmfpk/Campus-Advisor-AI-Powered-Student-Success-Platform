/**
 * GPA / CGPA math (R9). Pure and deterministic so it is fully unit-testable
 * and free of any external dependency. Default scale = HEC 4.0.
 *
 * Grade → grade-point mappings are configurable via GradeScale.
 */

export interface GradeScale {
  id: string;
  label: string;
  /** Uppercased letter grade → grade point (0..max). */
  points: Record<string, number>;
  max: number;
}

/** HEC-style 4.0 scale (common in Pakistani universities). */
export const HEC_4_0: GradeScale = {
  id: 'hec-4.0',
  label: 'HEC 4.0',
  max: 4.0,
  points: {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.67,
    'B+': 3.33,
    B: 3.0,
    'B-': 2.67,
    'C+': 2.33,
    C: 2.0,
    'C-': 1.67,
    'D+': 1.33,
    D: 1.0,
    F: 0.0,
  },
};

export const SCALES: GradeScale[] = [HEC_4_0];

export interface CourseInput {
  name?: string;
  creditHours: number;
  grade: string;
}

export interface GpaResultRow {
  name?: string;
  creditHours: number;
  grade: string;
  gradePoint: number;
  qualityPoints: number;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
  totalQualityPoints: number;
  rows: GpaResultRow[];
}

export class GradeError extends Error {}

/** Compute a weighted GPA from courses. Throws GradeError on invalid input. */
export function computeGpa(courses: CourseInput[], scale: GradeScale = HEC_4_0): GpaResult {
  if (courses.length === 0) {
    return { gpa: 0, totalCredits: 0, totalQualityPoints: 0, rows: [] };
  }
  const rows: GpaResultRow[] = [];
  let totalCredits = 0;
  let totalQualityPoints = 0;

  for (const c of courses) {
    if (!Number.isFinite(c.creditHours) || c.creditHours < 0) {
      throw new GradeError(`Invalid credit hours for "${c.name ?? 'course'}"`);
    }
    const key = c.grade.trim().toUpperCase();
    const gp = scale.points[key];
    if (gp === undefined) {
      throw new GradeError(`Unknown grade "${c.grade}" for ${scale.label}`);
    }
    const qp = round2(gp * c.creditHours);
    rows.push({
      name: c.name,
      creditHours: c.creditHours,
      grade: key,
      gradePoint: gp,
      qualityPoints: qp,
    });
    totalCredits += c.creditHours;
    totalQualityPoints += gp * c.creditHours;
  }

  const gpa = totalCredits === 0 ? 0 : round2(totalQualityPoints / totalCredits);
  return {
    gpa,
    totalCredits: round2(totalCredits),
    totalQualityPoints: round2(totalQualityPoints),
    rows,
  };
}

export interface SemesterInput {
  label?: string;
  gpa: number;
  credits: number;
}

export interface CgpaResult {
  cgpa: number;
  totalCredits: number;
}

/**
 * Compute CGPA as the credit-weighted average of semester GPAs (R9).
 * Throws GradeError on invalid input.
 */
export function computeCgpa(semesters: SemesterInput[], max = HEC_4_0.max): CgpaResult {
  if (semesters.length === 0) return { cgpa: 0, totalCredits: 0 };
  let totalCredits = 0;
  let weighted = 0;
  for (const s of semesters) {
    if (!Number.isFinite(s.gpa) || s.gpa < 0 || s.gpa > max) {
      throw new GradeError(`Invalid GPA "${s.gpa}" (must be 0–${max})`);
    }
    if (!Number.isFinite(s.credits) || s.credits < 0) {
      throw new GradeError(`Invalid credits "${s.credits}"`);
    }
    totalCredits += s.credits;
    weighted += s.gpa * s.credits;
  }
  const cgpa = totalCredits === 0 ? 0 : round2(weighted / totalCredits);
  return { cgpa, totalCredits: round2(totalCredits) };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}
