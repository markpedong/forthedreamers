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

  // Form schemas (for create/edit) - IDs are optional for new items
  const variantOptionFormSchema = z.object({
    id: z.string().optional(), // Optional for new options
    variantOptionName: createStringSchema("Option Name", 1, 100),
    price: z.number().min(0, { message: "Price must be at least 0" }),
    discountedPrice: z.number().nullable().optional(),
    stock: z.number().min(0, { message: "Stock must be at least 0" }),
    coupon: z.string().nullable().optional(),
  });

  const variantFormSchema = z.object({
    id: z.string().optional(), // Optional for new variants
    name: createStringSchema("Variant Name", 1, 100),
    isRequired: z.boolean().default(true),
    options: z.array(variantOptionFormSchema).default([]),
  });

  const specFormSchema = z.object({
    id: z.string().optional(), // Optional for new specs
    label: createStringSchema("Spec Label", 1, 100),
    value: createStringSchema("Spec Value", 1, 500),
  });

  const PRODUCT_STATUS_VALUES = ["ACTIVE", "INACTIVE", "DRAFT"] as const;

  // Product form schema (for both create and edit)
  const productFormSchema = z
    .object({
      id: z.string().optional(), // Optional for create mode
      name: createStringSchema("Product Name", 1, 200),
      slug: z.string().optional(), // Will be auto-generated from name if not provided
      brand: z.string().max(100).nullable().optional(),
      basePrice: z.number().min(0, { message: "Base price must be at least 0" }).optional().nullable(),
      description: z.string().max(5000).optional().nullable(),
      images: z.array(z.string()).default([]),
      tags: z.array(z.string()).default([]),
      stock: z.number().min(0, { message: "Stock must be at least 0" }).optional().nullable(),
      status: z.enum(PRODUCT_STATUS).default('DRAFT'),
      category: z.string().min(1, { message: "Category is required" }), // Category name
      categoryId: z.string().optional(), // Will be resolved from category name
      specs: z.array(specFormSchema).default([]),
      variants: z.array(variantFormSchema).default([]),
    })
    .refine(
      (data) => {
        // If variants exist, basePrice and stock are not required
        // If no variants, basePrice and stock are required
        if (data.variants && data.variants.length > 0) {
          return true; // Variants handle pricing/stock
        }
        return (
          data.basePrice !== null &&
          data.basePrice !== undefined &&
          data.stock !== null &&
          data.stock !== undefined
        );
      },
      {
        message: "Base price and stock are required when no variants are present",
        path: ["basePrice"],
      }
    );

  // Full product schema (for database/API response)
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

  const productSchema = z.object({
    id: z.string(),
    name: createStringSchema("Product Name"),
    slug: createStringSchema("Slug"),
    brand: createStringSchema("Brand").nullable().optional(),
    basePrice: z.number().min(0).optional().nullable(),
    description: z.string().optional().nullable(),
    images: z.array(z.string()).optional(),
    tags: z.array(z.string()).optional(),
    reviewCount: z.number().optional(),
    rating: z.number().optional(),
    sold: z.number().optional(),
    stock: z.number().min(0).optional().nullable(),
    categoryId: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    specs: z.array(specSchema).optional(),
    category: z.any(), // Category object
    variants: z.array(variantSchema).optional(),
    status: z.enum(PRODUCT_STATUS),
  });

  const extendedSchema = productFormSchema;


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
    productFormSchema,
    specSchema,
    specFormSchema,
    variantSchema,
    variantFormSchema,
    variantOptionSchema,
    variantOptionFormSchema,
    extendedSchema
  }
}

export default useFormSchema