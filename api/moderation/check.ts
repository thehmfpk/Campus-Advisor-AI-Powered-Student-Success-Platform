import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { fail, ok } from '../_lib/http';

/**
 * POST /api/moderation/check  Body: { content }
 * Server-side content check mirroring the client-side guard (R11). Free —
 * keyword/heuristic based, no paid API. The client already checks before
 * publishing; this endpoint lets other flows validate server-side too.
 */
const BLOCKLIST = [/\bkill yourself\b/i, /\bidiot\b/i, /\bstupid\b/i, /\bhate you\b/i];
const PII = [/\b\d{5}-\d{7}-\d\b/, /\b\d{11}\b/, /home address|personal (phone|address)/i];

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method_not_allowed', 'Use POST.');
  const user = await authenticate(req.headers.authorization);
  if (!user) return fail(res, 401, 'unauthorized', 'You must be signed in.');

  const content = ((req.body ?? {}) as { content?: string }).content ?? '';
  if (BLOCKLIST.some((re) => re.test(content))) {
    return ok(res, { ok: false, reason: 'abusive_language' });
  }
  if (PII.some((re) => re.test(content))) {
    return ok(res, { ok: false, reason: 'private_information' });
  }
  return ok(res, { ok: true });
}
