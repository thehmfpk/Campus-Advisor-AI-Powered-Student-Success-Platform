import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface TabItem {
  key: string;
  label: string;
  icon?: ReactNode;
}

export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: TabItem[];
  active: string;
  onChange: (key: string) => void;
}) {
  return (
    <div className="mb-6 flex flex-wrap gap-1 rounded-xl border border-border bg-surface p-1">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition',
            active === t.key ? 'bg-brand text-brand-fg' : 'text-muted hover:bg-surface-2 hover:text-fg',
          )}
        >
          {t.icon}
          {t.label}
        </button>
      ))}
    </div>
  );
}
