import { useMemo, useState } from 'react';
import { toast } from 'sonner';
import { Users, Search, Send } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import {
  Avatar,
  Button,
  Card,
  CardBody,
  EmptyState,
  ErrorState,
  Input,
  Select,
  Skeleton,
} from '@/components/ui';
import { Tabs } from '@/components/ui';
import { useProfile } from '@/features/profile/useProfile';
import { moderatePost } from '@/lib/moderation';
import { PostCard } from './PostCard';
import { SocietiesTab } from './SocietiesTab';
import { POST_CATEGORIES } from './categories';
import { useCreatePost, usePosts } from './useCommunity';
import type { PostCategory } from '@/types/db';

function FeedTab() {
  const { data: profile } = useProfile();
  const { data: posts, isLoading, isError, refetch } = usePosts(profile?.id);
  const createPost = useCreatePost(profile?.id, profile?.university_name);

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('general');
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState<'all' | PostCategory>('all');

  const filtered = useMemo(() => {
    if (!posts) return [];
    const q = query.trim().toLowerCase();
    return posts.filter((p) => {
      if (filterCat !== 'all' && p.category !== filterCat) return false;
      if (q) {
        const hay = `${p.content} ${p.author_name} ${p.university_name ?? ''}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [posts, query, filterCat]);

  const submit = async () => {
    const check = moderatePost(content);
    if (!check.ok) {
      toast.error(check.reason);
      return;
    }
    try {
      await createPost.mutateAsync({ category, content: content.trim() });
      setContent('');
      setCategory('general');
      toast.success('Posted to the community!');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Could not post.');
    }
  };

  return (
    <div>
      {/* Composer */}
      <Card className="mb-6">
        <CardBody>
          <div className="flex items-start gap-3">
            <Avatar name={profile?.full_name ?? 'You'} src={profile?.avatar_url} size={40} />
            <div className="flex-1 space-y-3">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share something with your community…"
                rows={3}
                className="w-full resize-none rounded-xl border border-border bg-surface p-3 text-sm text-fg"
              />
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Select
                  className="w-48"
                  value={category}
                  onChange={(e) => setCategory(e.target.value as PostCategory)}
                >
                  {POST_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </Select>
                <Button onClick={submit} loading={createPost.isPending} disabled={!content.trim()}>
                  <Send className="h-4 w-4" /> Post
                </Button>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Filters */}
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_200px]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <Input
            className="pl-9"
            placeholder="Search posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <Select value={filterCat} onChange={(e) => setFilterCat(e.target.value as typeof filterCat)}>
          <option value="all">All categories</option>
          {POST_CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </Select>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      ) : isError ? (
        <ErrorState onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No posts yet"
          description="Be the first to share something with your community."
        />
      ) : (
        <div className="space-y-4">
          {filtered.map((post) => (
            <PostCard key={post.id} post={post} myProfileId={profile?.id} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommunityPage() {
  const [tab, setTab] = useState('feed');
  return (
    <div>
      <PageHeader
        title="University Community"
        description="Connect with students across universities. Share posts and join societies like GDGoC, AWS & GitHub."
      />
      <Tabs
        active={tab}
        onChange={setTab}
        tabs={[
          { key: 'feed', label: 'Feed', icon: <Send className="h-4 w-4" /> },
          { key: 'societies', label: 'Societies & Clubs', icon: <Users className="h-4 w-4" /> },
        ]}
      />
      {tab === 'feed' ? <FeedTab /> : <SocietiesTab />}
    </div>
  );
}
