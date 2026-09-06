import { getAdminClient } from './supabaseAdmin';

export interface AuthedUser {
  id: string;
  email: string;
  role: 'student' | 'admin';
  profileId: string | null;
}

/**
 * Verify the Supabase access token from the Authorization header and load the
 * user's role + profile id. Returns null if unauthenticated/invalid (R18).
 */
export async function authenticate(authHeader?: string): Promise<AuthedUser | null> {
  if (!authHeader?.startsWith('Bearer ')) return null;
  const token = authHeader.slice('Bearer '.length);
  const admin = getAdminClient();

  const { data, error } = await admin.auth.getUser(token);
  if (error || !data.user) return null;

  const uid = data.user.id;
  const { data: userRow } = await admin
    .from('users')
    .select('role, is_disabled')
    .eq('id', uid)
    .maybeSingle();

  if (userRow?.is_disabled) return null;

  const { data: profile } = await admin
    .from('student_profiles')
    .select('id')
    .eq('user_id', uid)
    .maybeSingle();

  return {
    id: uid,
    email: data.user.email ?? '',
    role: (userRow?.role as 'student' | 'admin') ?? 'student',
    profileId: profile?.id ?? null,
  };
}

export async function requireAdmin(authHeader?: string): Promise<AuthedUser | null> {
  const user = await authenticate(authHeader);
  if (!user || user.role !== 'admin') return null;
  return user;
}
