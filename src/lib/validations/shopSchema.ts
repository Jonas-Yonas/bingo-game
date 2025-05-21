import { z } from "zod";

export const ShopFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  location: z.string().min(3, "Location is required"),
  shopCommission: z.coerce
    .number()
    .min(0, "Commission cannot be negative")
    .max(100, "Commission cannot exceed 100%"),
  systemCommission: z.coerce
    .number()
    .min(0, "Commission cannot be negative")
    .max(100, "Commission cannot exceed 100%"),
  walletBalance: z.coerce.number().min(0, "Balance cannot be negative"),
  managerId: z.string().min(1, "Manager is required"),
});

export type ShopFormValues = z.infer<typeof ShopFormSchema>;

// export const ShopFormSchema = z.object({
//   name: z.string().min(1, "Shop name is required"),
//   location: z.string().min(1, "Location is required"),
//   shopCommission: z.number().min(0).max(100),
//   systemCommission: z.number().min(0).max(100),
//   walletBalance: z.number().min(0),
//   managerId: z.string().min(1, "Manager is required"),
// });

// export type ShopFormValues = z.infer<typeof ShopFormSchema>;
