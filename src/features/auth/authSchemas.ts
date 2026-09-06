import { z } from 'zod';
import { emailSchema, passwordSchema } from '@/lib/zodSchemas';

export const signUpSchema = z.object({
  fullName: z.string().trim().min(2, 'Enter your full name'),
  email: emailSchema,
  password: passwordSchema,
  rollNumber: z.string().trim().min(1, 'Roll number is required'),
  university: z.string().trim().min(2, 'University is required'),
  department: z.string().trim().min(2, 'Department is required'),
  semester: z.coerce.number().int().min(1, 'Min 1').max(12, 'Max 12'),
});

export type SignUpValues = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

export type SignInValues = z.infer<typeof signInSchema>;
