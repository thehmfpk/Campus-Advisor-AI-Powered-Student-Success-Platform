import { useMemo, useState } from 'react';
import { Trophy, Search, Info } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import {
  Badge,
  Card,
  CardBody,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Skeleton,
} from '@/components/ui';
import { useRankings } from './useRankings';
import type { RankingRecord } from '@/types/db';

type SortKey = 'position' | 'name' | 'year';

export default function RankingsPage() {
  const { data: rankings, isLoading, isError, refetch } = useRankings();
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('all');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState<SortKey>('position');

  const countries = useMemo(
    () => Array.from(new Set((rankings ?? []).map((r) => r.country))).sort(),
    [rankings],
  );
  const categories = useMemo(
    () => Array.from(new Set((rankings ?? []).map((r) => r.category))).sort(),
    [rankings],
  );

  const filtered = useMemo(() => {
    if (!rankings) return [];
    const q = query.trim().toLowerCase();
    const list = rankings.filter((r) => {
      if (country !== 'all' && r.country !== country) return false;
      if (category !== 'all' && r.category !== category) return false;
      if (q && !r.university_name.toLowerCase().includes(q)) return false;
      return true;
    });
    return [...list].sort((a, b) => {
      if (sort === 'name') return a.university_name.localeCompare(b.university_name);
      if (sort === 'year') return b.year - a.year;
      return a.position - b.position;
    });
  }, [rankings, query, country, category, sort]);

  return (
    <div>
      <PageHeader
        title="University Rankings"
        description="Verified rankings with clearly cited source and year."
        action={<Badge tone="accent"><Trophy className="h-3 w-3" /> {rankings?.length ?? 0} records</Badge>}
      />

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-border bg-surface-2 p-3 text-xs text-muted">
        <Info className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Every ranking shows its source and year. Campus Advisor does not invent ranking
          positions — always verify against the cited source for official use.
        </span>
      </div>

      <Card className="mb-6">
        <CardBody className="grid gap-3 sm:grid-cols-4">
          <div className="relative sm:col-span-2">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <Input className="pl-9" placeholder="Search university…" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <Select value={country} onChange={(e) => setCountry(e.target.value)}>
            <option value="all">All countries</option>
            {countries.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
          <Select value={sort} onChange={(e) => setSort(e.target.value as SortKey)}>
            <option value="position">Sort: Position</option>
            <option value="name">Sort: Name</option>
            <option value="year">Sort: Year</option>
          </Select>
          <Select className="sm:col-span-4 sm:w-64" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </Select>
        </CardBody>
      </Card>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Trophy} title="No rankings found" description="Try adjusting your filters." />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <RankingRow key={r.id} record={r} />
          ))}
        </div>
      )}
    </div>
  );
}

function RankingRow({ record }: { record: RankingRecord }) {
  return (
    <Card>
      <CardBody className="flex items-center gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-lg font-bold text-brand">
          #{record.position}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold text-fg">{record.university_name}</p>
          <p className="text-xs text-muted">{record.country}</p>
        </div>
        <div className="hidden text-right sm:block">
          <Badge tone="neutral">{record.category}</Badge>
          <p className="mt-1 text-xs text-muted">
            {record.source} ({record.year})
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
