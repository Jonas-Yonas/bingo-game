"use client";

import { useSession } from "next-auth/react";
import { useAddCashier } from "@/hooks/useCashiers";
import { CashierForm } from "@/app/components/cashier/CashierForm";
import { CashierFormValues } from "@/lib/validations/cashierSchema";

export default function AddCashierPage() {
  const { data: session } = useSession();
  const { mutateAsync: addCashier } = useAddCashier();

  if (!session || session.user.role !== "ADMIN") {
    return <div className="text-center py-8">Unauthorized access</div>;
  }

  const handleSubmit = async (data: CashierFormValues) => {
    await addCashier(data);
  };

  return <CashierForm mode="add" onSubmit={handleSubmit} />;
}
