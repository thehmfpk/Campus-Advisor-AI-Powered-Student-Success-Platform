/**
 * Basic, free content moderation (R11). Keyword/heuristic checks run before a
 * post is published; anything flagged is blocked client-side and can also be
 * reviewed by admins. This is a lightweight guard, not a replacement for human
 * moderation. No paid API — pure and free.
 */

// Obvious slurs/abuse are intentionally not enumerated here; we detect broad
// categories and rely on the report queue for nuance.
const BLOCKLIST = [/\bkill yourself\b/i, /\bidiot\b/i, /\bstupid\b/i, /\bhate you\b/i];

// Guard against publishing private/sensitive personal info about staff (R11/R13).
const PII_PATTERNS = [
  /\b\d{5}-\d{7}-\d\b/, // Pakistani CNIC format
  /\b\d{11}\b/, // long phone/ID numbers
  /home address|house #|personal (phone|number|address)/i,
];

export interface ModerationResult {
  ok: boolean;
  reason?: string;
}

export function moderatePost(content: string): ModerationResult {
  const text = content.trim();
  if (text.length < 3) return { ok: false, reason: 'Post is too short.' };
  if (text.length > 2000) return { ok: false, reason: 'Post is too long (max 2000 characters).' };

  if (BLOCKLIST.some((re) => re.test(text))) {
    return { ok: false, reason: 'Your post appears to contain abusive language. Please revise it.' };
  }
  if (PII_PATTERNS.some((re) => re.test(text))) {
    return {
      ok: false,
      reason:
        'Please do not share private personal information (ID numbers, phone numbers, or home addresses), especially about staff.',
    };
  }
  return { ok: true };
}
