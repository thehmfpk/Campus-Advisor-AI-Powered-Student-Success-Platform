import { useMemo, useState } from 'react';
import { Briefcase, MapPin, ExternalLink, Sparkles, Search } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import {
  Badge,
  Button,
  Card,
  CardBody,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Skeleton,
} from '@/components/ui';
import { useJobs } from './useJobs';
import { googleJobsUrl } from '@/data/jobs';
import { computeMatch } from '@/lib/matching';
import { useProfile } from '@/features/profile/useProfile';
import type { EmploymentType, Job } from '@/types/db';

const TYPE_LABELS: Record<EmploymentType, string> = {
  internship: 'Internship',
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
};

function matchTone(score: number): 'success' | 'brand' | 'warning' {
  if (score >= 75) return 'success';
  if (score >= 50) return 'brand';
  return 'warning';
}

function companyInitials(name: string): string {
  return name.split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? '').join('');
}

function JobCard({ job, profile }: { job: Job; profile: Parameters<typeof computeMatch>[0] | null }) {
  const match = profile ? computeMatch(profile, job) : null;
  const applyUrl = job.apply_url ?? googleJobsUrl(job.title, job.location ?? 'Pakistan');
  const googleUrl = job.google_url ?? googleJobsUrl(job.title, job.location ?? 'Pakistan');
  return (
    <Card className="card-hover">
      <CardBody>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-sm font-bold text-brand">
              {companyInitials(job.company)}
            </span>
            <div>
              <h3 className="font-semibold text-fg">{job.title}</h3>
              <p className="text-sm text-muted">{job.company}</p>
            </div>
          </div>
          {match && (
            <Badge tone={matchTone(match.score)}>
              <Sparkles className="h-3 w-3" /> {match.score}%
            </Badge>
          )}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" /> {job.location ?? 'Not specified'}
          </span>
          <Badge tone="neutral">{TYPE_LABELS[job.employment_type]}</Badge>
          {job.is_remote && <Badge tone="accent">Remote</Badge>}
          {job.experience_level && <Badge tone="neutral">{job.experience_level}</Badge>}
        </div>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {job.required_skills.map((s) => (
            <span key={s} className="rounded-md bg-surface-2 px-2 py-0.5 text-xs text-fg">
              {s}
            </span>
          ))}
        </div>

        {match && (
          <p className="mt-3 rounded-lg bg-brand-soft/50 p-2 text-xs text-fg">
            <Sparkles className="mr-1 inline h-3 w-3 text-brand" />
            {match.explanation}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <div className="text-xs">
            {job.posted_date && <p className="text-muted">Posted {job.posted_date}</p>}
            {job.closes_date && (() => {
              const days = Math.ceil((new Date(job.closes_date).getTime() - Date.now()) / 86400000);
              const closed = days < 0;
              const soon = !closed && days <= 7;
              return (
                <p className={closed ? 'font-medium text-danger' : soon ? 'font-medium text-warning' : 'text-muted'}>
                  {closed ? `Closed ${job.closes_date}` : `Closes ${job.closes_date}${soon ? ` (${days}d left)` : ''}`}
                </p>
              );
            })()}
          </div>
          <div className="flex gap-2">
            <a href={googleUrl} target="_blank" rel="noreferrer" title="Search on Google Jobs">
              <Button size="sm" variant="ghost">Google</Button>
            </a>
            <a href={applyUrl} target="_blank" rel="noreferrer" title="Apply via LinkedIn Jobs">
              <Button size="sm">
                Apply on LinkedIn <ExternalLink className="h-3.5 w-3.5" />
              </Button>
            </a>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export default function JobsPage() {
  const { data: jobs, isLoading, isError, refetch } = useJobs();
  const { data: profile } = useProfile();

  const [query, setQuery] = useState('');
  const [type, setType] = useState<'all' | EmploymentType>('all');
  const [remoteOnly, setRemoteOnly] = useState(false);

  const matchProfile = profile
    ? {
        skills: profile.skills,
        career_interests: profile.career_interests,
        department_name: profile.department_name,
        semester: profile.semester,
      }
    : null;

  const filtered = useMemo(() => {
    if (!jobs) return [];
    const q = query.trim().toLowerCase();
    let list = jobs.filter((j) => {
      if (type !== 'all' && j.employment_type !== type) return false;
      if (remoteOnly && !j.is_remote) return false;
      if (q) {
        const hay = `${j.title} ${j.company} ${j.location} ${j.required_skills.join(' ')} ${j.tags.join(' ')}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    // Sort by match score when we have a profile.
    if (matchProfile) {
      list = [...list].sort(
        (a, b) => computeMatch(matchProfile, b).score - computeMatch(matchProfile, a).score,
      );
    }
    return list;
  }, [jobs, query, type, remoteOnly, matchProfile]);

  return (
    <div>
      <PageHeader
        title="Jobs & Internships"
        description="Opportunities ranked by AI match to your skills, department, and interests."
        action={<Badge tone="accent"><Briefcase className="h-3 w-3" /> {jobs?.length ?? 0} listings</Badge>}
      />

      {/* Filters */}
      <Card className="mb-6">
        <CardBody className="grid gap-3 sm:grid-cols-[1fr_180px_auto]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input
              className="pl-9"
              placeholder="Search title, company, skill…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={type} onChange={(e) => setType(e.target.value as typeof type)}>
            <option value="all">All types</option>
            <option value="internship">Internship</option>
            <option value="full_time">Full-time</option>
            <option value="part_time">Part-time</option>
            <option value="contract">Contract</option>
          </Select>
          <label className="flex items-center gap-2 text-sm text-fg">
            <input
              type="checkbox"
              checked={remoteOnly}
              onChange={(e) => setRemoteOnly(e.target.checked)}
              className="h-4 w-4 rounded border-border"
            />
            Remote only
          </label>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No matching jobs"
          description="Try clearing filters or broadening your search."
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filtered.map((job) => (
            <JobCard key={job.id} job={job} profile={matchProfile} />
          ))}
        </div>
      )}
    </div>
  );
}
