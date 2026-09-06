import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { getAdminClient } from '../_lib/supabaseAdmin';
import { rateLimit } from '../_lib/rateLimit';
import { fail, ok, clientIp } from '../_lib/http';
import { complete } from '../_lib/ai';

/**
 * POST /api/jobs/match  Body: { jobId, score, matchedSkills, missingSkills, jobTitle }
 * Returns an AI-phrased explanation of a match. The SCORE is always computed
 * deterministically on the client (lib/matching.ts) and passed in — the AI only
 * turns the breakdown into a sentence (R6). Cached into job_matches.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method_not_allowed', 'Use POST.');
  const user = await authenticate(req.headers.authorization);
  if (!user) return fail(res, 401, 'unauthorized', 'You must be signed in.');

  const limit = rateLimit(`match:${user.id || clientIp(req.headers)}`, { capacity: 15 });
  if (!limit.allowed) return fail(res, 429, 'rate_limited', 'Too many requests.');

  const body = (req.body ?? {}) as {
    jobId?: string;
    score?: number;
    matchedSkills?: string[];
    missingSkills?: string[];
    jobTitle?: string;
  };
  if (typeof body.score !== 'number') return fail(res, 400, 'invalid_input', 'score is required.');

  const system =
    'You explain job-match results to a student in one or two encouraging sentences. ' +
    'Do not invent facts about the company or job. Keep it concrete and actionable.';
  const userMessage =
    `Job: ${body.jobTitle ?? 'role'}. Match score: ${body.score}%. ` +
    `Matched skills: ${(body.matchedSkills ?? []).join(', ') || 'none'}. ` +
    `Missing skills: ${(body.missingSkills ?? []).join(', ') || 'none'}. ` +
    `Explain why this is a ${body.score}% match and what to improve.`;

  let text = '';
  try {
    const r = await complete({ system, messages: [{ role: 'user', content: userMessage }], maxTokens: 160 });
    text = r.text;
  } catch {
    text = `You match ${body.score}% based on your skills and interests.`;
  }

  // Best-effort cache.
  try {
    if (user.profileId && body.jobId && !body.jobId.startsWith('seed-')) {
      const admin = getAdminClient();
      await admin
        .from('job_matches')
        .upsert(
          { profile_id: user.profileId, job_id: body.jobId, score: body.score, explanation: text },
          { onConflict: 'profile_id,job_id' },
        );
    }
  } catch {
    /* non-fatal */
  }

  return ok(res, { explanation: text });
}
