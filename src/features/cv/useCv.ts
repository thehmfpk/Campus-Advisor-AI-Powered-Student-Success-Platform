import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/features/auth/AuthContext';
import type { CvProfile } from '@/types/db';

export type CvData = Omit<CvProfile, 'id' | 'profile_id'>;

export const emptyCv: CvData = {
  template: 'ats-classic',
  headline: '',
  summary: '',
  personal: { full_name: '', email: '', phone: '', location: '' },
  skills: [],
  languages: [],
  links: [],
  certifications: [],
  achievements: [],
  education: [],
  experience: [],
  projects: [],
};

export function useCv(profileId?: string) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ['cv', user?.id],
    enabled: Boolean(profileId && supabase),
    queryFn: async (): Promise<CvData | null> => {
      if (!supabase || !profileId) return null;
      const { data, error } = await supabase
        .from('cv_profiles')
        .select('*')
        .eq('profile_id', profileId)
        .maybeSingle();
      if (error) throw new Error(error.message);
      if (!data) return null;
      const { id: _id, profile_id: _pid, ...rest } = data as CvProfile;
      return rest as CvData;
    },
  });
}

export function useSaveCv(profileId?: string) {
  const qc = useQueryClient();
  const { user } = useAuth();
  return useMutation({
    mutationFn: async (cv: CvData) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      const { error } = await supabase
        .from('cv_profiles')
        .upsert({ profile_id: profileId, ...cv }, { onConflict: 'profile_id' });
      if (error) throw new Error(error.message);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['cv', user?.id] }),
  });
}
