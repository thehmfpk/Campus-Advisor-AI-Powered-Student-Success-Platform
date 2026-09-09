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
  CheckCircle2,
  Star,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useAuth } from '@/features/auth/AuthContext';

const FEATURES = [
  { icon: Bot, title: 'AI Academic Advisor', desc: 'Study plans, exam prep, and semester planning tailored to your subjects.', color: 'from-blue-500 to-indigo-500' },
  { icon: Rocket, title: 'AI Career Advisor', desc: 'Personalized roadmaps, skills, and interview preparation.', color: 'from-violet-500 to-purple-500' },
  { icon: BookOpen, title: 'Coding Mentor', desc: 'Clear explanations and examples across languages and CS concepts.', color: 'from-cyan-500 to-sky-500' },
  { icon: FileText, title: 'AI CV Builder', desc: 'Build an ATS-friendly CV and get AI suggestions to improve it.', color: 'from-emerald-500 to-teal-500' },
  { icon: Briefcase, title: 'Jobs & Internships', desc: 'Discover roles with explainable AI match scores and real apply links.', color: 'from-amber-500 to-orange-500' },
  { icon: Calculator, title: 'GPA / CGPA Calculator', desc: 'Accurate, transparent calculations on the HEC 4.0 scale.', color: 'from-rose-500 to-pink-500' },
  { icon: Users, title: 'Communities & Societies', desc: 'Join GDGoC, AWS, GitHub campus clubs and connect across universities.', color: 'from-fuchsia-500 to-pink-500' },
  { icon: Trophy, title: 'University Rankings', desc: 'Verified rankings with clearly cited source and year.', color: 'from-yellow-500 to-amber-500' },
];

const STEPS = [
  { icon: UserPlus, title: 'Create your profile', desc: 'Add your university, subjects, skills, and interests.' },
  { icon: Target, title: 'Tell us your goals', desc: 'Share what you want to achieve academically and in your career.' },
  { icon: Bot, title: 'Get AI guidance', desc: 'Personalized recommendations from specialized AI agents.' },
  { icon: Briefcase, title: 'Discover opportunities', desc: 'Find matched jobs, internships, and community events.' },
  { icon: Rocket, title: 'Build your career', desc: 'Create your CV, track progress, and grow with confidence.' },
];

const STATS = [
  { value: '4', label: 'AI advisor agents' },
  { value: '10+', label: 'Coding topics' },
  { value: '50+', label: 'University rankings' },
  { value: '100%', label: 'Free to use' },
];

export default function LandingPage() {
  const { user } = useAuth();
  const primaryHref = user ? (user.role === 'admin' ? '/admin' : '/app/dashboard') : '/signup';

  return (
    <div className="min-h-screen bg-bg">
      {/* Nav */}
      <header className="sticky top-0 z-30 border-b border-border/60 glass">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-brand-gradient text-white shadow-lg shadow-brand/30">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-lg font-bold text-fg">Campus Advisor</span>
          </div>
          <div className="flex items-center gap-2">
            <a href="#features" className="hidden px-3 text-sm font-medium text-muted hover:text-fg sm:block">Features</a>
            <a href="#how" className="hidden px-3 text-sm font-medium text-muted hover:text-fg sm:block">How it works</a>
            <LanguageSwitcher />
            <ThemeToggle />
            {user ? (
              <Link to={primaryHref}><Button size="sm">Go to app</Button></Link>
            ) : (
              <>
                <Link to="/login" className="hidden sm:block"><Button variant="ghost" size="sm">Sign in</Button></Link>
                <Link to="/signup"><Button size="sm">Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden bg-hero-mesh">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-16 pt-10 lg:grid-cols-2 lg:pb-20 lg:pt-14">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-soft px-3 py-1 text-xs font-semibold text-brand">
              <Sparkles className="h-3.5 w-3.5" /> AI powered, 100% free, student first
            </span>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-6xl">
              Your AI-Powered <span className="text-gradient">Campus Companion</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted">
              Study smarter. Build your career. Discover opportunities. Connect with your
              university community — all in one intelligent platform.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={primaryHref}>
                <Button size="lg" className="w-full shadow-lg shadow-brand/30 sm:w-auto">
                  Get Started Free <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">Explore Features</Button>
              </a>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted">
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> No credit card</span>
              <span className="inline-flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-accent" /> Works offline (mock AI)</span>
              <span className="inline-flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-accent" /> Private & secure</span>
            </div>
          </div>

          {/* Hero visual: floating preview cards */}
          <div className="relative hidden lg:block">
            <div className="relative mx-auto max-w-md">
              <div className="rounded-3xl border border-border bg-surface p-5 shadow-2xl glow-brand">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white"><Bot className="h-4 w-4" /></span>
                  <div>
                    <p className="text-sm font-semibold text-fg">AI Academic Advisor</p>
                    <p className="text-xs text-muted">Active now</p>
                  </div>
                </div>
                <div className="mt-3 space-y-2.5">
                  <div className="ml-auto max-w-[80%] rounded-2xl bg-brand px-3 py-2 text-xs text-brand-fg">
                    I have exams in 2 weeks and I'm weak in Data Structures.
                  </div>
                  <div className="max-w-[85%] rounded-2xl bg-surface-2 px-3 py-2 text-xs text-fg">
                    Here's a focused plan: prioritize DS (60% of time), use active recall, and attempt one past paper daily. Want a day-by-day schedule?
                  </div>
                </div>
              </div>
              <div className="animate-float absolute -right-6 -top-8 w-44 rounded-2xl border border-border bg-surface p-3 shadow-xl">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">AI Match</span>
                  <span className="text-lg font-bold text-accent">87%</span>
                </div>
                <p className="mt-1 text-xs font-medium text-fg">Frontend Intern, Remote</p>
              </div>
              <div className="animate-float absolute -bottom-6 -left-6 w-40 rounded-2xl border border-border bg-surface p-3 shadow-xl" style={{ animationDelay: '1.5s' }}>
                <span className="text-xs text-muted">CGPA</span>
                <p className="text-xl font-bold text-gradient">3.62</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats bar */}
        <div className="mx-auto max-w-6xl px-6 pb-12">
          <div className="grid grid-cols-2 gap-4 rounded-2xl border border-border bg-surface/70 p-6 backdrop-blur sm:grid-cols-4">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl font-extrabold text-gradient sm:text-3xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-brand">Everything in one place</span>
          <h2 className="mt-2 text-3xl font-extrabold text-fg sm:text-4xl">Built for your entire journey</h2>
          <p className="mt-3 text-muted">From your first semester to your first job — one intelligent platform.</p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="card-hover rounded-2xl border border-border bg-surface p-5 shadow-card">
              <span className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${f.color} text-white shadow-lg`}>
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-4 font-bold text-fg">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="relative overflow-hidden bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-sm font-semibold uppercase tracking-wider text-brand">Simple by design</span>
            <h2 className="mt-2 text-3xl font-extrabold text-fg sm:text-4xl">How it works</h2>
            <p className="mt-3 text-muted">From sign-up to success in five steps.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-5">
            {STEPS.map((s, i) => (
              <div key={s.title} className="relative rounded-2xl border border-border bg-bg p-5">
                <span className="absolute -top-3 left-5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-brand-gradient text-xs font-bold text-white shadow">
                  {i + 1}
                </span>
                <s.icon className="mt-2 h-6 w-6 text-brand" />
                <h3 className="mt-3 text-sm font-bold text-fg">{s.title}</h3>
                <p className="mt-1 text-xs text-muted">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial-style band */}
      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <div className="mb-4 flex justify-center gap-1 text-warning">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-5 w-5 fill-warning" />
          ))}
        </div>
        <p className="text-2xl font-medium leading-relaxed text-fg sm:text-3xl">
          &ldquo;Campus Advisor doesn&apos;t just store my information — it{' '}
          <span className="text-gradient">understands me</span> and helps me make better academic and
          career decisions.&rdquo;
        </p>
        <p className="mt-4 text-sm text-muted">— Every student who uses it</p>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-6 pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-brand-gradient p-10 text-center text-white shadow-2xl sm:p-16">
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
          <h2 className="relative text-3xl font-extrabold sm:text-4xl">Your university journey deserves an advisor.</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-white/90">
            Join Campus Advisor today and turn your goals into a clear, actionable plan.
          </p>
          <Link to={primaryHref} className="relative mt-8 inline-block">
            <Button size="lg" variant="secondary" className="shadow-xl">
              Get Started for free <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-sm text-muted">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-brand-gradient text-white"><GraduationCap className="h-4 w-4" /></span>
            <span className="font-bold text-fg">Campus Advisor</span>
          </div>
          <p>Your AI-Powered Campus Companion.</p>
          <p className="text-xs">Built free tier first. No credit card required. Made with Kiro.</p>
          {/* Discreet admin entry — low-visibility, for staff only */}
          <Link to="/admin/login" className="mt-2 text-[11px] text-muted/50 transition hover:text-brand">
            Admin
          </Link>
        </div>
      </footer>
    </div>
  );
}
