import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { GraduationCap, LogOut, Menu, Shield, X } from 'lucide-react';
import { toast } from 'sonner';
import { studentNav } from './nav';
import { useAuth } from '@/features/auth/AuthContext';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useI18n } from '@/i18n/LanguageProvider';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/cn';

export function AppLayout() {
  const { user, signOut } = useAuth();
  const { t } = useI18n();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out.');
    navigate('/', { replace: true });
  };

  const navLinks = (
    <nav className="space-y-1">
      {studentNav.map(({ to, key, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
              isActive
                ? 'bg-brand-soft text-brand'
                : 'text-muted hover:bg-surface-2 hover:text-fg',
            )
          }
        >
          <Icon className="h-4.5 w-4.5" />
          {t(key, label)}
        </NavLink>
      ))}
      {user?.role === 'admin' && (
        <NavLink
          to="/admin"
          onClick={() => setMobileOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
              isActive ? 'bg-accent/15 text-accent' : 'text-muted hover:bg-surface-2 hover:text-fg',
            )
          }
        >
          <Shield className="h-4.5 w-4.5" />
          {t('nav.admin', 'Admin')}
        </NavLink>
      )}
    </nav>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-border bg-surface lg:flex">
        <Link to="/app/dashboard" className="flex items-center gap-2 px-5 py-5">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-fg">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span className="text-lg font-semibold text-fg">Campus Advisor</span>
        </Link>
        <div className="flex-1 overflow-y-auto px-3 py-2">{navLinks}</div>
        <div className="border-t border-border p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <Avatar name={user?.fullName ?? 'Student'} size={36} />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-fg">{user?.fullName}</p>
              <p className="truncate text-xs text-muted">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-muted transition hover:bg-surface-2 hover:text-danger"
          >
            <LogOut className="h-4.5 w-4.5" /> {t('nav.signOut', 'Sign out')}
          </button>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border bg-surface/80 px-4 py-3 backdrop-blur lg:hidden">
        <button
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border"
        >
          <Menu className="h-5 w-5" />
        </button>
        <span className="font-semibold text-fg">{t('app.name', 'Campus Advisor')}</span>
        <ThemeToggle />
      </header>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[80%] bg-surface p-4 shadow-xl animate-fade-in">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold text-fg">Menu</span>
              <button
                onClick={() => setMobileOpen(false)}
                aria-label="Close menu"
                className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-border"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {navLinks}
            <button
              onClick={handleSignOut}
              className="mt-4 flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-danger hover:bg-surface-2"
            >
              <LogOut className="h-4.5 w-4.5" /> {t('nav.signOut', 'Sign out')}
            </button>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Desktop top bar */}
        <div className="hidden items-center justify-end gap-3 border-b border-border bg-surface/60 px-6 py-3 backdrop-blur lg:flex">
          <ThemeToggle />
        </div>
        <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
