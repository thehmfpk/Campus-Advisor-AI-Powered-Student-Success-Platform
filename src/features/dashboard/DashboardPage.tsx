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
  Trophy,
  Flame,
} from 'lucide-react';
import { Badge, Button, Card, CardBody, CardHeader, EmptyState, Skeleton } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthContext';
import { useProfile, useSubjects } from '@/features/profile/useProfile';
import { computeGpa } from '@/lib/grades';
import { buildRecommendations } from './recommendations';
import { profileCompletion } from '@/features/profile/completion';
import { useI18n } from '@/i18n/LanguageProvider';

function greeting(t: (k: string, f?: string) => string): string {
  const h = new Date().getHours();
  if (h < 12) return t('dash.greetingMorning', 'Good morning');
  if (h < 18) return t('dash.greetingAfternoon', 'Good afternoon');
  return t('dash.greetingEvening', 'Good evening');
}

const QUICK_ACTIONS = [
  { to: '/app/advisor', key: 'nav.advisor', label: 'Ask AI Advisor', icon: Bot, color: 'tile-1' },
  { to: '/app/gpa', key: 'nav.gpa', label: 'Calculate GPA', icon: Calculator, color: 'tile-2' },
  { to: '/app/cv', key: 'nav.cv', label: 'Build CV', icon: FileText, color: 'tile-3' },
  { to: '/app/jobs', key: 'nav.jobs', label: 'Find Jobs', icon: Briefcase, color: 'tile-4' },
  { to: '/app/notes', key: 'nav.notes', label: 'Coding Notes', icon: BookOpen, color: 'tile-5' },
  { to: '/app/community', key: 'nav.community', label: 'Community', icon: Users, color: 'tile-6' },
];

function StatCard({
  label,
  value,
  icon: Icon,
  hint,
  accent,
}: {
  label: string;
  value: string;
  icon: typeof TrendingUp;
  hint?: string;
  accent: string;
}) {
  return (
    <Card className="card-hover overflow-hidden">
      <CardBody className="relative">
        <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gradient-to-br ${accent} opacity-15`} />
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${accent} text-white shadow`}>
          <Icon className="h-5 w-5" />
        </span>
        <p className="mt-3 text-2xl font-extrabold text-fg">{value}</p>
        <p className="text-xs text-muted">{label}</p>
        {hint && <p className="mt-0.5 text-[11px] text-muted">{hint}</p>}
      </CardBody>
    </Card>
  );
}

function ProgressRing({ value }: { value: number }) {
  const r = 30;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <svg width="84" height="84" viewBox="0 0 84 84" className="shrink-0 -rotate-90">
      <circle cx="42" cy="42" r={r} fill="none" stroke="hsl(var(--surface-2))" strokeWidth="9" />
      <circle
        cx="42"
        cy="42"
        r={r}
        fill="none"
        stroke="hsl(var(--brand))"
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }}
      />
      <text x="42" y="42" textAnchor="middle" dominantBaseline="central" className="rotate-90 fill-fg text-base font-bold" transform="rotate(90 42 42)">
        {value}%
      </text>
    </svg>
  );
}

/** Small dependency-free bar chart for a GPA-style trend. */
function MiniBars({ data }: { data: { label: string; value: number }[] }) {
  const max = 4;
  return (
    <div className="flex items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex flex-1 flex-col items-center gap-1">
          <div className="flex h-24 w-full items-end rounded-md bg-surface-2">
            <div
              className="w-full rounded-md bg-brand-gradient"
              style={{ height: `${(Math.min(d.value, max) / max) * 100}%`, transition: 'height 0.6s ease' }}
              title={`${d.value}`}
            />
          </div>
          <span className="text-[10px] font-medium text-fg">{d.value.toFixed(1)}</span>
          <span className="text-[10px] text-muted">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useI18n();
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

  // Demo-friendly GPA trend (uses estimated GPA as the latest point).
  const trend = [
    { label: 'S1', value: 3.4 },
    { label: 'S2', value: 3.6 },
    { label: 'S3', value: 3.5 },
    { label: 'S4', value: 3.7 },
    { label: 'Now', value: gpa || 3.6 },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero banner */}
      <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-6 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white/80">
              {profile?.university_name ?? 'Your University'}, {t('dash.currentSemester')} {profile?.semester ?? 'N/A'}
            </p>
            <h1 className="mt-1 text-2xl font-extrabold sm:text-3xl">
              {greeting(t)}, {firstName}
            </h1>
            <p className="mt-1 text-white/85">{t('dash.overview')}</p>
          </div>
          <Link to="/app/advisor">
            <Button variant="secondary" className="shadow-lg">
              <Bot className="h-4 w-4" /> {t('dash.askAI')}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label={t('dash.currentSemester')} value={`${profile?.semester ?? 'N/A'}`} icon={BookMarked} accent="tile-1" />
        <StatCard label={t('dash.subjects')} value={`${subjects.length}`} hint={`${subjects.length}/7`} icon={BookOpen} accent="tile-3" />
        <StatCard label={t('dash.estimatedGpa')} value={gpa ? gpa.toFixed(2) : 'N/A'} icon={TrendingUp} accent="tile-2" />
        <StatCard label={t('dash.skillsTracked')} value={`${profile?.skills?.length ?? 0}`} icon={Target} accent="tile-5" />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column */}
        <div className="space-y-6 lg:col-span-2">
          {/* GPA trend chart */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-brand" /> Academic progress
                </span>
              }
              subtitle="GPA trend across semesters"
            />
            <CardBody>
              <MiniBars data={trend} />
            </CardBody>
          </Card>

          {/* AI recommendations */}
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand" /> {t('dash.recommendations')}
                </span>
              }
              subtitle={t('dash.recommendationsSub')}
            />
            <CardBody className="space-y-3">
              {recommendations.length === 0 ? (
                <EmptyState
                  title={t('dash.completeProfile')}
                  description="Add subjects, skills, and interests to unlock personalized recommendations."
                  action={<Link to="/app/profile"><Button size="sm">{t('dash.completeProfile')}</Button></Link>}
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
        </div>

        {/* Right column: profile completion */}
        <Card className="h-fit">
          <CardHeader title={t('dash.profileCompletion')} subtitle="A complete profile = better guidance" />
          <CardBody>
            <div className="flex items-center gap-4">
              <ProgressRing value={completion.percent} />
              <div className="flex-1">
                <p className="text-sm font-medium text-fg">
                  {completion.percent === 100 ? 'All set!' : `${completion.done}/${completion.total} complete`}
                </p>
                <p className="text-xs text-muted">Finish the remaining items.</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {completion.items.slice(0, 6).map((it) => (
                <li key={it.label} className="flex items-center gap-2 text-sm">
                  <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] ${it.done ? 'bg-accent text-white' : 'border border-border text-transparent'}`}>
                    ✓
                  </span>
                  <span className={it.done ? 'text-muted line-through' : 'text-fg'}>{it.label}</span>
                </li>
              ))}
            </ul>
            {completion.percent < 100 && (
              <Link to="/app/profile" className="mt-4 inline-block w-full">
                <Button size="sm" variant="secondary" className="w-full">
                  {t('dash.completeProfile')} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Quick actions */}
      <Card>
        <CardHeader title={t('dash.quickActions')} subtitle={t('dash.quickActionsSub')} />
        <CardBody>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {QUICK_ACTIONS.map(({ to, key, label, icon: Icon, color }) => (
              <Link
                key={to}
                to={to}
                className="card-hover flex flex-col items-center gap-2 rounded-xl border border-border bg-surface p-4 text-center"
              >
                <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${color} text-white shadow`}>
                  <Icon className="h-5 w-5" />
                </span>
                <span className="text-xs font-medium text-fg">{t(key, label)}</span>
              </Link>
            ))}
          </div>
        </CardBody>
      </Card>

      {/* Career + Community + Rankings band */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="card-hover">
          <CardBody>
            <h3 className="flex items-center gap-2 font-bold text-fg"><Briefcase className="h-4 w-4 text-brand" /> {t('dash.career')}</h3>
            <p className="mt-1 text-sm text-muted">{t('dash.careerSub')}</p>
            <Link to="/app/jobs" className="mt-3 inline-block"><Button size="sm" variant="secondary">{t('dash.viewJobs')}</Button></Link>
          </CardBody>
        </Card>
        <Card className="card-hover">
          <CardBody>
            <h3 className="flex items-center gap-2 font-bold text-fg"><GraduationCap className="h-4 w-4 text-brand" /> {t('nav.community')}</h3>
            <p className="mt-1 text-sm text-muted">{t('dash.communitySub')}</p>
            <Link to="/app/community" className="mt-3 inline-block"><Button size="sm" variant="secondary">{t('dash.explore')}</Button></Link>
          </CardBody>
        </Card>
        <Card className="card-hover">
          <CardBody>
            <h3 className="flex items-center gap-2 font-bold text-fg"><Trophy className="h-4 w-4 text-brand" /> {t('nav.rankings')}</h3>
            <p className="mt-1 text-sm text-muted">See where your university stands nationally and globally.</p>
            <Link to="/app/rankings" className="mt-3 inline-block"><Button size="sm" variant="secondary">{t('common.viewAll')}</Button></Link>
          </CardBody>
        </Card>
      </div>

      {/* Streak-style footer strip */}
      <Card>
        <CardBody className="flex flex-col items-center justify-between gap-3 sm:flex-row">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
              <Flame className="h-5 w-5" />
            </span>
            <div>
              <p className="text-sm font-semibold text-fg">Keep the momentum going</p>
              <p className="text-xs text-muted">Ask the AI advisor a question or add a subject today.</p>
            </div>
          </div>
          <Link to="/app/advisor"><Button size="sm">{t('dash.askAI')}</Button></Link>
        </CardBody>
      </Card>
    </div>
  );
}
