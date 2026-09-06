import type { VercelRequest, VercelResponse } from '@vercel/node';
import { authenticate } from '../_lib/auth';
import { getAdminClient } from '../_lib/supabaseAdmin';
import { rateLimit } from '../_lib/rateLimit';
import { fail, ok, clientIp } from '../_lib/http';
import { complete, buildSystemPrompt, type Agent } from '../_lib/ai';

const AGENTS: Agent[] = ['academic', 'career', 'coding', 'cv'];

/**
 * POST /api/ai/advise
 * Body: { agent: Agent, message: string, history?: {role,content}[], conversationId?: string }
 * Auth required. Persists the exchange to ai_conversations/ai_messages.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method_not_allowed', 'Use POST.');

  const user = await authenticate(req.headers.authorization);
  if (!user) return fail(res, 401, 'unauthorized', 'You must be signed in.');

  const limit = rateLimit(`advise:${user.id || clientIp(req.headers)}`);
  if (!limit.allowed) return fail(res, 429, 'rate_limited', 'Too many requests. Slow down.');

  const body = (req.body ?? {}) as {
    agent?: string;
    message?: string;
    history?: { role: 'user' | 'assistant'; content: string }[];
    conversationId?: string;
  };

  const message = (body.message ?? '').trim();
  if (!message) return fail(res, 400, 'invalid_input', 'Message is required.');
  if (message.length > 4000) return fail(res, 400, 'invalid_input', 'Message is too long.');

  const agent: Agent = AGENTS.includes(body.agent as Agent) ? (body.agent as Agent) : 'academic';

  const admin = getAdminClient();

  // Build minimized context from the student's profile + subjects.
  let context = {};
  if (user.profileId) {
    const { data: profile } = await admin
      .from('student_profiles')
      .select('university_name, department_name, semester, skills, career_interests')
      .eq('id', user.profileId)
      .maybeSingle();
    const { data: subjects } = await admin
      .from('student_subjects')
      .select('subject_name, credit_hours, grade')
      .eq('profile_id', user.profileId);
    context = {
      university: profile?.university_name,
      department: profile?.department_name,
      semester: profile?.semester,
      skills: profile?.skills ?? [],
      interests: profile?.career_interests ?? [],
      subjects: (subjects ?? []).map((s) => ({
        name: s.subject_name,
        credits: s.credit_hours,
        grade: s.grade,
      })),
    };
  }

  const system = buildSystemPrompt(agent, context);
  const history = (body.history ?? []).slice(-8).map((m) => ({ role: m.role, content: m.content }));

  let result;
  try {
    result = await complete({ system, messages: [...history, { role: 'user', content: message }] });
  } catch {
    return fail(res, 502, 'ai_failed', 'The AI is temporarily unavailable. Please try again.');
  }

  // Persist conversation + messages (best-effort; failures don't block the reply).
  let conversationId = body.conversationId;
  try {
    if (user.profileId) {
      if (!conversationId) {
        const { data: conv } = await admin
          .from('ai_conversations')
          .insert({ profile_id: user.profileId, agent, title: message.slice(0, 60) })
          .select('id')
          .single();
        conversationId = conv?.id;
      }
      if (conversationId) {
        await admin.from('ai_messages').insert([
          { conversation_id: conversationId, role: 'user', agent, content: message },
          { conversation_id: conversationId, role: 'assistant', agent, content: result.text },
        ]);
      }
    }
  } catch {
    /* persistence is best-effort */
  }

  return ok(res, {
    text: result.text,
    agent,
    provider: result.provider,
    usedFallback: result.usedFallback,
    conversationId: conversationId ?? null,
  });
}
