import { describe, expect, it } from 'vitest';
import { computeMatch } from './matching';
import type { Job } from '@/types/db';

const job: Job = {
  id: '1',
  title: 'Frontend Intern',
  company: 'Acme',
  location: 'Remote',
  is_remote: true,
  employment_type: 'internship',
  required_skills: ['HTML', 'CSS', 'JavaScript', 'React'],
  tags: ['frontend', 'web', 'computer science'],
  experience_level: 'Student',
  apply_url: '#',
  posted_date: '2026-01-01',
  source: 'seed',
  created_at: '2026-01-01',
};

describe('computeMatch', () => {
  it('scores a strong match high', () => {
    const m = computeMatch(
      {
        skills: ['HTML', 'CSS', 'JavaScript', 'React'],
        career_interests: ['Frontend'],
        department_name: 'Computer Science',
        semester: 5,
      },
      job,
    );
    expect(m.score).toBeGreaterThanOrEqual(80);
    expect(m.matchedSkills).toHaveLength(4);
    expect(m.missingSkills).toHaveLength(0);
  });

  it('is deterministic (same inputs → same score)', () => {
    const input = {
      skills: ['HTML', 'React'],
      career_interests: ['Frontend'],
      department_name: 'Computer Science',
      semester: 5,
    };
    expect(computeMatch(input, job).score).toBe(computeMatch(input, job).score);
  });

  it('scores a poor match low and lists missing skills', () => {
    const m = computeMatch(
      { skills: ['Photoshop'], career_interests: ['Design'], department_name: 'Fine Arts', semester: 2 },
      job,
    );
    expect(m.score).toBeLessThan(40);
    expect(m.missingSkills.length).toBeGreaterThan(0);
  });

  it('is case-insensitive on skills', () => {
    const m = computeMatch(
      { skills: ['html', 'css', 'javascript', 'react'], career_interests: [], department_name: null, semester: 5 },
      job,
    );
    expect(m.matchedSkills).toHaveLength(4);
  });
});
