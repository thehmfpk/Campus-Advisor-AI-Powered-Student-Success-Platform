/**
 * Minimal in-memory token-bucket rate limiter (R18). Free — no external
 * service. Note: serverless instances are ephemeral, so this limits per warm
 * instance; it is a basic abuse guard, not a global quota. Sufficient for the
 * MVP and it costs nothing.
 */
interface Bucket {
  tokens: number;
  updated: number;
}

const buckets = new Map<string, Bucket>();

export function rateLimit(
  key: string,
  { capacity = 20, refillPerSec = 0.5 }: { capacity?: number; refillPerSec?: number } = {},
): { allowed: boolean; retryAfter: number } {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: capacity, updated: now };
  const elapsed = (now - b.updated) / 1000;
  b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSec);
  b.updated = now;
  if (b.tokens >= 1) {
    b.tokens -= 1;
    buckets.set(key, b);
    return { allowed: true, retryAfter: 0 };
  }
  buckets.set(key, b);
  return { allowed: false, retryAfter: Math.ceil((1 - b.tokens) / refillPerSec) };
}
