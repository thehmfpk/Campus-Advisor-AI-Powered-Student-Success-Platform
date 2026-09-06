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

/** Map a Supabase session + profile row into our AuthUser. */
async function loadAuthUser(session: Session | null): Promise<AuthUser | null> {
  if (!session?.user || !supabase) return null;
  const meta = session.user.user_metadata ?? {};
  // Role and full name are stored on the user row; fall back to metadata.
  let role: Role = (meta.role as Role) ?? 'student';
  let fullName = (meta.full_name as string) ?? session.user.email ?? 'Student';

  const { data } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .maybeSingle();
  if (data?.role) role = data.role as Role;

  const { data: profile } = await supabase
    .from('student_profiles')
    .select('full_name')
    .eq('user_id', session.user.id)
    .maybeSingle();
  if (profile?.full_name) fullName = profile.full_name;

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
        data: { full_name: input.fullName, role: 'student' },
      },
    });
    if (error) throw new Error(mapAuthError(error.message));
    // Create the profile row (RLS allows the owner to insert their own profile).
    if (data.user) {
      await supabase.from('student_profiles').upsert(
        {
          user_id: data.user.id,
          full_name: input.fullName,
          roll_number: input.rollNumber,
          university_name: input.university,
          department_name: input.department,
          semester: input.semester,
        },
        { onConflict: 'user_id' },
      );
      await supabase.from('users').upsert(
        { id: data.user.id, email: input.email, role: 'student' },
        { onConflict: 'id' },
      );
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
