import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { isAdminEmail } from '@/lib/adminConfig';
import type { Role } from '@/types/db';

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  rollNumber: string;
  university: string;
  department: string;
  semester: number;
}

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  fullName: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  configured: boolean;
  accessToken: string | null;
  signUp: (input: SignUpInput) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Create the users + student_profiles rows for a user (idempotent upserts). */
async function ensureUserRecords(
  userId: string,
  email: string,
  fields: {
    full_name: string;
    roll_number?: string;
    university_name?: string;
    department_name?: string;
    semester?: number;
  },
): Promise<void> {
  if (!supabase) return;
  try {
    await supabase.from('users').upsert({ id: userId, email, role: 'student' }, { onConflict: 'id' });
    await supabase.from('student_profiles').upsert(
      {
        user_id: userId,
        full_name: fields.full_name,
        roll_number: fields.roll_number ?? null,
        university_name: fields.university_name ?? null,
        department_name: fields.department_name ?? null,
        semester: fields.semester ?? null,
      },
      { onConflict: 'user_id' },
    );
  } catch {
    /* non-fatal — the profile page can still create/update later */
  }
}

/** Map a Supabase session + profile row into our AuthUser. */
async function loadAuthUser(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user || !supabase) return null;
  const meta = session.user.user_metadata ?? {};
  const email = session.user.email ?? '';
  let role: Role = (meta.role as Role) ?? 'student';
  let fullName = (meta.full_name as string) ?? email ?? 'Student';

  const { data: userRow } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();
  if (userRow?.role) role = userRow.role as Role;

  // Configured admin emails always get the admin role. Also persist it to the
  // DB (best-effort) so Supabase RLS admin policies apply server-side too.
  if (isAdminEmail(email)) {
    role = 'admin';
    if (userRow?.role !== 'admin') {
      try {
        await supabase.from('users').upsert({ id: session.user.id, email, role: 'admin' }, { onConflict: 'id' });
      } catch {
        /* non-fatal — client still treats them as admin */
      }
    }
  }

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('full_name')
    .eq('user_id', session.user.id)
    .maybeSingle();

  // If the profile row does not exist yet (e.g. created via email confirmation
  // where the signup-time insert had no session), create it now from the
  // registration metadata so the profile is always connected to the account.
  if (!profile) {
    await ensureUserRecords(session.user.id, session.user.email ?? '', {
      full_name: fullName,
      roll_number: meta.roll_number as string | undefined,
      university_name: meta.university_name as string | undefined,
      department_name: meta.department_name as string | undefined,
      semester: meta.semester as number | undefined,
    });
  } else if (profile.full_name) {
    fullName = profile.full_name;
  }

  return { id: session.user.id, email: session.user.email ?? '', role, fullName };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const applySession = useCallback(async (next: Session | null) => {
    setSession(next);
    setUser(await loadAuthUser(next));
  }, []);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      await applySession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      void applySession(next);
    });
    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, [applySession]);

  const signUp = useCallback(async (input: SignUpInput) => {
    if (!supabase) throw new Error('Authentication is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email: input.email,
      password: input.password,
      options: {
        // Stash all registration fields in metadata so the profile can be
        // created reliably even if the immediate insert is blocked by RLS
        // (e.g. when email confirmation is enabled and there is no session yet).
        data: {
          full_name: input.fullName,
          role: 'student',
          roll_number: input.rollNumber,
          university_name: input.university,
          department_name: input.department,
          semester: input.semester,
        },
      },
    });
    if (error) throw new Error(mapAuthError(error.message));
    // Best-effort immediate creation (works when a session is returned).
    if (data.user && data.session) {
      await ensureUserRecords(data.user.id, input.email, {
        full_name: input.fullName,
        roll_number: input.rollNumber,
        university_name: input.university,
        department_name: input.department,
        semester: input.semester,
      });
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!supabase) throw new Error('Authentication is not configured.');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(mapAuthError(error.message));
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    await applySession(data.session);
  }, [applySession]);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      loading,
      configured: isSupabaseConfigured,
      accessToken: session?.access_token ?? null,
      signUp,
      signIn,
      signOut,
      refreshUser,
    }),
    [user, session, loading, signUp, signIn, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

/** Convert raw Supabase auth errors into safe, friendly messages (R18). */
function mapAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes('already registered') || m.includes('already been registered'))
    return 'That email is already registered. Try signing in instead.';
  if (m.includes('invalid login')) return 'Invalid email or password.';
  if (m.includes('password')) return 'Password does not meet requirements (min 8 characters).';
  return 'Authentication failed. Please try again.';
}
