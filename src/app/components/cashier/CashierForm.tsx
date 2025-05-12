// components/cashier/CashierForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CashierFormValues,
  CashierSchema,
} from "@/lib/validations/cashierSchema";
import { useShops } from "@/hooks/useShops";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type CashierFormProps = {
  mode?: "add" | "edit";
  defaultValues?: Partial<CashierFormValues>;
  onSubmit: (data: CashierFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

export function CashierForm({
  mode,
  defaultValues,
  onSubmit,
}: CashierFormProps) {
  const router = useRouter();
  const {
    data: shops,
    isLoading: shopsLoading,
    error: shopsError,
  } = useShops();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CashierFormValues>({
    resolver: zodResolver(CashierSchema),
    defaultValues: {
      phone: "", // Initialize with empty string instead of undefined
      ...defaultValues,
    },
  });

  // Wrap the onSubmit to ensure proper typing
  const handleFormSubmit = async (data: CashierFormValues) => {
    // Clean up empty phone values
    const formData = {
      ...data,
      phone: data.phone?.trim() || undefined,
    };

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {mode === "add" ? "Add New Cashier" : "Edit Cashier"}
      </h1>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Email *
          </label>
          <input
            {...register("email")}
            disabled={mode === "edit"}
            className={`w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white ${
              mode === "edit" ? "bg-gray-100 dark:bg-gray-600" : ""
            }`}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <input
            {...register("phone")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Shop Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Shop *
          </label>
          {shopsLoading ? (
            <div className="flex items-center justify-center p-2">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          ) : shopsError ? (
            <div className="text-red-600 dark:text-red-400 text-sm">
              Error loading shops
            </div>
          ) : shops?.length === 0 ? (
            <div className="text-yellow-600 dark:text-yellow-400 text-sm">
              No shops available. Please create shops first.
              <Button
                variant="link"
                className="ml-2 p-0 text-yellow-600 dark:text-yellow-400"
                asChild
              >
                <Link href="/admin/shops/add">Create Shop</Link>
              </Button>
            </div>
          ) : (
            <select
              {...register("shopId")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Select a shop</option>
              {shops?.map((shop) => (
                <option key={shop.id} value={shop.id}>
                  {shop.name} - {shop.location}
                </option>
              ))}
            </select>
          )}
          {errors.shopId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.shopId.message}
            </p>
          )}
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || shopsLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting
              ? mode === "add"
                ? "Adding..."
                : "Saving..."
              : mode === "add"
              ? "Add Cashier"
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
