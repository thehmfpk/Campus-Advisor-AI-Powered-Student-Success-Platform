import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Browser Supabase client (Supabase Free). Uses only the public anon key and
 * URL — never a service-role key. All privileged operations go through /api.
 *
 * If env vars are absent (e.g. local demo before configuring Supabase), we
 * export null and the app degrades gracefully rather than crashing (R20).
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;
