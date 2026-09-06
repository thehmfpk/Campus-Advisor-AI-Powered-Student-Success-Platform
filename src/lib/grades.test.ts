import { describe, expect, it } from 'vitest';
import { computeGpa, computeCgpa, GradeError, HEC_4_0 } from './grades';

describe('computeGpa (HEC 4.0)', () => {
  it('computes weighted GPA correctly', () => {
    const res = computeGpa([
      { name: 'DS', creditHours: 3, grade: 'A' }, // 4.0 * 3 = 12
      { name: 'DB', creditHours: 3, grade: 'B+' }, // 3.33 * 3 = 9.99
      { name: 'OS', creditHours: 4, grade: 'B' }, // 3.0 * 4 = 12
    ]);
    expect(res.totalCredits).toBe(10);
    // (12 + 9.99 + 12) / 10 = 3.399 → 3.40
    expect(res.gpa).toBeCloseTo(3.4, 2);
  });

  it('returns zero for no courses', () => {
    expect(computeGpa([]).gpa).toBe(0);
  });

  it('handles a perfect 4.0', () => {
    const res = computeGpa([
      { creditHours: 3, grade: 'A' },
      { creditHours: 3, grade: 'A+' },
    ]);
    expect(res.gpa).toBe(4);
  });

  it('rejects unknown grades', () => {
    expect(() => computeGpa([{ creditHours: 3, grade: 'Z' }])).toThrow(GradeError);
  });

  it('rejects negative credit hours', () => {
    expect(() => computeGpa([{ creditHours: -1, grade: 'A' }])).toThrow(GradeError);
  });

  it('is case-insensitive for grades', () => {
    const res = computeGpa([{ creditHours: 3, grade: 'a-' }]);
    expect(res.gpa).toBe(HEC_4_0.points['A-']);
  });
});

describe('computeCgpa', () => {
  it('computes credit-weighted CGPA', () => {
    const res = computeCgpa([
      { gpa: 3.5, credits: 15 }, // 52.5
      { gpa: 3.7, credits: 16 }, // 59.2
    ]);
    // 111.7 / 31 = 3.6032 → 3.6
    expect(res.totalCredits).toBe(31);
    expect(res.cgpa).toBeCloseTo(3.6, 2);
  });

  it('returns zero for no semesters', () => {
    expect(computeCgpa([]).cgpa).toBe(0);
  });

  it('rejects GPA above scale max', () => {
    expect(() => computeCgpa([{ gpa: 4.5, credits: 15 }])).toThrow(GradeError);
  });

  it('rejects negative credits', () => {
    expect(() => computeCgpa([{ gpa: 3, credits: -5 }])).toThrow(GradeError);
  });
});
