import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAdmin } from '../_lib/auth';
import { getAdminClient } from '../_lib/supabaseAdmin';
import { fail, ok } from '../_lib/http';

/**
 * POST /api/admin/student-status  Body: { userId, disabled }
 * Admin-only. Enables/disables a student account and records an audit action.
 * Uses the service role (server-only) — never exposed to the browser (R18).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return fail(res, 405, 'method_not_allowed', 'Use POST.');

  const admin = await requireAdmin(req.headers.authorization);
  if (!admin) return fail(res, 403, 'forbidden', 'Admin access required.');

  const { userId, disabled } = (req.body ?? {}) as { userId?: string; disabled?: boolean };
  if (!userId || typeof disabled !== 'boolean') {
    return fail(res, 400, 'invalid_input', 'userId and disabled are required.');
  }

  const db = getAdminClient();
  const { error } = await db.from('users').update({ is_disabled: disabled }).eq('id', userId);
  if (error) return fail(res, 500, 'update_failed', 'Could not update the account.');

  // Best-effort ban at the auth layer too.
  try {
    await db.auth.admin.updateUserById(userId, { ban_duration: disabled ? '87600h' : 'none' });
  } catch {
    /* non-fatal */
  }

  await db.from('admin_actions').insert({
    admin_id: admin.id,
    action: disabled ? 'disable_student' : 'enable_student',
    entity: 'users',
    entity_id: userId,
  });

  return ok(res, { userId, disabled });
}
