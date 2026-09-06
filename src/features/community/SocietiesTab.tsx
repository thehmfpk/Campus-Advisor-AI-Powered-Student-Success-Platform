import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Users, Search, ExternalLink, Check, Plus } from 'lucide-react';
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
import { useProfile } from '@/features/profile/useProfile';
import { useSocieties, useToggleSociety, type Society } from './useSocieties';

function SocietyCard({ society, profileId }: { society: Society; profileId?: string }) {
  const toggle = useToggleSociety(profileId);
  const onToggle = async () => {
    try {
      await toggle.mutateAsync({ societyId: society.id, joined: society.joined });
      toast.success(society.joined ? `Left ${society.name}` : `Joined ${society.name}! 🎉`);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Action failed.');
    }
  };
  const initials = society.name.split(/\s+/).slice(0, 2).map((w) => w[0]).join('');
  return (
    <Card className="card-hover">
      <CardBody className="flex h-full flex-col">
        <div className="flex items-start gap-3">
          <span
            className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl text-sm font-bold text-white"
            style={{ backgroundColor: society.color }}
          >
            {initials}
          </span>
          <div className="min-w-0">
            <h3 className="font-semibold leading-tight text-fg">{society.name}</h3>
            <Badge tone="neutral" className="mt-1">{society.category}</Badge>
          </div>
        </div>
        <p className="mt-3 flex-1 text-sm text-muted">{society.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 text-xs text-muted">
            <Users className="h-3.5 w-3.5" /> {society.member_count} member{society.member_count === 1 ? '' : 's'}
          </span>
          <div className="flex items-center gap-2">
            {society.website && (
              <a href={society.website} target="_blank" rel="noreferrer" title="Visit website">
                <Button size="sm" variant="ghost"><ExternalLink className="h-3.5 w-3.5" /></Button>
              </a>
            )}
            <Button
              size="sm"
              variant={society.joined ? 'secondary' : 'primary'}
              onClick={onToggle}
              loading={toggle.isPending}
            >
              {society.joined ? (
                <><Check className="h-3.5 w-3.5" /> Joined</>
              ) : (
                <><Plus className="h-3.5 w-3.5" /> Join</>
              )}
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}

export function SocietiesTab() {
  const { data: profile } = useProfile();
  const { data: societies, isLoading, isError, refetch } = useSocieties(profile?.id);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(
    () => Array.from(new Set((societies ?? []).map((s) => s.category))).sort(),
    [societies],
  );

  const filtered = useMemo(() => {
    if (!societies) return [];
    const q = query.trim().toLowerCase();
    return societies.filter((s) => {
      if (category !== 'all' && s.category !== category) return false;
      if (q && !`${s.name} ${s.description} ${s.category}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [societies, query, category]);

  return (
    <div>
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input className="pl-9" placeholder="Search societies…" value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <Select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-52 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState icon={Users} title="No societies found" description="Try a different search or category." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <SocietyCard key={s.id} society={s} profileId={profile?.id} />
          ))}
        </div>
      )}
    </div>
  );
}
