"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ShopFormSchema, ShopFormValues } from "@/lib/validations/shopSchema";
import { Loader2 } from "lucide-react";
import { User } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ShopFormProps = {
  mode?: "add" | "edit";
  defaultValues?:
    | Partial<ShopFormValues>
    | (Partial<ShopFormValues> & { managerId?: string | null });
  onSubmit: (data: ShopFormValues) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
  managers?: Pick<User, "id" | "name" | "email">[];
};

const numericFields: {
  key: keyof ShopFormValues;
  label: string;
  max?: number;
}[] = [
  { key: "shopCommission", label: "Shop Commission (%)", max: 100 },
  { key: "systemCommission", label: "System Commission (%)", max: 100 },
  { key: "walletBalance", label: "Wallet Balance" },
];

export function ShopForm({
  mode = "add",
  defaultValues = {},
  onSubmit,
  onCancel,
  isLoading,
  managers = [],
}: ShopFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
  } = useForm<ShopFormValues>({
    resolver: zodResolver(ShopFormSchema),
    defaultValues: {
      name: "",
      location: "",
      shopCommission: 0,
      systemCommission: 0,
      walletBalance: 0,
      managerId: "",
      ...defaultValues,
    },
  });

  const isDisabled = isSubmitting || isLoading;
  const selectedManagerId = watch("managerId") || "";

  const handleFormSubmit = async (data: ShopFormValues) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg shadow max-w-3xl mx-auto">
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Text Inputs: Name, Location, Manager */}
        <div className="space-y-4">
          {/* Name */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Shop Name *
            </label>
            <input
              id="name"
              {...register("name")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isDisabled}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Location *
            </label>
            <input
              id="location"
              {...register("location")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              disabled={isDisabled}
            />
            {errors.location && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.location.message}
              </p>
            )}
          </div>

          {/* Manager */}
          <div>
            <label
              htmlFor="managerId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Manager *
            </label>
            <Select
              value={selectedManagerId}
              onValueChange={(value) =>
                setValue("managerId", value, { shouldValidate: true })
              }
              disabled={isDisabled || managers.length === 0}
            >
              <SelectTrigger className="w-full" id="managerId">
                <SelectValue
                  placeholder={
                    managers.length === 0
                      ? "No managers available"
                      : "Select a manager"
                  }
                />
              </SelectTrigger>
              {managers.length > 0 ? (
                <SelectContent className="bg-gray-800/90">
                  {managers.map((manager) => (
                    <SelectItem
                      key={manager.id}
                      value={manager.id}
                      title={manager.email}
                      className="cursor-pointer"
                    >
                      {manager.name || manager.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              ) : (
                <SelectContent>
                  <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                    No managers found
                  </div>
                </SelectContent>
              )}
            </Select>
            {errors.managerId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.managerId.message}
              </p>
            )}
            {managers.length === 0 && (
              <p className="mt-1 text-sm text-yellow-600 dark:text-yellow-400">
                Please create manager accounts first
              </p>
            )}
          </div>
        </div>

        {/* Wallet Balance - full width */}
        <div className="mb-4">
          <label
            htmlFor="walletBalance"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Wallet Balance *
          </label>
          <input
            id="walletBalance"
            type="number"
            step="0.01"
            min={0}
            {...register("walletBalance")}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            disabled={isDisabled}
          />
          {errors.walletBalance && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.walletBalance.message}
            </p>
          )}
        </div>

        {/* Two commission fields side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {numericFields
            .filter(({ key }) => key !== "walletBalance")
            .map(({ key, label, max }) => (
              <div key={key}>
                <label
                  htmlFor={key}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  {label} *
                </label>
                <input
                  id={key}
                  type="number"
                  step="0.01"
                  min={0}
                  max={max}
                  {...register(key)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                  disabled={isDisabled}
                />
                {errors[key] && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors[key]?.message}
                  </p>
                )}
              </div>
            ))}
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            disabled={isDisabled}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isDisabled}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 flex items-center justify-center"
          >
            {isDisabled ? (
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
