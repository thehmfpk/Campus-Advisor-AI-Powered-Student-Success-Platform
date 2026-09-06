import { z } from 'zod';

/**
 * Shared validation schemas used by both the client (React Hook Form) and the
 * serverless API (re-validation). Keeping them in one place guarantees the
 * frontend and backend agree (R18). Feature-specific schemas are added in the
 * phases that introduce those features.
 */

export const emailSchema = z.string().trim().toLowerCase().email('Enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters');

export const MAX_SUBJECTS = 7;
