// app/admin/cashiers/_components/AddCashierModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CashierForm } from "./CashierForm";
import { useAddCashier } from "@/hooks/useCashiers";
import { CashierFormValues } from "@/lib/validations/cashierSchema";

export function AddCashierModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { mutate: addCashier, isPending } = useAddCashier();

  const handleSubmit = async (data: CashierFormValues) => {
    addCashier(data, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Cashier</DialogTitle>
        </DialogHeader>
        <CashierForm
          onSubmit={handleSubmit}
          onCancel={onClose}
          isLoading={isPending}
        />
      </DialogContent>
    </Dialog>
  );
}
