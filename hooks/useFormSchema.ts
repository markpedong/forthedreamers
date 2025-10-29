import { z } from "zod";

const useFormSchema = () => {
  const profileSchema = z.object({
    name: z
      .string()
      .min(2, { message: 'Name must be at least 2 characters' })
      .max(50, { message: 'Name must be less than 50 characters' }),
    // email: z.string().email({ message: 'Please enter a valid email address' }),
  });

  return {
    profileSchema,
  }
}

export default useFormSchema