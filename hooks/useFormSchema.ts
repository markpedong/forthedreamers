import { z } from "zod";

const useFormSchema = () => {
  const emailSchema = z
    .string()
    .email("Invalid email address")
    .min(2, { message: 'Email must be at least 2 characters' })
    .max(50, { message: 'Email must be less than 50 characters' })

  const nameEmailSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
  }).extend({
    email: emailSchema
  });

  const passwordSchema = z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")


  const resetPasswordSchema = z
    .object({
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })

  const forgotPasswordSchema = z
    .object({
      email: emailSchema,
    })

  const registrationSchema = nameEmailSchema
    .extend({
      email: emailSchema,
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const loginSchema = z
    .object({
      email: emailSchema,
      password: passwordSchema,
    })

  return {
    nameEmailSchema,
    passwordSchema,
    resetPasswordSchema,
    emailSchema,
    registrationSchema,
    forgotPasswordSchema,
    loginSchema
  }
}

export default useFormSchema