import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SEED_NOTES } from '@/data/codingNotes';
import type { CodingNote } from '@/types/db';

export function useNotes() {
  return useQuery({
    queryKey: ['coding-notes'],
    queryFn: async (): Promise<CodingNote[]> => {
      if (supabase) {
        const { data, error } = await supabase
          .from('coding_notes')
          .select('*')
          .order('order', { ascending: true });
        if (error) throw new Error(error.message);
        if (data && data.length) return data as CodingNote[];
      }
      // Fallback so the reader works before the DB is seeded / configured.
      return SEED_NOTES.map((n, i) => ({ id: `seed-${i}`, ...n }));
    },
  });
}
