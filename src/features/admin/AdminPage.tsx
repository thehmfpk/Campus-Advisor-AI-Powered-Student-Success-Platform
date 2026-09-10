import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  BarChart3,
  Users,
  Building2,
  Briefcase,
  Trophy,
  Flag,
  MessageSquareWarning,
  Lightbulb,
  GraduationCap,
  Star,
  ShieldCheck,
  LogOut,
  ArrowLeft,
  Trash2,
  Plus,
  EyeOff,
  Eye,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  Input,
  Select,
  Skeleton,
  Tabs,
} from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { BarChart, DonutChart } from './Charts';
import { useAuth } from '@/features/auth/AuthContext';
import {
  useAdminAnalytics,
  useAdminFeatureRequests,
  useAdminJobs,
  useAdminRankings,
  useAdminReports,
  useAdminStudents,
  useAdminUniversities,
  useAdminUniversityFeedback,
  useCrud,
  useSetFeatureStatus,
  useSetPostStatus,
  useSetStudentStatus,
} from './useAdmin';
import type { FeatureStatus } from '@/types/db';

const ANALYTIC_LABELS: Record<string, { label: string; icon: typeof Users }> = {
  student_profiles: { label: 'Students', icon: Users },
  universities: { label: 'Universities', icon: Building2 },
  posts: { label: 'Community posts', icon: MessageSquareWarning },
  jobs: { label: 'Job listings', icon: Briefcase },
  ai_conversations: { label: 'AI conversations', icon: BarChart3 },
  university_feedback: { label: 'University feedback', icon: Flag },
  portal_feedback: { label: 'Platform feedback', icon: MessageSquareWarning },
  feature_requests: { label: 'Feature requests', icon: Lightbulb },
  societies: { label: 'Societies', icon: Users },
};

function AnalyticsSection() {
  const { data, isLoading } = useAdminAnalytics();
  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }
  if (!data) return <EmptyState title="No analytics" description="Configure Supabase to see metrics." />;

  const barData = [
    { label: 'Students', value: data.student_profiles ?? 0 },
    { label: 'Posts', value: data.posts ?? 0 },
    { label: 'Jobs', value: data.jobs ?? 0 },
    { label: 'AI chats', value: data.ai_conversations ?? 0 },
    { label: 'Societies', value: (data as Record<string, number>).societies ?? 0 },
  ];
  const donut = [
    { label: 'University feedback', value: data.university_feedback ?? 0, color: '#1D546D' },
    { label: 'Platform feedback', value: data.portal_feedback ?? 0, color: '#5F9598' },
    { label: 'Feature requests', value: data.feature_requests ?? 0, color: '#061E29' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Object.entries(data).map(([key, count]) => {
          const meta = ANALYTIC_LABELS[key];
          const Icon = meta?.icon ?? BarChart3;
          return (
            <Card key={key} className="card-hover">
              <CardBody className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <Icon className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-2xl font-extrabold text-fg">{count}</p>
                  <p className="text-xs text-muted">{meta?.label ?? key}</p>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Platform activity" subtitle="Counts across core entities" />
          <CardBody>
            <BarChart data={barData} />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Feedback breakdown" subtitle="By type" />
          <CardBody>
            <DonutChart segments={donut} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function StudentsSection() {
  const [search, setSearch] = useState('');
  const { data: students = [], isLoading } = useAdminStudents(search);
  const { accessToken } = useAuth();
  const setStatus = useSetStudentStatus(accessToken);

  const toggleDisable = async (userId: string, disabled: boolean) => {
    if (userId.startsWith('sample-')) {
      toast.info('This is a sample student. Real accounts can be managed here once students sign up.');
      return;
    }
    try {
      await setStatus.mutateAsync({ userId, disabled });
      toast.success(disabled ? 'Account disabled.' : 'Account enabled.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Action failed.');
    }
  };
  return (
    <Card>
      <CardHeader title="Students" subtitle="Search and view student profiles" />
      <CardBody>
        <Input
          className="mb-4"
          placeholder="Search by name…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : students.length === 0 ? (
          <EmptyState icon={Users} title="No students found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs text-muted">
                <tr>
                  <th className="pb-2">Name</th>
                  <th className="pb-2">Roll #</th>
                  <th className="pb-2">University</th>
                  <th className="pb-2">Semester</th>
                  <th className="pb-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {students.map((s) => (
                  <tr key={s.id}>
                    <td className="py-2 font-medium text-fg">{s.full_name}</td>
                    <td className="py-2 text-muted">{s.roll_number ?? 'N/A'}</td>
                    <td className="py-2 text-muted">{s.university_name ?? 'N/A'}</td>
                    <td className="py-2 text-muted">{s.semester ?? 'N/A'}</td>
                    <td className="py-2 text-right">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleDisable(s.user_id, true)}
                      >
                        Disable
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function UniversitiesSection() {
  const { data: universities = [], isLoading } = useAdminUniversities();
  const { create, remove } = useCrud('universities', 'universities');
  const [name, setName] = useState('');
  const [country, setCountry] = useState('Pakistan');

  const add = async () => {
    if (!name.trim()) return toast.error('Enter a university name.');
    try {
      await create.mutateAsync({ name: name.trim(), country });
      setName('');
      toast.success('University added.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <Card>
      <CardHeader title="Universities" subtitle="Add or remove universities" />
      <CardBody>
        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_160px_auto]">
          <Input placeholder="University name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="Country" value={country} onChange={(e) => setCountry(e.target.value)} />
          <Button onClick={add} loading={create.isPending}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="divide-y divide-border">
            {universities.map((u) => (
              <div key={u.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-fg">
                  {u.name} <span className="text-muted">({u.country})</span>
                </span>
                <button onClick={() => remove.mutate(u.id)} className="text-muted hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function JobsSection() {
  const { data: jobs = [], isLoading } = useAdminJobs();
  const { create, remove } = useCrud('jobs', 'jobs');
  const [form, setForm] = useState({ title: '', company: '', location: '', skills: '' });

  const add = async () => {
    if (!form.title.trim() || !form.company.trim()) return toast.error('Title and company required.');
    try {
      await create.mutateAsync({
        title: form.title.trim(),
        company: form.company.trim(),
        location: form.location.trim() || null,
        required_skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        source: 'Admin entry',
        posted_date: new Date().toISOString().slice(0, 10),
      });
      setForm({ title: '', company: '', location: '', skills: '' });
      toast.success('Job added.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <Card>
      <CardHeader title="Jobs" subtitle="Manage the curated job dataset" />
      <CardBody>
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <Input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          <Input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          <Input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          <Input placeholder="Skills (comma separated)" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          <Button className="sm:col-span-2" onClick={add} loading={create.isPending}>
            <Plus className="h-4 w-4" /> Add job
          </Button>
        </div>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="divide-y divide-border">
            {jobs.map((j) => (
              <div key={j.id} className="flex items-center justify-between py-2">
                <span className="text-sm text-fg">
                  {j.title} <span className="text-muted">({j.company})</span>
                </span>
                <button onClick={() => remove.mutate(j.id)} className="text-muted hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function RankingsSection() {
  const { data: rankings = [], isLoading } = useAdminRankings();
  const { create, remove } = useCrud('ranking_records', 'ranking_records');
  const [form, setForm] = useState({ university_name: '', country: 'Pakistan', position: 1, source: '', year: 2025, category: 'National' });

  const add = async () => {
    if (!form.university_name.trim() || !form.source.trim())
      return toast.error('University name and source are required.');
    try {
      await create.mutateAsync({ ...form, position: Number(form.position), year: Number(form.year) });
      setForm({ ...form, university_name: '', source: '' });
      toast.success('Ranking added.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Failed.');
    }
  };

  return (
    <Card>
      <CardHeader title="Rankings" subtitle="Every record must cite a source and year" />
      <CardBody>
        <div className="mb-4 grid gap-2 sm:grid-cols-2">
          <Input placeholder="University" value={form.university_name} onChange={(e) => setForm({ ...form, university_name: e.target.value })} />
          <Input placeholder="Country" value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          <Input type="number" placeholder="Position" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} />
          <Input type="number" placeholder="Year" value={form.year} onChange={(e) => setForm({ ...form, year: Number(e.target.value) })} />
          <Input placeholder="Source (required)" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} />
          <Input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <Button className="sm:col-span-2" onClick={add} loading={create.isPending}>
            <Plus className="h-4 w-4" /> Add ranking
          </Button>
        </div>
        {isLoading ? (
          <Skeleton className="h-32 w-full" />
        ) : (
          <div className="divide-y divide-border">
            {rankings.map((r) => (
              <div key={r.id} className="flex items-center justify-between py-2 text-sm">
                <span className="text-fg">
                  #{r.position} {r.university_name}{' '}
                  <span className="text-muted">
                    {r.source} ({r.year})
                  </span>
                </span>
                <button onClick={() => remove.mutate(r.id)} className="text-muted hover:text-danger">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function ModerationSection() {
  const { data: reports = [], isLoading } = useAdminReports();
  const setStatus = useSetPostStatus();

  return (
    <Card>
      <CardHeader title="Community Moderation" subtitle="Review reported posts and hide/remove content" />
      <CardBody>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : reports.length === 0 ? (
          <EmptyState icon={Flag} title="No reports" description="Reported posts will appear here." />
        ) : (
          <div className="space-y-3">
            {reports.map((r: Record<string, unknown>) => {
              const rawPost = r.posts as
                | { content?: string; status?: string }
                | { content?: string; status?: string }[]
                | null;
              const post = Array.isArray(rawPost) ? (rawPost[0] ?? null) : rawPost;
              return (
                <div key={r.id as string} className="rounded-xl border border-border p-3">
                  <div className="flex items-center justify-between">
                    <Badge tone="warning">{r.reason as string}</Badge>
                    <Badge tone="neutral">{post?.status ?? 'unknown'}</Badge>
                  </div>
                  <p className="mt-2 text-sm text-fg">{post?.content ?? '(post removed)'}</p>
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" variant="secondary" onClick={() => setStatus.mutate({ id: r.post_id as string, status: 'hidden' })}>
                      <EyeOff className="h-3.5 w-3.5" /> Hide
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => setStatus.mutate({ id: r.post_id as string, status: 'published' })}>
                      <Eye className="h-3.5 w-3.5" /> Keep
                    </Button>
                    <Button size="sm" variant="danger" onClick={() => setStatus.mutate({ id: r.post_id as string, status: 'removed' })}>
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function FeedbackSection() {
  const { data: feedback = [], isLoading } = useAdminUniversityFeedback();
  return (
    <Card>
      <CardHeader title="University Feedback" subtitle="Private feedback submitted by students" />
      <CardBody>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : feedback.length === 0 ? (
          <EmptyState icon={MessageSquareWarning} title="No feedback yet" />
        ) : (
          <div className="space-y-3">
            {feedback.map((f: Record<string, unknown>) => (
              <div key={f.id as string} className="rounded-xl border border-border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-fg">
                    {(f.university_name as string) ?? 'University'} ({f.category as string})
                  </span>
                  <span className="flex items-center gap-0.5 text-warning">
                    {Array.from({ length: f.rating as number }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-warning" />
                    ))}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{f.feedback as string}</p>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

function FeatureRequestsSection() {
  const { data: requests = [], isLoading } = useAdminFeatureRequests();
  const setStatus = useSetFeatureStatus();
  const STATUSES: FeatureStatus[] = ['open', 'planned', 'in_progress', 'completed', 'rejected'];
  return (
    <Card>
      <CardHeader title="Feature Requests" subtitle="Update the status of student requests" />
      <CardBody>
        {isLoading ? (
          <Skeleton className="h-40 w-full" />
        ) : requests.length === 0 ? (
          <EmptyState icon={Lightbulb} title="No requests" />
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div key={r.id} className="flex items-center justify-between gap-3 rounded-xl border border-border p-3">
                <div>
                  <p className="text-sm font-medium text-fg">{r.title}</p>
                  <p className="text-xs text-muted">{r.description}</p>
                </div>
                <Select
                  className="w-40"
                  value={r.status}
                  onChange={(e) => setStatus.mutate({ id: r.id, status: e.target.value as FeatureStatus })}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s.replace('_', ' ')}
                    </option>
                  ))}
                </Select>
              </div>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('analytics');

  const handleSignOut = async () => {
    await signOut();
    navigate('/', { replace: true });
  };

  return (
    <div className="min-h-screen bg-bg-deep">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-bg-deep/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg">
              <ShieldCheck className="h-5 w-5" />
            </span>
            <div>
              <p className="font-bold text-white">Campus Advisor</p>
              <p className="text-xs text-white/60">Admin Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/app/dashboard">
              <Button variant="ghost" size="sm" className="text-white/80 hover:bg-white/10 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Student view
              </Button>
            </Link>
            <ThemeToggle />
            <Button variant="secondary" size="sm" onClick={handleSignOut}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {/* Welcome hero */}
        <div className="mb-6 overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white shadow-lg">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
              <ShieldCheck className="h-6 w-6" />
            </span>
            <div>
              <h1 className="text-xl font-extrabold sm:text-2xl">Welcome, {user?.fullName}</h1>
              <p className="text-sm text-white/85">Manage students, content, community, and platform analytics.</p>
            </div>
          </div>
        </div>
        <Tabs
          active={tab}
          onChange={setTab}
          tabs={[
            { key: 'analytics', label: 'Analytics', icon: <BarChart3 className="h-4 w-4" /> },
            { key: 'students', label: 'Students', icon: <Users className="h-4 w-4" /> },
            { key: 'universities', label: 'Universities', icon: <Building2 className="h-4 w-4" /> },
            { key: 'jobs', label: 'Jobs', icon: <Briefcase className="h-4 w-4" /> },
            { key: 'rankings', label: 'Rankings', icon: <Trophy className="h-4 w-4" /> },
            { key: 'moderation', label: 'Moderation', icon: <Flag className="h-4 w-4" /> },
            { key: 'feedback', label: 'Feedback', icon: <MessageSquareWarning className="h-4 w-4" /> },
            { key: 'features', label: 'Feature Requests', icon: <Lightbulb className="h-4 w-4" /> },
          ]}
        />

        {tab === 'analytics' && <AnalyticsSection />}
        {tab === 'students' && <StudentsSection />}
        {tab === 'universities' && <UniversitiesSection />}
        {tab === 'jobs' && <JobsSection />}
        {tab === 'rankings' && <RankingsSection />}
        {tab === 'moderation' && <ModerationSection />}
        {tab === 'feedback' && <FeedbackSection />}
        {tab === 'features' && <FeatureRequestsSection />}
      </main>
    </div>
  );
}
