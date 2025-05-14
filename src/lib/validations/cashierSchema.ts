import { z } from "zod";

export const CashierFormSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  isActive: z.boolean(),
  status: z.enum(["AVAILABLE", "ON_BREAK", "OFF_DUTY"]),
  shopId: z.string().min(1),
});

export type CashierFormValues = z.infer<typeof CashierFormSchema>;
