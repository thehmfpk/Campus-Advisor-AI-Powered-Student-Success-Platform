import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/app/theme';
import { LanguageProvider } from '@/i18n/LanguageProvider';
import { ErrorBoundary } from '@/app/ErrorBoundary';
import { AppLayout } from '@/app/AppLayout';
import { PageLoader } from '@/components/ui/PageLoader';
import { AuthProvider } from '@/features/auth/AuthContext';
import { RequireAuth, RequireAdmin, RedirectIfAuthed } from '@/features/auth/guards';

// Lazy-loaded routes keep the initial bundle small (R19).
const LandingPage = lazy(() => import('@/features/landing/LandingPage'));
const LoginPage = lazy(() => import('@/features/auth/LoginPage'));
const SignUpPage = lazy(() => import('@/features/auth/SignUpPage'));
const DashboardPage = lazy(() => import('@/features/dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('@/features/profile/ProfilePage'));
const AdvisorPage = lazy(() => import('@/features/advisor/AdvisorPage'));
const JobsPage = lazy(() => import('@/features/jobs/JobsPage'));
const CvPage = lazy(() => import('@/features/cv/CvPage'));
const GpaPage = lazy(() => import('@/features/gpa/GpaPage'));
const NotesPage = lazy(() => import('@/features/notes/NotesPage'));
const CommunityPage = lazy(() => import('@/features/community/CommunityPage'));
const RankingsPage = lazy(() => import('@/features/rankings/RankingsPage'));
const FeedbackPage = lazy(() => import('@/features/feedback/FeedbackPage'));
const AdminPage = lazy(() => import('@/features/admin/AdminPage'));
const AdminLoginPage = lazy(() => import('@/features/admin/AdminLoginPage'));
const KitchenSinkPage = lazy(() => import('@/features/dev/KitchenSinkPage'));
const NotFoundPage = lazy(() => import('@/features/misc/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000, refetchOnWindowFocus: false },
  },
});

export function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <AuthProvider>
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  {/* Public */}
                  <Route path="/" element={<LandingPage />} />
                  <Route
                    path="/login"
                    element={
                      <RedirectIfAuthed>
                        <LoginPage />
                      </RedirectIfAuthed>
                    }
                  />
                  <Route
                    path="/signup"
                    element={
                      <RedirectIfAuthed>
                        <SignUpPage />
                      </RedirectIfAuthed>
                    }
                  />

                  {/* Authenticated student app */}
                  <Route
                    path="/app"
                    element={
                      <RequireAuth>
                        <AppLayout />
                      </RequireAuth>
                    }
                  >
                    <Route index element={<Navigate to="/app/dashboard" replace />} />
                    <Route path="dashboard" element={<DashboardPage />} />
                    <Route path="profile" element={<ProfilePage />} />
                    <Route path="advisor" element={<AdvisorPage />} />
                    <Route path="jobs" element={<JobsPage />} />
                    <Route path="cv" element={<CvPage />} />
                    <Route path="gpa" element={<GpaPage />} />
                    <Route path="notes" element={<NotesPage />} />
                    <Route path="community" element={<CommunityPage />} />
                    <Route path="rankings" element={<RankingsPage />} />
                    <Route path="feedback" element={<FeedbackPage />} />
                  </Route>

                  {/* Admin */}
                  <Route path="/admin/login" element={<AdminLoginPage />} />
                  <Route
                    path="/admin"
                    element={
                      <RequireAdmin>
                        <AdminPage />
                      </RequireAdmin>
                    }
                  />

                  {import.meta.env.DEV && (
                    <Route path="/kitchen-sink" element={<KitchenSinkPage />} />
                  )}
                  <Route path="/404" element={<NotFoundPage />} />
                  <Route path="*" element={<Navigate to="/404" replace />} />
                </Routes>
              </Suspense>
            </AuthProvider>
          </BrowserRouter>
          <Toaster richColors position="top-right" />
        </QueryClientProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
