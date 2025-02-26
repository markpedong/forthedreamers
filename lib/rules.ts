import { z } from 'zod'

export const loginSchema = z
  .object({
    email: z.string().email('Please enter a valid email address').trim(),
    password: z
      .string()
      .min(1, "Password can't be empty")
      .min(5, 'Password must be at least 5 characters long')
      .regex(/[a-zA-Z]/, 'Password must contain at least one letter')
      .regex(/[0-9]/, 'Password must contain at least one number')
      .regex(/[^a-zA-Z0-9]/, 'Password must contain at least one special character')
      .trim(),
    confirmPassword: z.string().trim()
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  })
