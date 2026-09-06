import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SEED_RANKINGS } from '@/data/rankings';
import type { RankingRecord } from '@/types/db';

export function useRankings() {
  return useQuery({
    queryKey: ['rankings'],
    queryFn: async (): Promise<RankingRecord[]> => {
      if (supabase) {
        const { data, error } = await supabase
          .from('ranking_records')
          .select('*')
          .order('position', { ascending: true });
        if (error) throw new Error(error.message);
        if (data && data.length) return data as RankingRecord[];
      }
      return SEED_RANKINGS.map((r, i) => ({ id: `seed-${i}`, ...r }));
    },
  });
}
