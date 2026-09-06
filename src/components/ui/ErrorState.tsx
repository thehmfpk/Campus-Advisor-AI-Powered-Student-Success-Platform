import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';

export function ErrorState({
  title = 'Something went wrong',
  description = 'We could not load this content. Please try again.',
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-danger/30 bg-danger/5 px-6 py-10 text-center">
      <span className="mb-3 inline-flex h-12 w-12 items-center justify-center rounded-full bg-danger/15 text-danger">
        <AlertTriangle className="h-6 w-6" aria-hidden />
      </span>
      <h3 className="text-sm font-semibold text-fg">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" className="mt-4" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}
