import { cn } from '@/lib/cn';

function initials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('');
}

export function Avatar({
  name,
  src,
  size = 40,
  className,
}: {
  name: string;
  src?: string | null;
  size?: number;
  className?: string;
}) {
  const dimension = { width: size, height: size };
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        loading="lazy"
        style={dimension}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }
  return (
    <span
      style={dimension}
      aria-label={name}
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-brand-soft text-sm font-semibold text-brand',
        className,
      )}
    >
      {initials(name) || '?'}
    </span>
  );
}
