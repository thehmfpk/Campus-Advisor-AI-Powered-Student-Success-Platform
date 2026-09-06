import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import type {
  FeatureRequest,
  FeatureStatus,
  Job,
  Post,
  RankingRecord,
  University,
} from '@/types/db';

/**
 * Admin data hooks. These run with the admin's authenticated session; RLS
 * `is_admin()` policies grant cross-table read + admin write access. Privileged
 * operations that need the service role (e.g. disabling an auth user) go
 * through /api/admin endpoints instead.
 */

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    enabled: Boolean(supabase),
    queryFn: async () => {
      if (!supabase) return null;
      const db = supabase;
      const tables = [
        'student_profiles',
        'universities',
        'posts',
        'jobs',
        'ai_conversations',
        'university_feedback',
        'portal_feedback',
        'feature_requests',
      ] as const;
      const entries = await Promise.all(
        tables.map(async (t) => {
          const { count } = await db.from(t).select('*', { count: 'exact', head: true });
          return [t, count ?? 0] as const;
        }),
      );
      return Object.fromEntries(entries) as Record<(typeof tables)[number], number>;
    },
  });
}

export function useAdminStudents(search: string) {
  return useQuery({
    queryKey: ['admin', 'students', search],
    enabled: Boolean(supabase),
    queryFn: async () => {
      if (!supabase) return [];
      let q = supabase
        .from('student_profiles')
        .select('id, user_id, full_name, roll_number, university_name, department_name, semester')
        .order('created_at', { ascending: false })
        .limit(100);
      if (search.trim()) q = q.ilike('full_name', `%${search.trim()}%`);
      const { data, error } = await q;
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export function useSetStudentStatus(accessToken?: string | null) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ userId, disabled }: { userId: string; disabled: boolean }) => {
      await api('/admin/student-status', {
        method: 'POST',
        token: accessToken ?? undefined,
        body: { userId, disabled },
      });
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'students'] }),
  });
}

export function useAdminReports() {
  return useQuery({
    queryKey: ['admin', 'reports'],
    enabled: Boolean(supabase),
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('post_reports')
        .select('id, post_id, reason, status, created_at, posts(content, status)')
        .order('created_at', { ascending: false })
        .limit(50);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export function useAdminPosts() {
  return useQuery({
    queryKey: ['admin', 'posts'],
    enabled: Boolean(supabase),
    queryFn: async (): Promise<Post[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('posts')
        .select('id, author_id, content, category, status, university_name, likes_count, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as Post[];
    },
  });
}

export function useSetPostStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'published' | 'hidden' | 'removed' }) => {
      if (!supabase) throw new Error('Not configured');
      const { error } = await supabase.from('posts').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'posts'] });
      qc.invalidateQueries({ queryKey: ['admin', 'reports'] });
    },
  });
}

export function useAdminUniversities() {
  return useQuery({
    queryKey: ['admin', 'universities'],
    enabled: Boolean(supabase),
    queryFn: async (): Promise<University[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('universities').select('*').order('name');
      if (error) throw new Error(error.message);
      return (data ?? []) as University[];
    },
  });
}

export function useCrud(table: 'universities' | 'jobs' | 'ranking_records', key: string) {
  const qc = useQueryClient();
  const invalidate = () => qc.invalidateQueries({ queryKey: ['admin', key] });
  return {
    create: useMutation({
      mutationFn: async (row: Record<string, unknown>) => {
        if (!supabase) throw new Error('Not configured');
        const { error } = await supabase.from(table).insert(row);
        if (error) throw new Error(error.message);
      },
      onSuccess: invalidate,
    }),
    remove: useMutation({
      mutationFn: async (id: string) => {
        if (!supabase) throw new Error('Not configured');
        const { error } = await supabase.from(table).delete().eq('id', id);
        if (error) throw new Error(error.message);
      },
      onSuccess: invalidate,
    }),
  };
}

export function useAdminJobs() {
  return useQuery({
    queryKey: ['admin', 'jobs'],
    enabled: Boolean(supabase),
    queryFn: async (): Promise<Job[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('jobs').select('*').order('posted_date', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as Job[];
    },
  });
}

export function useAdminRankings() {
  return useQuery({
    queryKey: ['admin', 'ranking_records'],
    enabled: Boolean(supabase),
    queryFn: async (): Promise<RankingRecord[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase.from('ranking_records').select('*').order('position');
      if (error) throw new Error(error.message);
      return (data ?? []) as RankingRecord[];
    },
  });
}

export function useAdminUniversityFeedback() {
  return useQuery({
    queryKey: ['admin', 'univ-feedback'],
    enabled: Boolean(supabase),
    queryFn: async () => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('university_feedback')
        .select('id, university_name, category, rating, feedback, created_at')
        .order('created_at', { ascending: false })
        .limit(100);
      if (error) throw new Error(error.message);
      return data ?? [];
    },
  });
}

export function useAdminFeatureRequests() {
  return useQuery({
    queryKey: ['admin', 'feature-requests'],
    enabled: Boolean(supabase),
    queryFn: async (): Promise<FeatureRequest[]> => {
      if (!supabase) return [];
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as FeatureRequest[];
    },
  });
}

export function useSetFeatureStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: FeatureStatus }) => {
      if (!supabase) throw new Error('Not configured');
      const { error } = await supabase.from('feature_requests').update({ status }).eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'feature-requests'] }),
  });
}
