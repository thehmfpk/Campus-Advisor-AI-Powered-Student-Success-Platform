import { Link } from 'react-router-dom';
import {
  GraduationCap,
  ArrowRight,
  Bot,
  Briefcase,
  Calculator,
  FileText,
  BookOpen,
  Users,
  Trophy,
  Sparkles,
  UserPlus,
  Target,
  Rocket,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/features/auth/AuthContext';

const FEATURES = [
  { icon: Bot, title: 'AI Academic Advisor', desc: 'Study plans, exam prep, and semester planning tailored to your subjects.' },
  { icon: Rocket, title: 'AI Career Advisor', desc: 'Personalized roadmaps, skills, and interview preparation.' },
  { icon: BookOpen, title: 'Coding Mentor', desc: 'Clear explanations and examples across languages and CS concepts.' },
  { icon: FileText, title: 'AI CV Builder', desc: 'Build an ATS-friendly CV and get AI suggestions to improve it.' },
  { icon: Briefcase, title: 'Jobs & Internships', desc: 'Discover roles with explainable AI match scores.' },
  { icon: Calculator, title: 'GPA / CGPA Calculator', desc: 'Accurate, transparent calculations on the HEC 4.0 scale.' },
  { icon: Users, title: 'University Community', desc: 'Connect with students across universities and share opportunities.' },
  { icon: Trophy, title: 'University Rankings', desc: 'Verified rankings with clearly cited source and year.' },
];

const STEPS = [
  { icon: UserPlus, title: 'Create your profile', desc: 'Add your university, subjects, skills, and interests.' },
  { icon: Target, title: 'Tell us your goals', desc: 'Share what you want to achieve academically and in your career.' },
  { icon: Bot, title: 'Get AI guidance', desc: 'Personalized recommendations from specialized AI agents.' },
  { icon: Briefcase, title: 'Discover opportunities', desc: 'Find matched jobs, internships, and community events.' },
  { icon: Rocket, title: 'Build your career', desc: 'Create your CV, track progress, and grow with confidence.' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const primaryHref = user ? (user.role === 'admin' ? '/admin' : '/app/dashboard') : '/signup';

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border bg-bg/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-brand-fg">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-semibold text-fg">Campus Advisor</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            {user ? (
              <Link to={primaryHref}>
                <Button size="sm">Go to app</Button>
              </Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block">
                  <Button variant="ghost" size="sm">
                    Sign in
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm">Get Started</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center sm:py-28">
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3 py-1 text-xs font-medium text-brand">
          <Sparkles className="h-3.5 w-3.5" /> AI-powered • 100% free-tier • Student-first
        </span>
        <h1 className="mt-6 text-4xl font-bold tracking-tight text-fg sm:text-6xl">
          Your AI-Powered <span className="text-brand">Campus Companion</span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">
          Study smarter. Build your career. Discover opportunities. Connect with your university
          community.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to={primaryHref}>
            <Button size="lg">
              Get Started <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <a href="#features">
            <Button size="lg" variant="secondary">
              Explore Campus Advisor
            </Button>
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-fg">Everything you need to succeed</h2>
          <p className="mt-2 text-muted">One platform for your entire academic and career journey.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-border bg-surface p-5 shadow-card transition hover:-translate-y-0.5 hover:border-brand"
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-soft text-brand">
                <f.icon className="h-5 w-5" />
              </span>
              <h3 className="mt-3 font-semibold text-fg">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-surface py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-fg">How it works</h2>
            <p className="mt-2 text-muted">From sign-up to success in five steps.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-bg p-5">
                <span className="absolute -top-3 left-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-brand-fg">
                  {i + 1}
                </span>
                <s.icon className="mt-2 h-6 w-6 text-brand" />
                <h3 className="mt-3 text-sm font-semibold text-fg">{s.title}</h3>
                <p className="mt-1 text-xs text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-brand to-brand/80 p-10 text-brand-fg sm:p-14">
          <h2 className="text-3xl font-bold">Your university journey deserves an advisor.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/85">
            Join Campus Advisor today and turn your goals into a clear, actionable plan.
          </p>
          <Link to={primaryHref} className="mt-8 inline-block">
            <Button size="lg" variant="secondary">
              Get Started for free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <p>Campus Advisor — Your AI-Powered Campus Companion.</p>
        <p className="mt-1 text-xs">Built free-tier-first · No credit card required.</p>
      </footer>
    </div>
  );
}
