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
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthContext';
import { useProfile, useSubjects } from '@/features/profile/useProfile';
import { computeGpa } from '@/lib/grades';
import { buildRecommendations } from './recommendations';

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

const QUICK_ACTIONS = [
  { to: '/app/advisor', label: 'Ask AI Advisor', icon: Bot },
  { to: '/app/gpa', label: 'Calculate GPA', icon: Calculator },
  { to: '/app/cv', label: 'Build CV', icon: FileText },
  { to: '/app/jobs', label: 'Find Jobs', icon: Briefcase },
  { to: '/app/notes', label: 'Coding Notes', icon: BookOpen },
  { to: '/app/community', label: 'Community', icon: Users },
];

function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
}) {
  return (
    <Card>
      <CardBody className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs text-muted">{label}</p>
          <p className="text-lg font-semibold text-fg">{value}</p>
        </div>
      </CardBody>
    </Card>
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-72" />
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
    <div>
      <PageHeader
        title={`${greeting()}, ${firstName} 👋`}
        description="Here's your academic and career overview."
      />

      {/* Academic overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Current semester" value={`Semester ${profile?.semester ?? '—'}`} icon={BookMarked} />
        <StatCard label="Subjects" value={`${subjects.length}`} icon={BookOpen} />
        <StatCard label="Estimated GPA" value={gpa ? gpa.toFixed(2) : '—'} icon={TrendingUp} />
        <StatCard label="Skills tracked" value={`${profile?.skills?.length ?? 0}`} icon={Target} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
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
                action={
                  <Link to="/app/profile">
                    <Button size="sm">Complete profile</Button>
                  </Link>
                }
              />
            ) : (
              recommendations.map((rec, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 rounded-xl border border-border bg-surface-2 p-3"
                >
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                    <rec.icon className="h-3.5 w-3.5" />
                  </span>
                  <p className="text-sm text-fg">{rec.text}</p>
                </div>
              ))
            )}
            <Link to="/app/advisor" className="inline-block">
              <Button variant="secondary" size="sm">
                <Bot className="h-4 w-4" /> Open AI Advisor
              </Button>
            </Link>
          </CardBody>
        </Card>

        {/* Career + Quick actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader title="Career snapshot" />
            <CardBody className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-muted">CV status</span>
                <Badge tone="warning">In progress</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">Career interests</span>
                <span className="font-medium text-fg">{profile?.career_interests?.length ?? 0}</span>
              </div>
              <Link to="/app/jobs">
                <Button variant="secondary" size="sm" className="w-full">
                  <Briefcase className="h-4 w-4" /> View matched jobs
                </Button>
              </Link>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Quick actions */}
      <Card className="mt-6">
        <CardHeader title="Quick actions" />
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center transition hover:border-brand hover:bg-surface-2"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-soft text-brand">
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-fg">{label}</span>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
