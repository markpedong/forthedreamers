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

  const nameSchema = createStringSchema("Name");
  const storeNameSchema = createStringSchema("Store name");

  const searchSchema = z.object({ search: createStringSchema("Search") });

  const nameEmailSchema = z.object({ name: nameSchema }).extend({ email: emailSchema });

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

  const variantOptionFormSchema = z.object({
    variantOptionName: createStringSchema("Option Name", 1, 100),
    price: z.number().min(1, { message: "Price must be at least 1" }),
    stock: z.number().min(1, { message: "Stock must be at least 1" }),
    discountedPrice: z.number().nullable().optional(),
    coupon: z.string().nullable().optional(),
  });

  const variantFormSchema = z.object({
    id: z.string().optional(),
    name: createStringSchema("Variant Name", 1, 100),
    price: z.number().min(1, { message: "Price must be at least 1" }),
    stock: z.number().min(1, { message: "Stock must be at least 1" }),
    image: z.string().nullable().optional(),
    attributes: z.record(z.string(), z.string()).default({}),
  });

  const specFormSchema = z.object({
    id: z.string().optional(),
    label: createStringSchema("Spec Label", 1, 100),
    value: createStringSchema("Spec Value", 1, 500),
  });

  const attributeSchema = z.object({
    label: createStringSchema("Attribute label", 1, 100),
    value: createStringSchema("Attribute Value", 1, 100)
  });

  const variantSchema = z.object({
    id: z.string(),
    name: z.string().min(1, 'Variant name is required'),
    image: z.string().url('Invalid URL').optional(),
    price: z.number().min(0),
    discountedPrice: z.number().optional(),
    stock: z.number().min(0),
    coupon: z.string().optional(),
    attributes: z.array(attributeSchema)
  })

  const productFormSchema = z
    .object({
      id: z.string().optional(),
      name: createStringSchema("Product Name", 1, 200),
      brand: createStringSchema("Brand", 1, 100),
      basePrice: z.number().nullable().optional(),
      description: createStringSchema("Description", 1, 1000),
      images: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      stock: z.number().nullable().optional(),
      status: z.enum(PRODUCT_STATUS).default('INACTIVE'),
      category: createStringSchema("Category", 1, 100),
      specs: z.array(specFormSchema).default([]),
      variants: z.array(variantFormSchema).default([]),
    })
    .superRefine((data, ctx) => {
      if ((!data.variants || data.variants.length === 0)) {
        if (data.basePrice === null || data.basePrice === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Base price is required when no variants are present",
            path: ["basePrice"],
          });
        }
        if (data.stock === null || data.stock === undefined) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Stock is required when no variants are present",
            path: ["stock"],
          });
        }
      }
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
    productFormSchema,
    specFormSchema,
    variantFormSchema,
    variantOptionFormSchema,
    variantSchema,
    attributeSchema
  }
}

export default useFormSchema