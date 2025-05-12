"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShopFormSchema, ShopFormValues } from "@/lib/validations/shopSchema";
import { Loader2 } from "lucide-react";

type ShopFormProps = {
  mode?: "add" | "edit";
  defaultValues?: Partial<ShopFormValues>;
  onSubmit: (data: ShopFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
};

export function ShopForm({
  mode = "add",
  defaultValues = {},
  onSubmit,
  onCancel,
  isLoading,
}: ShopFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ShopFormValues>({
    resolver: zodResolver(ShopFormSchema),
    defaultValues: {
      name: "",
      location: "",
      shopCommission: 0,
      systemCommission: 0,
      walletBalance: 0,
      ...defaultValues,
    },
  });

  const handleFormSubmit = async (data: ShopFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      {/* <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        {mode === "add" ? "Add New Shop" : "Edit Shop"}
      </h1> */}

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Shop Name *
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

        {/* Location Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location *
          </label>
          <input
            {...register("location")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isSubmitting || isLoading}
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.location.message}
            </p>
          )}
        </div>

        {/* Commission Fields */}
        {["shopCommission", "systemCommission", "walletBalance"].map(
          (field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {field === "walletBalance"
                  ? "Wallet Balance *"
                  : `${field.split(/(?=[A-Z])/).join(" ")} (%) *`}
              </label>
              <input
                type="number"
                step="0.01"
                min={0}
                max={field.includes("Commission") ? 100 : undefined}
                {...register(field as keyof ShopFormValues)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                disabled={isSubmitting || isLoading}
              />
              {errors[field as keyof typeof errors] && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                  {errors[field as keyof typeof errors]?.message}
                </p>
              )}
            </div>
          )
        )}

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
              "Add Shop"
            ) : (
              "Save Changes"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
