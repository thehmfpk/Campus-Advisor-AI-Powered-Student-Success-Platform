/**
 * Minimal className combiner (no extra dependency — free/OSS, keeps bundle small).
 * Filters falsy values and joins with a space.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
