import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { DEMO_POSTS } from '@/data/demoPosts';
import type { Comment, Post, PostCategory } from '@/types/db';

interface PostRow {
  id: string;
  author_id: string;
  university_name: string | null;
  category: PostCategory;
  content: string;
  image_url: string | null;
  status: string;
  likes_count: number;
  created_at: string;
  // PostgREST returns embedded relations as an array or object depending on
  // the relationship; accept both and normalize when mapping.
  student_profiles?:
    | { full_name: string; avatar_url: string | null }
    | { full_name: string; avatar_url: string | null }[]
    | null;
}

/** Normalize a PostgREST embedded relation (array or object) to a single row. */
function firstRelation<T>(rel: T | T[] | null | undefined): T | null {
  if (!rel) return null;
  return Array.isArray(rel) ? (rel[0] ?? null) : rel;
}

export function usePosts(myProfileId?: string) {
  return useQuery({
    queryKey: ['posts'],
    queryFn: async (): Promise<Post[]> => {
      // Bundled demo posts so the feed is never empty (no seeding required).
      if (!supabase) return DEMO_POSTS;

      let data: PostRow[] | null = null;
      try {
        const res = await supabase
          .from('posts')
          .select(
            'id, author_id, university_name, category, content, image_url, status, likes_count, created_at, student_profiles(full_name, avatar_url)',
          )
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(100);
        if (res.error) throw new Error(res.error.message);
        data = res.data as unknown as PostRow[];
      } catch {
        // Table missing / not seeded — show bundled demo posts.
        return DEMO_POSTS;
      }
      if (!data || data.length === 0) return DEMO_POSTS;

      // Which of these has the current user liked?
      let likedIds = new Set<string>();
      if (myProfileId && data.length) {
        const { data: likes } = await supabase
          .from('post_likes')
          .select('post_id')
          .eq('profile_id', myProfileId);
        likedIds = new Set((likes ?? []).map((l) => l.post_id));
      }

      return data.map((p) => {
        const author = firstRelation(p.student_profiles);
        return {
        id: p.id,
        author_id: p.author_id,
        author_name: author?.full_name ?? 'Student',
        author_avatar: author?.avatar_url ?? null,
        university_id: null,
        university_name: p.university_name,
        category: p.category,
        content: p.content,
        image_url: p.image_url,
        status: p.status as Post['status'],
        likes_count: p.likes_count,
        comments_count: 0,
        liked_by_me: likedIds.has(p.id),
        created_at: p.created_at,
        };
      });
    },
  });
}

export function useCreatePost(profileId?: string, universityName?: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: { category: PostCategory; content: string; image_url?: string | null }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase.from('posts').insert({
        author_id: profileId,
        university_name: universityName ?? null,
        category: input.category,
        content: input.content,
        image_url: input.image_url ?? null,
      });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!supabase) throw new Error('Not configured');
      const { error } = await supabase.from('posts').update({ content }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Not configured');
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useToggleLike(profileId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, liked }: { postId: string; liked: boolean }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      if (liked) {
        const { error } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('profile_id', profileId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, profile_id: profileId });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['posts'] }),
  });
}

export function useReportPost(profileId?: string) {
  return useMutation({
    mutationFn: async ({ postId, reason }: { postId: string; reason: string }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase
        .from('post_reports')
        .insert({ post_id: postId, reporter_id: profileId, reason });
      if (error) throw new Error(error.message);
    },
  });
}

export function useComments(postId: string | null) {
  return useQuery({
    queryKey: ['comments', postId],
    enabled: Boolean(postId && supabase),
    queryFn: async (): Promise<Comment[]> => {
      if (!supabase || !postId) return [];
      const { data, error } = await supabase
        .from('comments')
        .select('id, post_id, author_id, content, status, created_at, student_profiles(full_name)')
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []).map((c: Record<string, unknown>) => ({
        id: c.id as string,
        post_id: c.post_id as string,
        author_id: c.author_id as string,
        author_name:
          firstRelation(c.student_profiles as { full_name?: string } | { full_name?: string }[] | null)
            ?.full_name ?? 'Student',
        content: c.content as string,
        status: c.status as Comment['status'],
        created_at: c.created_at as string,
      }));
    },
  });
}

export function useAddComment(profileId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ postId, content }: { postId: string; content: string }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase
        .from('comments')
        .insert({ post_id: postId, author_id: profileId, content });
      if (error) throw new Error(error.message);
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['comments', v.postId] }),
  });
}

export function useDeleteComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }: { id: string; postId: string }) => {
      if (!supabase) throw new Error('Not configured');
      const { error } = await supabase.from('comments').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ['comments', v.postId] }),
  });
}
