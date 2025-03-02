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

export const uuidSchema = z.string().uuid()

export const infoSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(1, "First name can't be empty")
    .max(20, "First name can't be longer than 20 characters")
    .regex(/^[a-zA-Z]+$/, 'First name can only contain letters'),
  lastName: z
    .string()
    .trim()
    .min(1, "Last name can't be empty")
    .max(20, "Last name can't be longer than 20 characters")
    .regex(/^[a-zA-Z]+$/, 'Last name can only contain letters'),
  birthday: z
    .string()
    .trim()
    .min(1, "Birthday can't be empty")
    .max(20, "Birthday can't be longer than 20 characters")
    .regex(/^[a-zA-Z]+$/, 'Birthday can only contain letters')
})
