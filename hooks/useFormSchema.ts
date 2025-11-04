import { z } from "zod";

const useFormSchema = () => {
  const emailSchema = z
    .string()
    .email("Invalid email address")
    .min(2, { message: 'Email must be at least 2 characters' })
    .max(50, { message: 'Email must be less than 50 characters' })
    .transform((password) => password.trim());

  const nameSchema = z
    .string()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(50, { message: 'Name must be less than 50 characters' })

  const storeName = z
    .string()
    .min(2, { message: 'Store name must be at least 2 characters' })
    .max(50, { message: 'Store name must be less than 50 characters' })

  const search = z
    .string()
    .min(2, { message: 'Search must be at least 2 characters' })
    .max(50, { message: 'Search must be less than 50 characters' })

  const nameEmailSchema = z.object({ name: nameSchema, }).extend({ email: emailSchema });

  const password = z
    .string()
    .min(8, "Must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain at least one uppercase letter")
    .regex(/[a-z]/, "Must contain at least one lowercase letter")
    .regex(/[0-9]/, "Must contain at least one number")
    .transform((password) => password.trim());


  const resetPasswordSchema = z
    .object({ password, confirmPassword: z.string() })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })

  const forgotPasswordSchema = z
    .object({
      email: emailSchema,
    })

  const registrationSchema = nameEmailSchema
    .extend({ email: emailSchema, password, confirmPassword: z.string() })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const loginSchema = z.object({ email: emailSchema, password })

  const changePasswordSchema = z
    .object({ currentPassword: password, newPassword: password, confirmPassword: password })
    .superRefine((data, ctx) => {
      if (data.newPassword !== data.confirmPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Passwords do not match',
          path: ['confirmPassword'],
        });
      }

      if (data.currentPassword === data.newPassword) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'New password must be different from the current password',
          path: ['newPassword'],
        });
      }
    });

  const twoFactorSchema = z.object({
    password: password.optional(),
    otp: z.string().optional()
  })

  const passkeySchema = z.object({
    name: nameSchema.optional(),
  });

  const searchSchema = z.object({ search })

  const createSellerSchema = z.object({ name: nameSchema, storeName: storeName, email: emailSchema, password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

  return {
    nameEmailSchema,
    password,
    resetPasswordSchema,
    emailSchema,
    registrationSchema,
    forgotPasswordSchema,
    loginSchema,
    changePasswordSchema,
    twoFactorSchema,
    passkeySchema,
    searchSchema,
    createSellerSchema
  }
}

export default useFormSchema