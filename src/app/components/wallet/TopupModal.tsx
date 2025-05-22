"use client";

import * as z from "zod";

import { topUpFormSchema } from "@/lib/validations/topupSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { TopupForm } from "./TopupForm";

interface TopUpModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (values: z.infer<typeof topUpFormSchema>) => void;
  isLoading: boolean;
}

export function TopUpModal({
  open,
  onClose,
  onSubmit,
  isLoading,
}: TopUpModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl dark:bg-gray-900/80 bg-gray-300">
        <DialogHeader>
          <DialogTitle>Top Up Shop Wallet</DialogTitle>
        </DialogHeader>

        <TopupForm
          onSubmit={onSubmit}
          isLoading={isLoading}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
