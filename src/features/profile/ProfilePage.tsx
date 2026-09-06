import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, GraduationCap, Save } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import {
  Avatar,
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Skeleton,
  Textarea,
} from '@/components/ui';
import { HEC_4_0 } from '@/lib/grades';
import { profileCompletion } from './completion';
import {
  useProfile,
  useSubjects,
  useUpdateProfile,
  useAddSubject,
  useDeleteSubject,
} from './useProfile';

const MAX_SUBJECTS = 7;
const GRADES = Object.keys(HEC_4_0.points);

function TagInput({
  label,
  values,
  onChange,
  placeholder,
}: {
  label: string;
  values: string[];
  onChange: (v: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState('');
  const add = () => {
    const v = draft.trim();
    if (v && !values.includes(v)) onChange([...values, v]);
    setDraft('');
  };
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium text-fg">{label}</label>
      <div className="flex flex-wrap gap-2">
        {values.map((v) => (
          <Badge key={v} tone="brand" className="cursor-pointer" onClick={() => onChange(values.filter((x) => x !== v))}>
            {v} ✕
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button type="button" variant="secondary" onClick={add}>
          Add
        </Button>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const { data: subjects = [] } = useSubjects(profile?.id);
  const updateProfile = useUpdateProfile();
  const addSubject = useAddSubject(profile?.id);
  const deleteSubject = useDeleteSubject(profile?.id);

  const [form, setForm] = useState({
    full_name: '',
    roll_number: '',
    university_name: '',
    department_name: '',
    semester: 1,
    bio: '',
    skills: [] as string[],
    career_interests: [] as string[],
  });

  const [newSubject, setNewSubject] = useState({ subject_name: '', credit_hours: 3, grade: '' });

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name ?? '',
        roll_number: profile.roll_number ?? '',
        university_name: profile.university_name ?? '',
        department_name: profile.department_name ?? '',
        semester: profile.semester ?? 1,
        bio: profile.bio ?? '',
        skills: profile.skills ?? [],
        career_interests: profile.career_interests ?? [],
      });
    }
  }, [profile]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!profile) {
    return (
      <EmptyState
        icon={GraduationCap}
        title="Profile unavailable"
        description="We couldn't load your profile. It may still be provisioning."
      />
    );
  }

  const save = async () => {
    try {
      await updateProfile.mutateAsync({
        full_name: form.full_name,
        roll_number: form.roll_number,
        university_name: form.university_name,
        department_name: form.department_name,
        semester: Number(form.semester),
        bio: form.bio,
        skills: form.skills,
        career_interests: form.career_interests,
      });
      toast.success('Profile saved.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not save.');
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.subject_name.trim()) {
      toast.error('Enter a subject name.');
      return;
    }
    if (subjects.length >= MAX_SUBJECTS) {
      toast.error(`You can add a maximum of ${MAX_SUBJECTS} subjects.`);
      return;
    }
    try {
      await addSubject.mutateAsync({
        subject_name: newSubject.subject_name.trim(),
        credit_hours: Number(newSubject.credit_hours),
        grade: newSubject.grade || null,
      });
      setNewSubject({ subject_name: '', credit_hours: 3, grade: '' });
      toast.success('Subject added.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not add subject.');
    }
  };

  // Live completion reflects the current form state (before saving).
  const completion = profileCompletion(
    {
      ...profile,
      full_name: form.full_name,
      university_name: form.university_name,
      department_name: form.department_name,
      semester: form.semester,
      skills: form.skills,
      career_interests: form.career_interests,
      bio: form.bio,
    },
    subjects.length,
  );

  return (
    <div>
      <PageHeader
        title="My Profile"
        description="Keep your profile up to date so the AI can personalize your guidance."
        action={
          <Button onClick={save} loading={updateProfile.isPending}>
            <Save className="h-4 w-4" /> Save changes
          </Button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <Card>
            <CardBody className="flex flex-col items-center text-center">
              <div className="relative">
                <Avatar name={form.full_name || 'Student'} src={profile.avatar_url} size={88} />
                <span className="absolute -bottom-1 -right-1 inline-flex h-7 w-7 items-center justify-center rounded-full border-2 border-surface bg-brand-gradient text-[10px] font-bold text-white">
                  {completion.percent}%
                </span>
              </div>
              <h2 className="mt-3 text-lg font-semibold text-fg">{form.full_name || 'Student'}</h2>
              <p className="text-sm text-muted">{form.roll_number}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <Badge tone="brand">{form.university_name || 'University'}</Badge>
                <Badge tone="accent">Semester {form.semester}</Badge>
              </div>
              <p className="mt-4 text-sm text-muted">{form.department_name}</p>
              {form.bio && <p className="mt-2 text-xs text-muted">{form.bio}</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader title="Profile completion" subtitle={`${completion.done}/${completion.total} done`} />
            <CardBody>
              <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2">
                <div
                  className="h-full rounded-full bg-brand-gradient transition-all"
                  style={{ width: `${completion.percent}%` }}
                />
              </div>
              <ul className="mt-4 space-y-2">
                {completion.items.map((it) => (
                  <li key={it.label} className="flex items-center gap-2 text-sm">
                    <span className={`inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-[10px] ${it.done ? 'bg-accent text-white' : 'border border-border text-transparent'}`}>
                      ✓
                    </span>
                    <span className={it.done ? 'text-muted line-through' : 'text-fg'}>{it.label}</span>
                  </li>
                ))}
              </ul>
            </CardBody>
          </Card>
        </div>

        <Card className="lg:col-span-2">
          <CardHeader title="Academic information" />
          <CardBody className="grid gap-4 sm:grid-cols-2">
            <Input label="Full name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            <Input label="Roll number" value={form.roll_number} onChange={(e) => setForm({ ...form, roll_number: e.target.value })} />
            <Input label="University" value={form.university_name} onChange={(e) => setForm({ ...form, university_name: e.target.value })} />
            <Input label="Department" value={form.department_name} onChange={(e) => setForm({ ...form, department_name: e.target.value })} />
            <Select label="Semester" value={form.semester} onChange={(e) => setForm({ ...form, semester: Number(e.target.value) })}>
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  Semester {i + 1}
                </option>
              ))}
            </Select>
            <div className="sm:col-span-2">
              <Textarea label="Short bio" value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} placeholder="Tell us about yourself and your goals…" />
            </div>
            <div className="sm:col-span-2">
              <TagInput label="Skills" values={form.skills} onChange={(v) => setForm({ ...form, skills: v })} placeholder="e.g. JavaScript" />
            </div>
            <div className="sm:col-span-2">
              <TagInput label="Career interests" values={form.career_interests} onChange={(v) => setForm({ ...form, career_interests: v })} placeholder="e.g. Frontend" />
            </div>
          </CardBody>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Subjects"
          subtitle={`Add up to ${MAX_SUBJECTS} subjects (${subjects.length}/${MAX_SUBJECTS})`}
        />
        <CardBody>
          {subjects.length === 0 ? (
            <EmptyState title="No subjects yet" description="Add your current semester subjects below." />
          ) : (
            <div className="mb-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {subjects.map((s) => (
                <div key={s.id} className="flex items-center justify-between gap-3 bg-surface px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-fg">{s.subject_name}</p>
                    <p className="text-xs text-muted">
                      {s.credit_hours} credit hours{s.grade ? ` · Grade ${s.grade}` : ''}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSubject.mutate(s.id)}
                    className="text-muted transition hover:text-danger"
                    aria-label={`Remove ${s.subject_name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {subjects.length < MAX_SUBJECTS && (
            <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_auto_auto]">
              <Input
                label="Subject name"
                value={newSubject.subject_name}
                onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
                placeholder="e.g. Algorithms"
              />
              <Input
                label="Credits"
                type="number"
                min={0}
                max={6}
                className="w-24"
                value={newSubject.credit_hours}
                onChange={(e) => setNewSubject({ ...newSubject, credit_hours: Number(e.target.value) })}
              />
              <Select
                label="Grade"
                value={newSubject.grade}
                onChange={(e) => setNewSubject({ ...newSubject, grade: e.target.value })}
              >
                <option value="">—</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>
              <Button onClick={handleAddSubject} loading={addSubject.isPending}>
                <Plus className="h-4 w-4" /> Add
              </Button>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
