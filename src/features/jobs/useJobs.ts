import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { SEED_JOBS } from '@/data/jobs';
import type { Job } from '@/types/db';

/**
 * JobsSourceAdapter interface (design §5). The MVP uses the seed adapter (DB or
 * static fallback); a free/official API adapter can be added later without
 * touching the UI. No scraping, no paid API (R6/R21).
 */
export interface JobsSourceAdapter {
  list(): Promise<Job[]>;
}

function seedToJob(s: (typeof SEED_JOBS)[number], i: number): Job {
  return {
    id: `seed-${i}`,
    created_at: new Date().toISOString(),
    ...s,
  };
}

export const seedJobsAdapter: JobsSourceAdapter = {
  async list() {
    if (supabase) {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_date', { ascending: false });
      if (error) throw new Error(error.message);
      if (data && data.length) return data as Job[];
    }
    // Fallback so the page works even before the DB is seeded / configured.
    return SEED_JOBS.map(seedToJob);
  },
};

export function useJobs() {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => seedJobsAdapter.list(),
  });
}
