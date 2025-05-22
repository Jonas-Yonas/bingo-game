import * as z from "zod";

export const topUpFormSchema = z.object({
  amount: z.number().min(0.01, "Amount must be at least 0.01"),
  method: z.enum(["bank_transfer", "cash", "online_payment"]),
  reference: z.string().min(2, "Reference is required"),
  shopId: z.string().min(1, "Shop is required"),
});

export type TopUpFormValues = z.infer<typeof topUpFormSchema>;
