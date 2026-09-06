import { Fragment } from 'react';

/**
 * Tiny, dependency-free renderer for the subset of markdown the agents emit:
 * fenced code blocks, **bold**, and simple line breaks. Kept minimal on
 * purpose (free/OSS, no heavy markdown lib, safe — no raw HTML injection).
 */
export function ChatMarkdown({ text }: { text: string }) {
  const blocks = text.split(/```/);
  return (
    <div className="space-y-2 text-sm leading-relaxed">
      {blocks.map((block, i) => {
        const isCode = i % 2 === 1;
        if (isCode) {
          const body = block.replace(/^[a-z]*\n/i, '');
          return (
            <pre
              key={i}
              className="overflow-x-auto rounded-lg bg-black/80 p-3 text-xs text-green-200"
            >
              <code>{body.trimEnd()}</code>
            </pre>
          );
        }
        return (
          <Fragment key={i}>
            {block.split('\n').map((line, j) => (
              <p key={j} className={line.trim() === '' ? 'h-1' : ''}>
                {renderInline(line)}
              </p>
            ))}
          </Fragment>
        );
      })}
    </div>
  );
}

function renderInline(line: string) {
  const parts = line.split(/(\*\*[^*]+\*\*|_[^_]+_)/g);
  return parts.map((p, i) => {
    if (/^\*\*[^*]+\*\*$/.test(p)) return <strong key={i}>{p.slice(2, -2)}</strong>;
    if (/^_[^_]+_$/.test(p)) return <em key={i}>{p.slice(1, -1)}</em>;
    return <Fragment key={i}>{p}</Fragment>;
  });
}
