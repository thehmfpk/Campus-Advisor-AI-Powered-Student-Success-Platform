import { GraduationCap } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { isSupabaseConfigured } from '@/lib/supabase';

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Brand panel */}
      <div className="relative hidden flex-col justify-between bg-brand p-10 text-brand-fg lg:flex">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold">Campus Advisor</span>
        </Link>
        <div>
          <h2 className="text-3xl font-bold leading-tight">
            Your AI-Powered Campus Companion.
          </h2>
          <p className="mt-4 max-w-sm text-white/80">
            Study smarter, build your career, discover opportunities, and connect with your
            university community — all in one place.
          </p>
        </div>
        <p className="text-xs text-white/60">100% free-tier • No credit card required</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-bg">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-brand-fg">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-semibold text-fg">Campus Advisor</span>
          </Link>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm animate-fade-in">
            <h1 className="text-2xl font-bold text-fg">{title}</h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>

            {!isSupabaseConfigured && (
              <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-fg">
                Supabase is not configured yet. Add <code>VITE_SUPABASE_URL</code> and{' '}
                <code>VITE_SUPABASE_ANON_KEY</code> to enable authentication.
              </div>
            )}

            <div className="mt-6">{children}</div>
            <div className="mt-6 text-center text-sm text-muted">{footer}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
