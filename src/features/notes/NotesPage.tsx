import { useEffect, useState } from 'react';
import { BookOpen, Code2 } from 'lucide-react';
import { PageHeader } from '@/components/PageHeader';
import { Badge, Card, CardBody, EmptyState, ErrorState, Skeleton } from '@/components/ui';
import { cn } from '@/lib/cn';
import { useNotes } from './useNotes';
import type { CodingNote, CodingNoteSection } from '@/types/db';

const SECTION_ORDER: { key: keyof CodingNoteSection; label: string }[] = [
  { key: 'introduction', label: 'Introduction' },
  { key: 'fundamentals', label: 'Fundamentals' },
  { key: 'syntax', label: 'Syntax' },
  { key: 'concepts', label: 'Key concepts' },
  { key: 'deep_dive', label: 'Deep dive' },
  { key: 'examples', label: 'Examples' },
  { key: 'practice', label: 'Practice & exercises' },
  { key: 'common_mistakes', label: 'Common mistakes' },
  { key: 'best_practices', label: 'Best practices' },
  { key: 'interview_tips', label: 'Interview tips' },
];

const CODE_SECTIONS = new Set<keyof CodingNoteSection>(['syntax', 'examples', 'practice']);

function NoteReader({ note }: { note: CodingNote }) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-fg">{note.title}</h2>
        <Badge tone="brand" className="mt-1">
          <Code2 className="h-3 w-3" /> {note.technology}
        </Badge>
      </div>
      {SECTION_ORDER.map(({ key, label }) => {
        const content = note.sections[key];
        if (!content) return null;
        return (
          <section key={key}>
            <h3 className="mb-1.5 text-sm font-semibold uppercase tracking-wide text-muted">
              {label}
            </h3>
            {CODE_SECTIONS.has(key) ? (
              <pre className="overflow-x-auto rounded-xl bg-black/85 p-4 text-xs leading-relaxed text-green-200">
                <code>{content}</code>
              </pre>
            ) : (
              <p className="whitespace-pre-line text-sm leading-relaxed text-fg">{content}</p>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function NotesPage() {
  const { data: notes, isLoading, isError, refetch } = useNotes();
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  useEffect(() => {
    if (notes && notes.length && !activeSlug) setActiveSlug(notes[0].slug);
  }, [notes, activeSlug]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }
  if (isError) return <ErrorState onRetry={() => refetch()} />;
  if (!notes || notes.length === 0) {
    return <EmptyState icon={BookOpen} title="No notes yet" description="Coding notes will appear here." />;
  }

  const active = notes.find((n) => n.slug === activeSlug) ?? notes[0];

  return (
    <div>
      <PageHeader
        title="Coding Notes"
        description="Concise, read-only study notes by technology — fundamentals, syntax, examples, and interview tips."
        action={<Badge tone="accent"><BookOpen className="h-3 w-3" /> {notes.length} topics</Badge>}
      />

      <div className="grid gap-6 lg:grid-cols-[220px_1fr]">
        {/* Category list */}
        <nav className="flex gap-2 overflow-x-auto lg:flex-col lg:overflow-visible">
          {notes.map((n) => (
            <button
              key={n.slug}
              onClick={() => setActiveSlug(n.slug)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm font-medium transition lg:shrink',
                active.slug === n.slug
                  ? 'border-brand bg-brand-soft text-brand'
                  : 'border-border bg-surface text-muted hover:text-fg',
              )}
            >
              <Code2 className="h-4 w-4" />
              {n.technology}
            </button>
          ))}
        </nav>

        {/* Reader */}
        <Card>
          <CardBody>
            <NoteReader note={active} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
