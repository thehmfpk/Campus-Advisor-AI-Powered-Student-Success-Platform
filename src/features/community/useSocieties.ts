import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SEED_SOCIETIES } from '@/data/societies';

export interface Society {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  color: string;
  website: string | null;
  member_count: number;
  joined: boolean;
}

/**
 * Lists societies with member counts and whether the current student has
 * joined. Falls back to the seed list (not joinable) when Supabase isn't
 * configured, so the directory always renders.
 */
export function useSocieties(profileId?: string) {
  return useQuery({
    queryKey: ['societies', profileId],
    queryFn: async (): Promise<Society[]> => {
      const bundled = (): Society[] =>
        SEED_SOCIETIES.map((s, i) => ({ id: `seed-${i}`, ...s, member_count: 0, joined: false }));
      if (!supabase) return bundled();

      let rows: Record<string, unknown>[] = [];
      try {
        const { data, error } = await supabase.from('societies').select('*').order('name');
        if (error || !data || data.length === 0) return bundled();
        rows = data as Record<string, unknown>[];
      } catch {
        return bundled();
      }
      const societies = rows;

      // Member counts (defensive — table may not exist yet).
      let memberships: { society_id: string; profile_id: string }[] = [];
      try {
        const { data } = await supabase
          .from('society_memberships')
          .select('society_id, profile_id');
        memberships = (data ?? []) as { society_id: string; profile_id: string }[];
      } catch {
        memberships = [];
      }
      const counts = new Map<string, number>();
      const mine = new Set<string>();
      for (const m of memberships ?? []) {
        counts.set(m.society_id, (counts.get(m.society_id) ?? 0) + 1);
        if (profileId && m.profile_id === profileId) mine.add(m.society_id);
      }

      return societies.map((s: Record<string, unknown>) => ({
        id: s.id as string,
        name: s.name as string,
        slug: s.slug as string,
        category: s.category as string,
        description: s.description as string,
        color: (s.color as string) ?? '#2563eb',
        website: (s.website as string) ?? null,
        member_count: counts.get(s.id as string) ?? 0,
        joined: mine.has(s.id as string),
      }));
    },
  });
}

export function useToggleSociety(profileId?: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ societyId, joined }: { societyId: string; joined: boolean }) => {
      if (!supabase || !profileId) throw new Error('Not configured');
      if (joined) {
        const { error } = await supabase
          .from('society_memberships')
          .delete()
          .eq('society_id', societyId)
          .eq('profile_id', profileId);
        if (error) throw new Error(error.message);
      } else {
        const { error } = await supabase
          .from('society_memberships')
          .insert({ society_id: societyId, profile_id: profileId });
        if (error) throw new Error(error.message);
      }
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['societies'] }),
  });
}
