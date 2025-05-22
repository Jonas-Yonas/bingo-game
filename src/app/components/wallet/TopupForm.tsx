"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Icons } from "@/app/components/icons";
import { topUpFormSchema } from "@/lib/validations/topupSchema";
import { useParams } from "next/navigation";

interface TopupFormProps {
  onSubmit: (values: z.infer<typeof topUpFormSchema>) => void;
  isLoading?: boolean;
  defaultValues?: Partial<z.infer<typeof topUpFormSchema>>;
  onCancel?: () => void;
}

export function TopupForm({
  onSubmit,
  isLoading = false,
  defaultValues,
  onCancel,
}: TopupFormProps) {
  const { id } = useParams();

  const form = useForm<z.infer<typeof topUpFormSchema>>({
    resolver: zodResolver(topUpFormSchema),
    defaultValues: {
      amount: 0,
      method: "bank_transfer",
      reference: "",
      ...defaultValues,
      shopId: id as string,
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="method"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payment Method</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="min-w-40">
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white dark:bg-gray-800/80 text-black dark:text-white">
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="online_payment">Online Payment</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reference"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reference</FormLabel>
              <FormControl>
                <Input placeholder="Payment reference" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
