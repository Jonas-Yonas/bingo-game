"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CashierFormSchema,
  CashierFormValues,
} from "@/lib/validations/cashierSchema";
import { Loader2 } from "lucide-react";

import { Switch } from "@/components/ui/switch";
import { useShops } from "@/hooks/useShops";

type CashierFormProps = {
  mode?: "add" | "edit";
  defaultValues?: Partial<CashierFormValues>;
  onSubmit: (data: CashierFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

export function CashierForm({
  mode = "add",
  defaultValues = {},
  onSubmit,
  onCancel,
  isLoading,
}: CashierFormProps) {
  const { data: shops } = useShops();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<CashierFormValues>({
    resolver: zodResolver(CashierFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      isActive: true,
      status: "AVAILABLE",
      shopId: "",
      ...defaultValues,
    },
  });

  const isActive = watch("isActive");

  const handleFormSubmit = async (data: CashierFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Full Name *
          </label>
          <input
            {...register("name")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting || isLoading}
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
            type="email"
            {...register("email")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting || isLoading || mode === "edit"}
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
            type="tel"
            {...register("phone")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting || isLoading}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.phone.message}
            </p>
          )}
        </div>

        {/* Shop Assignment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Assign to Shop *
          </label>
          <select
            {...register("shopId")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting || isLoading}
          >
            <option value="">Select a shop</option>
            {shops?.map((shop) => (
              <option key={shop.id} value={shop.id}>
                {shop.name} - {shop.location}
              </option>
            ))}
          </select>
          {errors.shopId && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.shopId.message}
            </p>
          )}
        </div>

        {/* Status Fields */}
        <div className="grid grid-cols-2 gap-4">
          {/* Active Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Active Status
            </label>
            <div className="flex items-center gap-2">
              <Switch
                checked={isActive}
                onCheckedChange={(value) => setValue("isActive", value)}
                disabled={isSubmitting || isLoading}
              />
              <span className="text-sm">
                {isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>

          {/* Work Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Work Status *
            </label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isSubmitting || isLoading}
            >
              <option value="AVAILABLE">Available</option>
              <option value="ON_BREAK">On Break</option>
              <option value="OFF_DUTY">Off Duty</option>
            </select>
            {errors.status && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.status.message}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isSubmitting || isLoading}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoading}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : mode === "add" ? (
              "Add Cashier"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
