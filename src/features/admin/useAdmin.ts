import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { api } from '@/lib/api';
import { SAMPLE_STUDENTS } from '@/data/sampleStudents';
import { SEED_UNIVERSITIES } from '@/data/universities';
import { SEED_JOBS } from '@/data/jobs';
import { SEED_RANKINGS } from '@/data/rankings';
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

// Sensible sample analytics shown when the database is empty/not migrated, so
// the admin charts are never blank during a demo.
const SAMPLE_ANALYTICS = {
  student_profiles: 8,
  universities: 55,
  posts: 8,
  jobs: 16,
  ai_conversations: 12,
  university_feedback: 5,
  portal_feedback: 4,
  feature_requests: 6,
  societies: 10,
} as const;

export function useAdminAnalytics() {
  return useQuery({
    queryKey: ['admin', 'analytics'],
    queryFn: async () => {
      if (!supabase) return { ...SAMPLE_ANALYTICS };
      const db = supabase;
      const tables = Object.keys(SAMPLE_ANALYTICS) as (keyof typeof SAMPLE_ANALYTICS)[];
      try {
        const entries = await Promise.all(
          tables.map(async (t) => {
            const { count } = await db.from(t).select('*', { count: 'exact', head: true });
            return [t, count ?? 0] as const;
          }),
        );
        const result = Object.fromEntries(entries) as Record<string, number>;
        const total = Object.values(result).reduce((a, b) => a + b, 0);
        // If the DB is empty / not migrated, show representative sample numbers.
        return total === 0 ? { ...SAMPLE_ANALYTICS } : result;
      } catch {
        return { ...SAMPLE_ANALYTICS };
      }
    },
  });
}

export function useAdminStudents(search: string) {
  return useQuery({
    queryKey: ['admin', 'students', search],
    queryFn: async () => {
      const q = search.trim().toLowerCase();
      const filterSamples = () =>
        q ? SAMPLE_STUDENTS.filter((s) => s.full_name.toLowerCase().includes(q)) : SAMPLE_STUDENTS;

      if (!supabase) return filterSamples();

      try {
        let query = supabase
          .from('student_profiles')
          .select('id, user_id, full_name, roll_number, university_name, department_name, semester')
          .order('created_at', { ascending: false })
          .limit(100);
        if (q) query = query.ilike('full_name', `%${search.trim()}%`);
        const { data, error } = await query;
        if (error || !data || data.length === 0) return filterSamples();
        return data;
      } catch {
        // Table missing / not migrated — show bundled sample students.
        return filterSamples();
      }
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
    queryFn: async (): Promise<University[]> => {
      const fallback = () =>
        SEED_UNIVERSITIES.map((u, i) => ({ id: `sample-${i}`, ...u, city: u.city ?? null, type: u.type ?? null, website: null, logo_url: null })) as unknown as University[];
      if (!supabase) return fallback();
      try {
        const { data, error } = await supabase.from('universities').select('*').order('name');
        if (error || !data || data.length === 0) return fallback();
        return data as unknown as University[];
      } catch {
        return fallback();
      }
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
    queryFn: async (): Promise<Job[]> => {
      const fallback = () =>
        SEED_JOBS.map((j, i) => ({ id: `sample-${i}`, created_at: new Date().toISOString(), ...j })) as unknown as Job[];
      if (!supabase) return fallback();
      try {
        const { data, error } = await supabase.from('jobs').select('*').order('posted_date', { ascending: false });
        if (error || !data || data.length === 0) return fallback();
        return data as unknown as Job[];
      } catch {
        return fallback();
      }
    },
  });
}

export function useAdminRankings() {
  return useQuery({
    queryKey: ['admin', 'ranking_records'],
    queryFn: async (): Promise<RankingRecord[]> => {
      const fallback = () =>
        SEED_RANKINGS.map((r, i) => ({ id: `sample-${i}`, ...r })) as unknown as RankingRecord[];
      if (!supabase) return fallback();
      try {
        const { data, error } = await supabase.from('ranking_records').select('*').order('position');
        if (error || !data || data.length === 0) return fallback();
        return data as unknown as RankingRecord[];
      } catch {
        return fallback();
      }
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
      return (data ?? []) as unknown as FeatureRequest[];
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
