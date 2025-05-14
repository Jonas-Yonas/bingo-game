"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
  useAddCashier,
  useDeleteCashier,
  useCashiers,
  useUpdateCashier,
} from "@/hooks/useCashiers";
import { useSession } from "next-auth/react";
import { CashierFormModal } from "@/app/components/cashier/AddCashierModal";
import { CashierFormValues } from "@/lib/validations/cashierSchema";
import { TableActions } from "@/app/components/tables/TableActions";
import { ConfirmDeleteDialog } from "@/app/components/ConfirmDeleteDialog";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { Cashier, Shop } from "@/types";
import { cashierColumns } from "@/app/components/tables/cashier-columns";

export default function CashiersPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const userRole = session?.user?.role || "USER";

  // Fetch cashiers based on user role
  const { data: cashiers, isLoading: isCashiersLoading, error } = useCashiers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCashier, setCurrentCashier] = useState<Cashier | null>(null);
  const [cashierToDelete, setCashierToDelete] = useState<Cashier | null>(null);

  const { mutateAsync: addCashier } = useAddCashier();
  const { mutateAsync: updateCashier } = useUpdateCashier();
  const { mutateAsync: deleteCashier } = useDeleteCashier();

  const handleSubmit = async (data: CashierFormValues) => {
    try {
      if (currentCashier) {
        await updateCashier({ id: currentCashier.id, ...data });
        toast({
          title: "Success",
          description: "Cashier updated successfully!",
        });
      } else {
        await addCashier(data);
        toast({
          title: "Success",
          description: "Cashier added successfully!",
        });
      }
      setIsModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Operation failed!",
      });
      console.error("Operation failed:", error);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading cashiers: {error.message}
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    if (!cashierToDelete) return;

    try {
      await deleteCashier(cashierToDelete.id);
      toast({
        title: "Success",
        description: "Cashier deleted successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete cashier!",
      });
    } finally {
      setCashierToDelete(null);
    }
  };

  // Add actions column if user has permissions
  const actionColumn: ColumnDef<Cashier> = {
    id: "actions",
    cell: ({ row }) => (
      <TableActions
        onView={() => router.push(`/cashiers/${row.original.id}`)}
        onEdit={() => {
          setCurrentCashier(row.original);
          setIsModalOpen(true);
        }}
        onDelete={() => setCashierToDelete(row.original)}
        canEdit={userRole === "ADMIN" || userRole === "MANAGER"}
        canDelete={userRole === "ADMIN"}
      />
    ),
  };

  const enhancedColumns: ColumnDef<Cashier>[] = [
    ...cashierColumns,
    ...(userRole !== "CASHIER" && userRole !== "USER" ? [actionColumn] : []),
  ];

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Cashiers</h1>
        {(userRole === "ADMIN" || userRole === "MANAGER") && (
          <Button
            onClick={() => {
              setCurrentCashier(null);
              setIsModalOpen(true);
            }}
            disabled={isCashiersLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Cashier
          </Button>
        )}
      </div>

      <DataTable
        data={(cashiers as Cashier[]) || []}
        columns={enhancedColumns}
        emptyMessage="No cashiers found."
        isLoading={isCashiersLoading}
      />

      <CashierFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentCashier(null);
        }}
        onSubmit={handleSubmit}
        cashier={currentCashier}
      />

      <ConfirmDeleteDialog
        open={!!cashierToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setCashierToDelete(null)}
        title={`Delete ${cashierToDelete?.name}?`}
        description="This will permanently remove this cashier and their data."
      />
    </div>
  );
}
