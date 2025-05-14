"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { DataTable } from "@/components/ui/data-table";
import {
  useAddShop,
  useDeleteShop,
  useShops,
  useUpdateShop,
} from "@/hooks/useShops";
import { useSession } from "next-auth/react";
import { shopColumns } from "@/app/components/tables/shop-columns";

import { ShopFormModal } from "@/app/components/shop/AddShopModal";
import type { Shop } from "@/types";
import { ShopFormValues } from "@/lib/validations/shopSchema";
import { toast } from "sonner";
import { TableActions } from "@/app/components/tables/TableActions";
import { ConfirmDeleteDialog } from "@/app/components/ConfirmDeleteDialog";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

export default function ShopsPage() {
  const router = useRouter();

  const { data: session } = useSession();
  const userRole = session?.user?.role || "USER";

  const { data: shops, isLoading: isShopsLoading, error } = useShops();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);

  const { mutateAsync: addShop } = useAddShop();
  const { mutateAsync: updateShop } = useUpdateShop();
  const { mutateAsync: deleteShop } = useDeleteShop();

  const handleSubmit = async (data: ShopFormValues) => {
    try {
      if (currentShop) {
        // Edit existing shop
        await updateShop({ id: currentShop.id, ...data });
      } else {
        // Add new shop
        await addShop(data);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Operation failed:", error);
    }
  };

  if (error) {
    return (
      <div className="p-8 text-red-500">
        Error loading shops: {error.message}
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    if (!shopToDelete) return;

    try {
      await deleteShop(shopToDelete.id);
      toast.success("Shop deleted successfully!");
    } catch {
      toast.error("Failed to delete shop!");
    } finally {
      setShopToDelete(null); // Close the dialog
    }
  };

  // Add edit and delete action to columns
  const actionColumn = {
    id: "actions",
    cell: ({ row }: { row: { original: Shop } }) => (
      <TableActions
        onView={() => router.push(`/shops/${row.original.id}`)}
        onEdit={() => {
          setCurrentShop(row.original);
          setIsModalOpen(true);
        }}
        onDelete={() => setShopToDelete(row.original)}
        canEdit={userRole === "ADMIN" || userRole === "MANAGER"}
        canDelete={userRole === "ADMIN"}
      />
    ),
  };

  const enhancedColumns: ColumnDef<Shop>[] = [
    ...shopColumns,
    ...(userRole !== "CASHIER" || userRole !== "USER" ? [actionColumn] : []),
  ];

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shops</h1>
        {session?.user?.id && (
          <Button
            onClick={() => {
              setCurrentShop(null);
              setIsModalOpen(true);
            }}
            disabled={isShopsLoading}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Shop
          </Button>
        )}
      </div>

      <DataTable
        data={shops || []}
        columns={enhancedColumns}
        emptyMessage="No shops found."
        isLoading={isShopsLoading}
      />

      <ShopFormModal
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setCurrentShop(null);
        }}
        onSubmit={handleSubmit}
        shop={currentShop}
      />

      <ConfirmDeleteDialog
        open={!!shopToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setShopToDelete(null)}
        title={`Delete ${shopToDelete?.name}?`}
        description="This action cannot be undone."
      />
    </div>
  );
}
