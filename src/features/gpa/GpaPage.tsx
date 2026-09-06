import { useMemo, useState } from 'react';
import { Plus, Trash2, Calculator } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Button, Card, CardBody, CardHeader, Input, Select } from '@/components/ui';
import {
  computeCgpa,
  computeGpa,
  GradeError,
  HEC_4_0,
  type CourseInput,
  type SemesterInput,
} from '@/lib/grades';

const GRADES = Object.keys(HEC_4_0.points);

function GpaCalculator() {
  const [courses, setCourses] = useState<CourseInput[]>([
    { name: '', creditHours: 3, grade: 'A' },
    { name: '', creditHours: 3, grade: 'B+' },
  ]);

  const result = useMemo(() => {
    try {
      return { ok: true as const, value: computeGpa(courses) };
    } catch (e) {
      return { ok: false as const, error: e instanceof GradeError ? e.message : 'Invalid input' };
    }
  }, [courses]);

  const update = (i: number, patch: Partial<CourseInput>) =>
    setCourses((c) => c.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  return (
    <Card>
      <CardHeader title="Semester GPA" subtitle="HEC 4.0 scale · credit-weighted average" />
      <CardBody className="space-y-3">
        {courses.map((c, i) => (
          <div key={i} className="grid items-end gap-2 sm:grid-cols-[1fr_90px_90px_auto]">
            <Input
              label={i === 0 ? 'Subject' : undefined}
              placeholder="e.g. Data Structures"
              value={c.name}
              onChange={(e) => update(i, { name: e.target.value })}
            />
            <Input
              label={i === 0 ? 'Credits' : undefined}
              type="number"
              min={0}
              max={6}
              value={c.creditHours}
              onChange={(e) => update(i, { creditHours: Number(e.target.value) })}
            />
            <Select
              label={i === 0 ? 'Grade' : undefined}
              value={c.grade}
              onChange={(e) => update(i, { grade: e.target.value })}
            >
              {GRADES.map((g) => (
                <option key={g}>{g}</option>
              ))}
            </Select>
            <button
              onClick={() => setCourses((cs) => cs.filter((_, idx) => idx !== i))}
              className="mb-2 text-muted hover:text-danger"
              aria-label="Remove course"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setCourses((c) => [...c, { name: '', creditHours: 3, grade: 'A' }])}
        >
          <Plus className="h-4 w-4" /> Add course
        </Button>

        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
          {result.ok ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">Semester GPA</span>
                <span className="text-2xl font-bold text-brand">{result.value.gpa.toFixed(2)}</span>
              </div>
              <p className="mt-2 text-xs text-muted">
                {result.value.totalQualityPoints.toFixed(2)} quality points ÷{' '}
                {result.value.totalCredits} credit hours = {result.value.gpa.toFixed(2)}
              </p>
            </>
          ) : (
            <p className="text-sm text-danger">{result.error}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

function CgpaCalculator() {
  const [semesters, setSemesters] = useState<SemesterInput[]>([
    { label: 'Semester 1', gpa: 3.4, credits: 15 },
    { label: 'Semester 2', gpa: 3.6, credits: 16 },
  ]);

  const result = useMemo(() => {
    try {
      return { ok: true as const, value: computeCgpa(semesters) };
    } catch (e) {
      return { ok: false as const, error: e instanceof GradeError ? e.message : 'Invalid input' };
    }
  }, [semesters]);

  const update = (i: number, patch: Partial<SemesterInput>) =>
    setSemesters((s) => s.map((row, idx) => (idx === i ? { ...row, ...patch } : row)));

  return (
    <Card>
      <CardHeader title="Cumulative CGPA" subtitle="Weighted across all semesters" />
      <CardBody className="space-y-3">
        {semesters.map((s, i) => (
          <div key={i} className="grid items-end gap-2 sm:grid-cols-[1fr_100px_100px_auto]">
            <Input
              label={i === 0 ? 'Semester' : undefined}
              value={s.label}
              onChange={(e) => update(i, { label: e.target.value })}
            />
            <Input
              label={i === 0 ? 'GPA' : undefined}
              type="number"
              step="0.01"
              min={0}
              max={4}
              value={s.gpa}
              onChange={(e) => update(i, { gpa: Number(e.target.value) })}
            />
            <Input
              label={i === 0 ? 'Credits' : undefined}
              type="number"
              min={0}
              value={s.credits}
              onChange={(e) => update(i, { credits: Number(e.target.value) })}
            />
            <button
              onClick={() => setSemesters((ss) => ss.filter((_, idx) => idx !== i))}
              className="mb-2 text-muted hover:text-danger"
              aria-label="Remove semester"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        <Button
          variant="secondary"
          size="sm"
          onClick={() =>
            setSemesters((s) => [
              ...s,
              { label: `Semester ${s.length + 1}`, gpa: 3.5, credits: 15 },
            ])
          }
        >
          <Plus className="h-4 w-4" /> Add semester
        </Button>

        <div className="mt-4 rounded-xl border border-border bg-surface-2 p-4">
          {result.ok ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">CGPA</span>
                <span className="text-2xl font-bold text-accent">
                  {result.value.cgpa.toFixed(2)}
                </span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Credit-weighted average across {result.value.totalCredits} total credit hours.
              </p>
            </>
          ) : (
            <p className="text-sm text-danger">{result.error}</p>
          )}
        </div>
      </CardBody>
    </Card>
  );
}

export default function GpaPage() {
  return (
    <div>
      <PageHeader
        title="GPA & CGPA Calculator"
        description="Accurate, transparent calculations on the HEC 4.0 scale."
        action={<Badge tone="brand"><Calculator className="h-3 w-3" /> HEC 4.0</Badge>}
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <GpaCalculator />
        <CgpaCalculator />
      </div>
    </div>
  );
}
