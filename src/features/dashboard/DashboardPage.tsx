import { Link } from 'react-router-dom';
import {
  Bot,
  Calculator,
  FileText,
  Briefcase,
  BookOpen,
  Users,
  Sparkles,
  TrendingUp,
  BookMarked,
  Target,
  ArrowRight,
  GraduationCap,
} from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthContext';
import { useProfile, useSubjects } from '@/features/profile/useProfile';
import { computeGpa } from '@/lib/grades';
import { buildRecommendations } from './recommendations';
import { profileCompletion } from '@/features/profile/completion';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_ACTIONS = [
  { to: '/app/advisor', label: 'Ask AI Advisor', icon: Bot, color: 'from-blue-500 to-indigo-500' },
  { to: '/app/gpa', label: 'Calculate GPA', icon: Calculator, color: 'from-rose-500 to-pink-500' },
  { to: '/app/cv', label: 'Build CV', icon: FileText, color: 'from-emerald-500 to-teal-500' },
  { to: '/app/jobs', label: 'Find Jobs', icon: Briefcase, color: 'from-amber-500 to-orange-500' },
  { to: '/app/notes', label: 'Coding Notes', icon: BookOpen, color: 'from-cyan-500 to-sky-500' },
  { to: '/app/community', label: 'Community', icon: Users, color: 'from-fuchsia-500 to-purple-500' },
];

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  hint?: string;
}) {
  return (
    <Card className="card-hover">
      <CardBody className="flex items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="text-xs text-muted">{label}</p>
          <p className="truncate text-xl font-bold text-fg">{value}</p>
          {hint && <p className="text-[11px] text-muted">{hint}</p>}
        </div>
      </CardBody>
    </Card>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width="72" height="72" viewBox="0 0 72 72" className="shrink-0">
      <circle cx="36" cy="36" r={r} fill="none" stroke="hsl(var(--surface-2))" strokeWidth="8" />
      <circle
        cx="36"
        cy="36"
        r={r}
        fill="none"
        stroke="hsl(var(--brand))"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        transform="rotate(-90 36 36)"
      />
      <text x="36" y="41" textAnchor="middle" className="fill-fg text-sm font-bold">
        {value}%
      </text>
    </svg>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useProfile();
  const { data: subjects = [] } = useSubjects(profile?.id);

  const gradedSubjects = subjects
    .filter((s) => s.grade)
    .map((s) => ({ name: s.subject_name, creditHours: s.credit_hours, grade: s.grade as string }));

  let gpa = 0;
  try {
    gpa = gradedSubjects.length ? computeGpa(gradedSubjects).gpa : 0;
  } catch {
    gpa = 0;
  }

  const firstName = (profile?.full_name ?? user?.fullName ?? 'Student').split(' ')[0];
  const recommendations = buildRecommendations(profile ?? null, subjects);
  const completion = profileCompletion(profile ?? null, subjects.length);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-2xl bg-brand-gradient p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold sm:text-3xl">
              {greeting()}, {firstName}
            </h1>
            <p className="mt-1 text-white/85">Here&apos;s your academic and career overview.</p>
          </div>
          <Link to="/app/advisor">
            <Button variant="secondary" className="shadow-lg">
              <Bot className="h-4 w-4" /> Ask AI Advisor
            </Button>
          </Link>
        </div>
      </div>

      {/* Academic overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current semester" value={`Semester ${profile?.semester ?? '—'}`} icon={BookMarked} />
        <StatCard label="Subjects" value={`${subjects.length}`} hint={`${subjects.length}/7 added`} icon={BookOpen} />
        <StatCard label="Estimated GPA" value={gpa ? gpa.toFixed(2) : '—'} hint="from graded subjects" icon={TrendingUp} />
        <StatCard label="Skills tracked" value={`${profile?.skills?.length ?? 0}`} icon={Target} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI recommendations */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand" /> AI Recommendations
              </span>
            }
            subtitle="Personalized from your profile · recommendations, not verified facts"
          />
          <CardBody className="space-y-3">
            {recommendations.length === 0 ? (
              <EmptyState
                title="Complete your profile"
                description="Add subjects, skills, and interests to unlock personalized recommendations."
                action={<Link to="/app/profile"><Button size="sm">Complete profile</Button></Link>}
              />
            ) : (
              recommendations.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-3">
                  <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <rec.icon className="h-4 w-4" />
                  </span>
                  <p className="text-sm text-fg">{rec.text}</p>
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Profile completion */}
        <Card>
          <CardHeader title="Profile completion" subtitle="A complete profile = better guidance" />
          <CardBody>
            <div className="flex items-center gap-4">
              <ProgressRing value={completion.percent} />
              <div className="flex-1">
                <p className="text-sm font-medium text-fg">
                  {completion.percent === 100 ? 'All set!' : `${completion.done}/${completion.total} complete`}
                </p>
                <p className="text-xs text-muted">Finish the remaining items below.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {completion.items.slice(0, 5).map((it) => (
                <li key={it.label} className="flex items-center gap-2 text-sm">
                  <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full ${it.done ? 'bg-accent text-white' : 'border border-border'}`}>
                    {it.done && '✓'}
                  </span>
                  <span className={it.done ? 'text-muted line-through' : 'text-fg'}>{it.label}</span>
                </li>
              ))}
            </ul>
            {completion.percent < 100 && (
              <Link to="/app/profile" className="mt-4 inline-block">
                <Button size="sm" variant="secondary" className="w-full">
                  Complete profile <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader title="Quick actions" subtitle="Jump straight into what you need" />
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className="card-hover flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center"
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-fg">{label}</span>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Career + Community band */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-hover">
          <CardBody className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-fg"><Briefcase className="h-4 w-4 text-brand" /> Career</h3>
              <p className="mt-1 text-sm text-muted">See jobs matched to your skills with explainable AI scores.</p>
            </div>
            <Link to="/app/jobs"><Button size="sm" variant="secondary">View jobs</Button></Link>
          </CardBody>
        </Card>
        <Card className="card-hover">
          <CardBody className="flex items-center justify-between">
            <div>
              <h3 className="flex items-center gap-2 font-bold text-fg"><GraduationCap className="h-4 w-4 text-brand" /> Community</h3>
              <p className="mt-1 text-sm text-muted">Join societies like GDGoC, AWS & GitHub and connect with students.</p>
            </div>
            <Link to="/app/community"><Button size="sm" variant="secondary">Explore</Button></Link>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
