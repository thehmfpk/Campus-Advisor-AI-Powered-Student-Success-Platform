/**
 * Emails treated as platform admins. The account still signs in normally; when
 * its email is in this list, the app grants the admin role and (best-effort)
 * upserts users.role='admin' so Supabase RLS admin policies also apply.
 *
 * To add more admins later, extend this list (and re-deploy).
 */
export const ADMIN_EMAILS = ['thehmfpk@gmail.com'];

export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}
