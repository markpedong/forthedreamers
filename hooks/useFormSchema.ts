import { z } from "zod";

const useFormSchema = () => {
  const emailSchema = z.object({
    email: z
      .string()
      .email("Invalid email address")
      .min(2, { message: 'Email must be at least 2 characters' })
      .max(50, { message: 'Email must be less than 50 characters' }),
  })

  const nameEmailSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    email: emailSchema
  });

  const passwordSchema = {
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number")
  }


  const resetPasswordSchema = z
    .object({
      ...passwordSchema,
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    })

  return {
    nameEmailSchema,
    passwordSchema,
    resetPasswordSchema,
    emailSchema
  }
}

export default useFormSchema