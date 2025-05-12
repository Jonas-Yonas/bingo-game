"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { ShopForm } from "./ShopForm";
import type { Shop } from "@/types";
import type { ShopFormValues } from "@/lib/validations/shopSchema";

type ShopFormModalProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ShopFormValues) => void;
  shop?: Shop | null;
};

export function ShopFormModal({
  open,
  onClose,
  onSubmit,
  shop,
}: ShopFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <Dialog open={open} onOpenChange={onClose}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                {shop ? "Edit " : "Add New"} Shop
              </DialogTitle>
            </DialogHeader>
            <ShopForm
              mode={shop ? "edit" : "add"}
              defaultValues={shop || undefined}
              onSubmit={async (data) => onSubmit(data)}
              onCancel={onClose}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
