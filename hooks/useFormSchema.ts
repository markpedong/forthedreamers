import { z } from "zod";

const useFormSchema = () => {
  const emailSchema = z
    .string()
    .email("Invalid email address")
    .min(2, { message: 'Email must be at least 2 characters' })
    .max(50, { message: 'Email must be less than 50 characters' })
    .transform((password) => password.trim());

  const createStringSchema = (fieldName: string, min = 2, max = 50) =>
    z.string()
      .min(min, { message: `${fieldName} must be at least ${min} characters` })
      .max(max, { message: `${fieldName} must be less than ${max} characters` });

  // Now you can reuse it
  const nameSchema = createStringSchema("Name");
  const storeNameSchema = createStringSchema("Store name");
  const searchSchema = z.object({ search: createStringSchema("Search") });


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

  const createSellerSchema = z.object({ name: nameSchema, storeName: storeNameSchema, email: emailSchema, password, confirmPassword: z.string() }).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

  // name: '',
  //   brand: '',
  //     basePrice: '',
  //       description: '',
  //         category: '',
  //           status: 'ACTIVE',
  //             stock: '',
  //               images: [] as string[],
  //                 tags: [] as string[],
  //                   specs: [] as any[],
  //                     variants: [] as any[],

  const productSchema = z.object({
    name: nameSchema,
    brand: createStringSchema("Brand"),
    description: createStringSchema("Description"),
    category: createStringSchema("Category"),
    basePrice: z.number(),
    stock: z.number(),
  })

  const specsEditorSchema = z.object({
    label: createStringSchema("Label"),
    value: createStringSchema("Value"),
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
    createSellerSchema,
    productSchema,
    specsEditorSchema
  }
}

export default useFormSchema