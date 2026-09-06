import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthContext';
import type { StudentProfile, StudentSubject } from '@/types/db';

export const profileKeys = {
  profile: (userId?: string) => ['profile', userId] as const,
  subjects: (profileId?: string) => ['subjects', profileId] as const,
};

export function useProfile() {
  const { user } = useAuth();
  return useQuery({
    queryKey: profileKeys.profile(user?.id),
    enabled: Boolean(user && supabase),
    queryFn: async (): Promise<StudentProfile | null> => {
      if (!supabase || !user) return null;
      const { data, error } = await supabase
        .from('student_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();
      if (error) throw new Error(error.message);
      return data as unknown as StudentProfile | null;
    },
  });
}

export function useSubjects(profileId?: string) {
  return useQuery({
    queryKey: profileKeys.subjects(profileId),
    enabled: Boolean(profileId && supabase),
    queryFn: async (): Promise<StudentSubject[]> => {
      if (!supabase || !profileId) return [];
      const { data, error } = await supabase
        .from('student_subjects')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: true });
      if (error) throw new Error(error.message);
      return (data ?? []) as unknown as StudentSubject[];
    },
  });
}

export function useUpdateProfile() {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (patch: Partial<StudentProfile>) => {
      if (!supabase || !user) throw new Error('Not configured');
      const { error } = await supabase
        .from('student_profiles')
        .update(patch)
        .eq('user_id', user.id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: profileKeys.profile(user?.id) });
    },
  });
}

export function useAddSubject(profileId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (subject: {
      subject_name: string;
      credit_hours: number;
      grade?: string | null;
      marks?: number | null;
    }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase
        .from('student_subjects')
        .insert({ profile_id: profileId, ...subject });
      if (error) {
        // Surface the max-7 trigger error in a friendly way.
        if (error.message.toLowerCase().includes('at most 7'))
          throw new Error('You can add a maximum of 7 subjects.');
        throw new Error(error.message);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.subjects(profileId) }),
  });
}

export function useDeleteSubject(profileId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!supabase) throw new Error('Not configured');
      const { error } = await supabase.from('student_subjects').delete().eq('id', id);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: profileKeys.subjects(profileId) }),
  });
}
