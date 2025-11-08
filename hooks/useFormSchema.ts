import { PRODUCT_STATUS } from "@/generated/prisma";
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

  const variantOptionSchema = z.object({
    id: z.string(),
    variantOptionName: createStringSchema("Option Name"),
    price: z.number().min(0),
    discountedPrice: z.number().nullable().optional(),
    stock: z.number().min(0),
    coupon: z.string().nullable().optional(),
  });

  const variantSchema = z.object({
    id: z.string(),
    name: createStringSchema("Variant Name"),
    isRequired: z.boolean(),
    options: z.array(variantOptionSchema),
  });

  const specSchema = z.object({
    id: z.string(),
    label: createStringSchema("Spec Label"),
    value: createStringSchema("Spec Value"),
  });

  const PRODUCT_STATUS_VALUES = ["ACTIVE", "INACTIVE", "DRAFT"] as const;

  const productSchema = z.object({
    id: z.string(),
    name: createStringSchema("Product Name"),
    slug: createStringSchema("Slug"),
    brand: createStringSchema("Brand").nullable().optional(),
    basePrice: z.number().min(0),
    description: createStringSchema("Description").optional(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    reviewCount: z.number().optional(),
    rating: z.number().optional(),
    sold: z.number().optional(),
    stock: z.number().min(0),
    // status: z.enum(['ACTIVE','INACTIVE','DRAFT']).default('INACTIVE'),
    sellerId: z.string(),
    categoryId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    specs: z.array(specSchema).optional(),
    category: createStringSchema("Category Name"),
    variants: z.array(variantSchema).optional(),
  });

  const extendedSchema = productSchema.extend({
    status: z.enum(PRODUCT_STATUS).default('INACTIVE'),
  });


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
    specSchema,
    extendedSchema
  }
}

export default useFormSchema