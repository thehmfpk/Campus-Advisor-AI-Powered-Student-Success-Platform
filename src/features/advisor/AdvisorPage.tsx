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
import { Badge, Button, Card, CardBody } from '@/components/ui';
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
  const { messages, pending, send } = useAdvisor();
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

  return (
    <div>
      <PageHeader
        title="AI Advisor Hub"
        description="Four specialized agents. Pick one, or let Campus Advisor route your question automatically."
        action={
          <Badge tone="accent">
            <Sparkles className="h-3 w-3" /> Free-tier AI + Mock fallback
          </Badge>
        }
      />

      {/* Agent selector */}
      <div className="mb-4 flex flex-wrap gap-2">
        {AGENT_OPTIONS.map((o) => (
          <button
            key={o.key}
            onClick={() => setSelected(o.key)}
            className={cn(
              'inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition',
              selected === o.key
                ? 'border-brand bg-brand-soft text-brand'
                : 'border-border bg-surface text-muted hover:text-fg',
            )}
          >
            <o.icon className="h-4 w-4" /> {o.label}
          </button>
        ))}
      </div>

      <Card className="flex h-[60vh] flex-col">
        {/* Messages */}
        <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-soft text-brand">
                <Bot className="h-7 w-7" />
              </span>
              <h3 className="mt-3 text-base font-semibold text-fg">How can I help you today?</h3>
              <p className="mt-1 max-w-sm text-sm text-muted">
                Ask about studying, careers, coding, or your CV. Try one of these:
              </p>
              <div className="mt-4 grid max-w-lg gap-2 sm:grid-cols-2">
                {STARTERS.map((s) => (
                  <button
                    key={s}
                    onClick={() => submit(s)}
                    className="rounded-xl border border-border bg-surface-2 p-3 text-left text-xs text-fg transition hover:border-brand"
                  >
                    <Wand2 className="mb-1 h-3.5 w-3.5 text-brand" />
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <div
                key={i}
                className={cn('flex gap-3', m.role === 'user' ? 'flex-row-reverse' : 'flex-row')}
              >
                {m.role === 'user' ? (
                  <Avatar name={user?.fullName ?? 'You'} size={32} />
                ) : (
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand text-brand-fg">
                    <Bot className="h-4 w-4" />
                  </span>
                )}
                <div
                  className={cn(
                    'max-w-[80%] rounded-2xl px-4 py-3',
                    m.role === 'user'
                      ? 'bg-brand text-brand-fg'
                      : 'border border-border bg-surface-2 text-fg',
                  )}
                >
                  {m.role === 'assistant' && m.agent && (
                    <div className="mb-2 flex items-center gap-2">
                      <AgentBadge agent={m.agent} />
                    </div>
                  )}
                  {m.role === 'assistant' ? (
                    <ChatMarkdown text={m.content} />
                  ) : (
                    <p className="text-sm">{m.content}</p>
                  )}
                </div>
              </div>
            ))
          )}
          {pending && (
            <div className="flex items-center gap-2 text-sm text-muted">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand text-brand-fg">
                <Bot className="h-4 w-4" />
              </span>
              <span className="flex gap-1">
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.2s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand [animation-delay:-0.1s]" />
                <span className="h-2 w-2 animate-bounce rounded-full bg-brand" />
              </span>
            </div>
          )}
        </div>

        {/* Composer */}
        <CardBody className="border-t border-border">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit(input);
            }}
            className="flex items-end gap-2"
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
              placeholder="Ask your advisor…"
              className="min-h-11 flex-1 resize-none rounded-xl border border-border bg-surface px-3 py-2.5 text-sm text-fg placeholder:text-muted focus:border-brand"
            />
            <Button type="submit" loading={pending} disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <p className="mt-2 text-center text-xs text-muted">
            AI gives recommendations, not verified facts. Verify university-specific details.
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
