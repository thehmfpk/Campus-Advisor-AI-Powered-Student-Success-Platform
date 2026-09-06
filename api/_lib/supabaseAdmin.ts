import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Service-role Supabase client — SERVER-ONLY. Uses the secret service-role key,
 * which must never be exposed to the browser (R18). Bypasses RLS, so all
 * privileged operations that use it must first authenticate the caller.
 */
let cached: SupabaseClient | null = null;

export function getAdminClient(): SupabaseClient {
  if (cached) return cached;
  const url = process.env.VITE_SUPABASE_URL ?? process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase admin client is not configured.');
  }
  cached = createClient(url, key, { auth: { persistSession: false } });
  return cached;
}
