import type { VercelResponse } from '@vercel/node';

/** Consistent success/error envelopes (design §7). Never leak internals. */
export function ok(res: VercelResponse, data: unknown, status = 200): void {
  res.status(status).json(data);
}

export function fail(
  res: VercelResponse,
  status: number,
  code: string,
  message: string,
): void {
  res.status(status).json({ error: { code, message } });
}

export function clientIp(headers: Record<string, string | string[] | undefined>): string {
  const fwd = headers['x-forwarded-for'];
  if (typeof fwd === 'string') return fwd.split(',')[0]!.trim();
  if (Array.isArray(fwd)) return fwd[0]!;
  return 'unknown';
}
