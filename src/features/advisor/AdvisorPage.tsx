import { useEffect, useRef, useState } from 'react';
import {
  Bot,
  Send,
  Sparkles,
  Wand2,
  BookOpen,
  Rocket,
  Code2,
  FileText,
  type LucideIcon,
} from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Button, Card } from '@/components/ui';
import { Avatar } from '@/components/ui';
import { cn } from '@/lib/cn';
import { AGENT_META, type ResolvableAgent } from '@/lib/intentRouter';
import type { AgentKey } from '@/types/db';
import { useAdvisor } from './useAdvisor';
import { ChatMarkdown } from './ChatMarkdown';
import { useAuth } from '@/features/auth/AuthContext';

const AGENT_ICON: Record<ResolvableAgent, LucideIcon> = {
  academic: BookOpen,
  career: Rocket,
  coding: Code2,
  cv: FileText,
};

const AGENT_OPTIONS: { key: AgentKey; label: string; icon: LucideIcon }[] = [
  { key: 'auto', label: 'Auto (smart routing)', icon: Sparkles },
  { key: 'academic', label: AGENT_META.academic.label, icon: BookOpen },
  { key: 'career', label: AGENT_META.career.label, icon: Rocket },
  { key: 'coding', label: AGENT_META.coding.label, icon: Code2 },
  { key: 'cv', label: AGENT_META.cv.label, icon: FileText },
];

const STARTERS = [
  'I have exams in two weeks and I am weak in Data Structures.',
  'I want to become a data scientist. What should I learn?',
  "I don't understand recursion.",
  'Improve my CV for a frontend developer job.',
];

function AgentBadge({ agent }: { agent: ResolvableAgent }) {
  const meta = AGENT_META[agent];
  const Icon = AGENT_ICON[agent];
  return (
    <Badge tone="brand">
      <Icon className="h-3 w-3" /> {meta.label}
    </Badge>
  );
}

export default function AdvisorPage() {
  const { user } = useAuth();
  const { messages, pending, send, reset } = useAdvisor();
  const [selected, setSelected] = useState<AgentKey>('auto');
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, pending]);

  const submit = (text: string) => {
    void send(text, selected);
    setInput('');
  };

  const activeAgent: ResolvableAgent = selected === 'auto' ? 'academic' : (selected as ResolvableAgent);
  const HeaderIcon = selected === 'auto' ? Sparkles : AGENT_ICON[activeAgent];
  const headerLabel = selected === 'auto' ? 'Smart routing' : AGENT_META[activeAgent].label;

  return (
    <div>
      <PageHeader
        title="AI Advisor Hub"
        description="Four specialized advisors. Pick one, or let Campus Advisor route your question automatically."
      />

      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        {/* Agent sidebar */}
        <aside className="space-y-2">
          {AGENT_OPTIONS.map((o) => {
            const active = selected === o.key;
            return (
              <button
                key={o.key}
                onClick={() => setSelected(o.key)}
                className={cn(
                  'flex w-full items-start gap-3 rounded-2xl border p-3 text-left transition',
                  active
                    ? 'border-brand bg-brand-soft'
                    : 'border-border bg-surface hover:border-brand/40 hover:bg-surface-2',
                )}
              >
                <span
                  className={cn(
                    'inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
                    active ? 'bg-brand-gradient text-white' : 'bg-surface-2 text-muted',
                  )}
                >
                  <o.icon className="h-4.5 w-4.5" />
                </span>
                <span>
                  <span className={cn('block text-sm font-semibold', active ? 'text-brand' : 'text-fg')}>
                    {o.label}
                  </span>
                  <span className="block text-xs text-muted">
                    {o.key === 'auto' ? 'Auto-detects the best advisor' : AGENT_META[o.key as ResolvableAgent].blurb}
                  </span>
                </span>
              </button>
            );
          })}
        </aside>

        {/* Chat panel */}
        <Card className="flex h-[68vh] flex-col overflow-hidden">
          {/* Gradient header */}
          <div className="flex items-center justify-between bg-brand-gradient px-5 py-3 text-white">
            <div className="flex items-center gap-2.5">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                <HeaderIcon className="h-4.5 w-4.5" />
              </span>
              <div>
                <p className="text-sm font-semibold leading-tight">{headerLabel}</p>
                <p className="text-xs text-white/80">Campus Advisor AI</p>
              </div>
            </div>
            {messages.length > 0 && (
              <button onClick={reset} className="rounded-lg bg-white/15 px-2.5 py-1 text-xs font-medium hover:bg-white/25">
                New chat
              </button>
            )}
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto bg-bg/40 p-4 sm:p-6">
            {messages.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center">
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-brand-gradient text-white shadow-lg glow-brand">
                  <Bot className="h-8 w-8" />
                </span>
                <h3 className="mt-4 text-lg font-bold text-fg">How can I help you today?</h3>
                <p className="mt-1 max-w-sm text-sm text-muted">
                  Ask about studying, careers, coding, or your CV. Try one of these:
                </p>
                <div className="mt-5 grid w-full max-w-lg gap-2 sm:grid-cols-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => submit(s)}
                      className="card-hover flex items-start gap-2 rounded-xl border border-border bg-surface p-3 text-left text-xs text-fg"
                    >
                      <Wand2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand" />
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m, i) => (
                <div key={i} className={cn('flex gap-3', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                  {m.role === 'user' ? (
                    <Avatar name={user?.fullName ?? 'You'} size={34} />
                  ) : (
                    <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gradient text-white shadow">
                      <Bot className="h-4.5 w-4.5" />
                    </span>
                  )}
                  <div
                    className={cn(
                      'max-w-[82%] rounded-2xl px-4 py-3 shadow-sm',
                      m.role === 'user'
                        ? 'rounded-tr-sm bg-brand-gradient text-white'
                        : 'rounded-tl-sm border border-border bg-surface text-fg',
                    )}
                  >
                    {m.role === 'assistant' && m.agent && (
                      <div className="mb-2">
                        <AgentBadge agent={m.agent} />
                      </div>
                    )}
                    {m.role === 'assistant' ? (
                      <ChatMarkdown text={m.content} />
                    ) : (
                      <p className="text-sm leading-relaxed">{m.content}</p>
                    )}
                  </div>
                </div>
              ))
            )}
            {pending && (
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gradient text-white">
                  <Bot className="h-4.5 w-4.5" />
                </span>
                <span className="flex gap-1 rounded-2xl border border-border bg-surface px-4 py-3">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.2s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.1s]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
                </span>
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="border-t border-border bg-surface p-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                submit(input);
              }}
              className="flex items-end gap-2 rounded-2xl border border-border bg-bg p-2 focus-within:border-brand"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    submit(input);
                  }
                }}
                rows={1}
                placeholder="Ask your advisor anything…"
                className="max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-fg placeholder:text-muted focus:outline-none"
              />
              <Button type="submit" loading={pending} disabled={!input.trim()} className="rounded-xl">
                <Send className="h-4 w-4" />
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted">
              AI gives recommendations, not verified facts. Verify university-specific details.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
