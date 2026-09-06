import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SEED_NOTES } from '@/data/codingNotes';
import type { CodingNote } from '@/types/db';

export function useNotes() {
  return useQuery({
    queryKey: ['coding-notes'],
    queryFn: async (): Promise<CodingNote[]> => {
      if (supabase) {
        try {
          const { data, error } = await supabase
            .from('coding_notes')
            .select('*')
            .order('order', { ascending: true });
          if (!error && data && data.length) return data as unknown as CodingNote[];
        } catch {
          /* table missing / not seeded — fall back to bundled notes */
        }
      }
      // Bundled fallback so the reader always works (no migrations/seed needed).
      return SEED_NOTES.map((n, i) => ({ id: `seed-${i}`, ...n }));
    },
  });
}
