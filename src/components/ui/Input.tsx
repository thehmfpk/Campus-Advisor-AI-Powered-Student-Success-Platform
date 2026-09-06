import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

const base =
  'w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted transition focus:border-brand disabled:opacity-60';

export interface FieldProps {
  label?: string;
  error?: string;
  hint?: string;
}

function FieldWrapper({
  label,
  error,
  hint,
  children,
  id,
}: FieldProps & { children: React.ReactNode; id?: string }) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-fg">
          {label}
        </label>
      )}
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & FieldProps>(
  function Input({ label, error, hint, className, id, ...props }, ref) {
    return (
      <FieldWrapper label={label} error={error} hint={hint} id={id}>
        <input ref={ref} id={id} className={cn(base, error && 'border-danger', className)} {...props} />
      </FieldWrapper>
    );
  },
);

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement> & FieldProps
>(function Textarea({ label, error, hint, className, id, ...props }, ref) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} id={id}>
      <textarea ref={ref} id={id} className={cn(base, 'min-h-24', error && 'border-danger', className)} {...props} />
    </FieldWrapper>
  );
});

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement> & FieldProps
>(function Select({ label, error, hint, className, id, children, ...props }, ref) {
  return (
    <FieldWrapper label={label} error={error} hint={hint} id={id}>
      <select ref={ref} id={id} className={cn(base, error && 'border-danger', className)} {...props}>
        {children}
      </select>
    </FieldWrapper>
  );
});
