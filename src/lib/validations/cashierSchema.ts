// lib/validations/cashierSchema.ts
import { z } from "zod";

export const CashierSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  shopId: z.string().min(1, "Shop is required"),
});

export type CashierFormValues = z.infer<typeof CashierSchema>;
