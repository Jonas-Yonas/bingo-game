"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CashierForm } from "./CashierForm";
import type { Cashier } from "@/types";
import type { CashierFormValues } from "@/lib/validations/cashierSchema";

type CashierFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CashierFormValues) => void;
  cashier?: Cashier | null;
};

export function CashierFormModal({
  open,
  onClose,
  onSubmit,
  cashier,
}: CashierFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                {cashier ? "Edit " : "Add New"} Cashier
              </DialogTitle>
            </DialogHeader>
            <CashierForm
              mode={cashier ? "edit" : "add"}
              defaultValues={
                cashier
                  ? {
                      ...cashier,
                      shopId: cashier.shop?.id || "",
                    }
                  : undefined
              }
              onSubmit={async (data) => onSubmit(data)}
              onCancel={onClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
