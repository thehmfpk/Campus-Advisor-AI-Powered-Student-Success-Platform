import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ShieldCheck, Lock, Mail, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button, Input } from '@/components/ui';
import { useAuth } from '@/features/auth/AuthContext';
import { isAdminEmail } from '@/lib/adminConfig';

/**
 * Dedicated admin login (login-only, no sign-up). Only the configured admin
 * email may enter. If already signed in as admin, redirects to the dashboard.
 */
export default function AdminLoginPage() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') navigate('/admin', { replace: true });
  }, [user, navigate]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!isAdminEmail(normalized)) {
      toast.error('This account is not authorized for admin access.');
      return;
    }
    setSubmitting(true);
    try {
      await signIn(normalized, password);
      toast.success('Welcome back, Admin.');
      navigate('/admin', { replace: true });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Sign in failed.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-deep px-6">
      {/* ambient glows */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-brand-2/20 blur-3xl" />

      <div className="relative w-full max-w-md animate-fade-in">
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-fg"
        >
          <ArrowLeft className="h-4 w-4" /> Back to site
        </Link>

        <div className="rounded-3xl border border-border bg-surface/80 p-8 shadow-2xl backdrop-blur glow-brand">
          <div className="mb-6 flex flex-col items-center text-center">
            <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg">
              <ShieldCheck className="h-7 w-7" />
            </span>
            <h1 className="mt-4 text-2xl font-bold text-fg">Admin Access</h1>
            <p className="mt-1 text-sm text-muted">Authorized administrators only.</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-muted" />
              <Input
                label="Admin email"
                type="email"
                autoComplete="username"
                placeholder="admin@example.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-[38px] h-4 w-4 text-muted" />
              <Input
                label="Password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full" loading={submitting}>
              <ShieldCheck className="h-4 w-4" /> Enter Admin Dashboard
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted">
            This is a restricted area. Student accounts should use the normal login.
          </p>
        </div>
      </div>
    </div>
  );
}
