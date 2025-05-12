"use client";

import { useSession } from "next-auth/react";
import { useCashier, useUpdateCashier } from "@/hooks/useCashiers";
import { notFound, useParams } from "next/navigation";
import { CashierForm } from "@/app/components/cashier/CashierForm";
import { CashierFormValues } from "@/lib/validations/cashierSchema";

export default function EditCashierPage() {
  const { id } = useParams() as { id: string };

  const { data: session } = useSession();
  const { data: cashier, isLoading } = useCashier(id);
  const { mutateAsync: updateCashier } = useUpdateCashier();

  if (!session || session.user.role !== "ADMIN") {
    return <div className="text-center py-8">Unauthorized access</div>;
  }

  if (isLoading) return <div className="text-center py-8">Loading...</div>;
  if (!cashier) return notFound();

  const handleSubmit = async (data: CashierFormValues) => {
    await updateCashier({ id: id, ...data });
  };

  return (
    <CashierForm
      mode="edit"
      defaultValues={{
        name: cashier.name,
        email: cashier.email,
        phone: cashier.phone || "",
        shopId: cashier.shopId,
      }}
      onSubmit={handleSubmit}
    />
  );
}
