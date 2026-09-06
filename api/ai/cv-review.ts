import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { rateLimit } from '../_lib/rateLimit';
import { fail, ok, clientIp } from '../_lib/http';
import { complete, buildSystemPrompt } from '../_lib/ai';

/**
 * POST /api/ai/cv-review
 * Body: { cv: object, targetRole?: string }
 * Returns AI suggestions to improve the CV (R8). Auth required.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method_not_allowed', 'Use POST.');

  const user = await authenticate(req.headers.authorization);
  if (!user) return fail(res, 401, 'unauthorized', 'You must be signed in.');

  const limit = rateLimit(`cv:${user.id || clientIp(req.headers)}`, { capacity: 8 });
  if (!limit.allowed) return fail(res, 429, 'rate_limited', 'Too many requests. Slow down.');

  const body = (req.body ?? {}) as { cv?: unknown; targetRole?: string };
  if (!body.cv || typeof body.cv !== 'object') {
    return fail(res, 400, 'invalid_input', 'CV content is required.');
  }

  const system = buildSystemPrompt('cv', {});
  const targetRole = (body.targetRole ?? '').toString().slice(0, 120);
  const cvJson = JSON.stringify(body.cv).slice(0, 6000);

  const userMessage =
    `Review this CV (JSON) and give concrete improvements. ` +
    (targetRole ? `Target role: ${targetRole}. ` : '') +
    `Return: 1) top strengths, 2) top weaknesses, 3) 3-5 rewritten bullet suggestions, ` +
    `4) missing skills for the target role.\n\nCV:\n${cvJson}`;

  let result;
  try {
    result = await complete({
      system,
      messages: [{ role: 'user', content: userMessage }],
      maxTokens: 900,
    });
  } catch {
    return fail(res, 502, 'ai_failed', 'The AI is temporarily unavailable. Please try again.');
  }

  return ok(res, {
    text: result.text,
    provider: result.provider,
    usedFallback: result.usedFallback,
  });
}
