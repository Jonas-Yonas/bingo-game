"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/icons";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { CashierFormModal } from "@/app/components/cashier/AddCashierModal";
import { CashierFormValues } from "@/lib/validations/cashierSchema";
import { useDeleteCashier, useUpdateCashier } from "@/hooks/useCashiers";
import { Cashier } from "@/types";
import { ConfirmDeleteDialog } from "@/app/components/ConfirmDeleteDialog";

export default function CashierDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentCashier, setCurrentCashier] = useState<Cashier | null>(null);
  const [cashierToDelete, setCashierToDelete] = useState<Cashier | null>(null);

  const { mutateAsync: updateCashier } = useUpdateCashier();
  const { mutateAsync: deleteCashier } = useDeleteCashier();
  const queryClient = useQueryClient();

  const {
    data: cashier,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["cashier", id],
    queryFn: async () => {
      const res = await fetch(`/api/cashiers/${id}`);
      if (!res.ok) throw new Error("Failed to fetch cashier");
      return res.json();
    },
  });

  const handleSubmit = async (data: CashierFormValues) => {
    try {
      if (currentCashier) {
        await updateCashier({ id: currentCashier.id, ...data });

        // Invalidate queries to refresh data
        await queryClient.invalidateQueries({
          queryKey: ["cashier", id],
        });

        toast({
          title: "Success",
          description: "Cashier updated successfully",
        });
      }
      setIsModalOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Failed to update cashier",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = () => {
    if (!cashier) return;
    setCashierToDelete(cashier);
  };

  const handleConfirmDelete = async () => {
    if (!cashierToDelete) return;

    try {
      await deleteCashier(cashierToDelete.id);
      toast({
        title: "Success",
        description: "Cashier deleted successfully",
      });
      router.push("/cashiers");
    } catch {
      toast({
        title: "Error",
        description: "Failed to delete cashier",
        variant: "destructive",
      });
    } finally {
      setCashierToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-3 items-center justify-center h-64">
        <Spinner />
        <div className="text-white">Loading cashier...</div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!cashier) {
    return <div className="p-4">Cashier not found</div>;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Cashier Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">
                  {cashier.name}
                </CardTitle>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Icons.mail className="h-4 w-4" />
                  {cashier.email}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentCashier(cashier);
                    setIsModalOpen(true);
                  }}
                >
                  <Icons.edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDeleteClick}
                >
                  <Icons.trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icons.phone className="h-4 w-4" />
                  <span>Phone</span>
                </div>
                <p className="text-xl font-semibold">
                  {cashier.phone || "Not provided"}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icons.calendar className="h-4 w-4" />
                  <span>Joined On</span>
                </div>
                <p className="text-xl font-semibold">
                  {new Date(cashier.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icons.activity className="h-4 w-4" />
                  <span>Status</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={cashier.isActive ? "default" : "secondary"}>
                    {cashier.status}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {cashier.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Shop Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.store className="h-5 w-5" />
              Assigned Shop
            </CardTitle>
          </CardHeader>
          <CardContent>
            {cashier.shop ? (
              <div className="flex flex-col space-y-4">
                <div>
                  <p className="font-medium">{cashier.shop.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {cashier.shop.location}
                  </p>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  View Shop Details
                </Button>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No shop assigned</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Assign to Shop
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Account Info (if linked) */}
        {cashier.user && (
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icons.user className="h-5 w-5" />
                User Account
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={cashier.user.image || ""} />
                  <AvatarFallback>
                    {cashier.user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {cashier.user.name || "No name"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {cashier.user.email}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {cashier.user.role}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

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
        description="This will permanently delete this cashier record."
      />
    </div>
  );
}
