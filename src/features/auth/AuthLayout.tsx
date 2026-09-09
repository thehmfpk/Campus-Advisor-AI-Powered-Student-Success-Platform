import { GraduationCap, Bot, Briefcase, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
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
      {/* Brand panel — logo + short designed blurb */}
      <div className="relative hidden overflow-hidden bg-brand-gradient p-12 text-white lg:flex lg:flex-col lg:justify-between">
        {/* decorative glows */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        {/* Logo */}
        <Link to="/" className="relative flex items-center gap-2.5">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
            <GraduationCap className="h-6 w-6" />
          </span>
          <span className="text-xl font-bold tracking-tight">Campus Advisor</span>
        </Link>

        {/* Short designed blurb */}
        <div className="relative">
          <h2 className="text-4xl font-extrabold leading-[1.15]">
            Your AI-Powered
            <br />
            Campus Companion.
          </h2>
          <p className="mt-5 max-w-sm text-lg text-white/85">
            Study smarter. Build your career. Discover opportunities.
          </p>

          <ul className="mt-8 space-y-3 text-sm text-white/90">
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <Bot className="h-4 w-4" />
              </span>
              Specialized AI advisors for study & career
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <Briefcase className="h-4 w-4" />
              </span>
              Jobs matched to your skills
            </li>
            <li className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white/15">
                <Trophy className="h-4 w-4" />
              </span>
              University rankings & community
            </li>
          </ul>
        </div>

        <p className="relative text-xs text-white/60">100% free · No credit card required</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col bg-bg">
        <div className="flex items-center justify-between p-6">
          <Link to="/" className="flex items-center gap-2 lg:hidden">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-gradient text-white">
              <GraduationCap className="h-4 w-4" />
            </span>
            <span className="font-bold text-fg">Campus Advisor</span>
          </Link>
          <div className="ml-auto flex items-center gap-2">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-sm animate-fade-in">
            <h1 className="text-2xl font-bold text-fg">{title}</h1>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>

            {!isSupabaseConfigured && (
              <div className="mt-4 rounded-xl border border-warning/40 bg-warning/10 p-3 text-xs text-fg">
                Sign-in is not configured yet. Add <code>VITE_SUPABASE_URL</code> and{' '}
                <code>VITE_SUPABASE_ANON_KEY</code> in your environment to enable accounts.
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
