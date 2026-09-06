import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type {
  FeaturePriority,
  FeatureRequest,
  FeedbackCategory,
} from '@/types/db';

export function useSubmitUniversityFeedback(profileId?: string, universityName?: string | null) {
  return useMutation({
    mutationFn: async (input: {
      category: FeedbackCategory;
      rating: number;
      feedback: string;
      semester?: string;
      department?: string;
    }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase.from('university_feedback').insert({
        profile_id: profileId,
        university_name: universityName ?? null,
        ...input,
      });
      if (error) throw new Error(error.message);
    },
  });
}

export function useSubmitPortalFeedback(profileId?: string) {
  return useMutation({
    mutationFn: async (input: { type: 'bug' | 'ux' | 'general'; message: string }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase
        .from('portal_feedback')
        .insert({ profile_id: profileId, ...input });
      if (error) throw new Error(error.message);
    },
  });
}

export function useFeatureRequests(profileId?: string) {
  return useQuery({
    queryKey: ['feature-requests', profileId],
    enabled: Boolean(profileId && supabase),
    queryFn: async (): Promise<FeatureRequest[]> => {
      if (!supabase || !profileId) return [];
      const { data, error } = await supabase
        .from('feature_requests')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as FeatureRequest[];
    },
  });
}

export function useSubmitFeatureRequest(profileId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      title: string;
      description: string;
      category?: string;
      priority: FeaturePriority;
    }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase
        .from('feature_requests')
        .insert({ profile_id: profileId, ...input });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['feature-requests', profileId] }),
  });
}
