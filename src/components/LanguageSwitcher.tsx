import { useEffect, useRef, useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { useI18n } from '@/i18n/LanguageProvider';
import { LANGUAGES } from '@/i18n/translations';
import { cn } from '@/lib/cn';

export function LanguageSwitcher() {
  const { lang, setLang, rtl } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const current = LANGUAGES.find((l) => l.code === lang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Change language"
        className="inline-flex h-9 items-center gap-1.5 rounded-xl border border-border bg-surface px-2.5 text-sm text-fg transition hover:bg-surface-2"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{current?.native}</span>
      </button>
      {open && (
        <div
          className={cn(
            'absolute z-40 mt-1 w-40 rounded-xl border border-border bg-surface p-1 shadow-card',
            rtl ? 'left-0' : 'right-0',
          )}
        >
          {LANGUAGES.map((l) => (
            <button
              key={l.code}
              onClick={() => {
                setLang(l.code);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between rounded-lg px-2.5 py-2 text-sm text-fg transition hover:bg-surface-2"
            >
              <span>
                {l.native} <span className="text-xs text-muted">({l.label})</span>
              </span>
              {l.code === lang && <Check className="h-4 w-4 text-brand" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
