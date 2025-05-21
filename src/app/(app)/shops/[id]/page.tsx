"use client";

import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/components/icons";

import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { ShopFormModal } from "@/app/components/shop/AddShopModal";
import { ShopFormValues } from "@/lib/validations/shopSchema";
import { useDeleteShop, useUpdateShop } from "@/hooks/useShops";
import { Cashier, Shop } from "@/types";
import { ConfirmDeleteDialog } from "@/app/components/ConfirmDeleteDialog";

export default function ShopDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentShop, setCurrentShop] = useState<Shop | null>(null);
  const [shopToDelete, setShopToDelete] = useState<Shop | null>(null);

  const { mutateAsync: updateShop } = useUpdateShop();
  const { mutateAsync: deleteShop } = useDeleteShop();
  const queryClient = useQueryClient();

  const {
    data: shop,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["shop", id],
    queryFn: async () => {
      const res = await fetch(`/api/shops/${id}`);
      if (!res.ok) throw new Error("Failed to fetch shop");
      return res.json();
    },
  });

  const handleSubmit = async (data: ShopFormValues) => {
    try {
      if (currentShop) {
        await updateShop({ id: currentShop.id, ...data });

        // Proper invalidation
        await queryClient.invalidateQueries({
          queryKey: ["shop", id],
        });

        toast({
          title: "Success",
          description: "Your changes have been saved.",
        });
      }
      setIsModalOpen(false);
    } catch {
      toast({
        title: "Error",
        description: "Unable to save your changes.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteClick = () => {
    if (!shop) return;

    if (shop.cashiers.length > 0) {
      toast({
        title: "Cannot delete shop",
        description: "Please remove all cashiers before deleting this shop",
        variant: "destructive",
      });
      return;
    }

    setShopToDelete(shop);
  };

  const handleConfirmDelete = async () => {
    if (!shopToDelete) return;

    try {
      await deleteShop(shopToDelete.id);
      toast({
        title: "Success",
        description: "Shop deleted successfully",
      });
      router.push("/shops/shop-list");
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to delete shop",
        variant: "destructive",
      });
    } finally {
      setShopToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col gap-y-3 items-center justify-center h-64">
        <Spinner />
        <div className="text-white">Loading shop...</div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error.message}</div>;
  }

  if (!shop) {
    return <div className="p-4">Shop not found</div>;
  }

  // Calculate active cashiers percentage
  const activeCashiersPct =
    shop.cashiers.length > 0
      ? (shop.cashiers.filter((c: { isActive: boolean }) => c.isActive).length /
          shop.cashiers.length) *
        100
      : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Shop Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-3xl font-bold">
                  {shop.name}
                </CardTitle>
                <p className="text-muted-foreground mt-2 flex items-center gap-2">
                  <Icons.mapPin className="h-4 w-4" />
                  {shop.location}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setCurrentShop(shop);
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
                  disabled={!shop} // Disable if no shop loaded
                >
                  <Icons.trash className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icons.percentage className="h-4 w-4" />
                  <span>Shop Commission</span>
                </div>
                <p className="text-2xl font-semibold">{shop.shopCommission}%</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icons.monitor className="h-4 w-4" />
                  <span>System Commission</span>
                </div>
                <p className="text-2xl font-semibold">
                  {shop.systemCommission}%
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icons.wallet className="h-4 w-4" />
                  <span>Wallet Balance</span>
                </div>
                <p className="text-2xl font-semibold">
                  $
                  {shop.walletBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manager Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icons.user className="h-5 w-5" />
              Manager
            </CardTitle>
          </CardHeader>
          <CardContent>
            {shop.manager ? (
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={shop.manager.image || ""} />
                  <AvatarFallback>
                    {shop.manager.name?.charAt(0) || "M"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">
                    {shop.manager.name || "No name"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shop.manager.email}
                  </p>
                  <Badge variant="outline" className="mt-1">
                    {shop.manager.role}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <p className="text-muted-foreground">No manager assigned</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Assign Manager
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Cashiers Section */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center gap-2">
                <Icons.users className="h-5 w-5" />
                Cashiers ({shop.cashiers.length})
              </CardTitle>
              <div className="flex gap-2">
                <Progress
                  value={activeCashiersPct}
                  className="w-24 h-2 bg-gray-200 [&>div]:bg-green-500"
                />

                <Button size="sm">
                  <Icons.plus className="h-4 w-4 mr-2" />
                  Add Cashier
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {shop.cashiers.length > 0 ? (
              <div className="space-y-4">
                {shop.cashiers.map((cashier: Cashier) => (
                  <div
                    key={cashier.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarImage src={cashier.avatar || ""} />
                        <AvatarFallback>
                          {cashier.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{cashier.name}</p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{cashier.email}</span>
                          {cashier.phone && (
                            <>
                              <span>•</span>
                              <span>{cashier.phone}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge
                        variant={cashier.isActive ? "default" : "secondary"}
                      >
                        {cashier.isActive ? "Active" : "Inactive"}
                      </Badge>
                      <Badge variant="outline">{cashier.status}</Badge>
                      <Button variant="ghost" size="icon">
                        <Icons.moreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Icons.users className="h-8 w-8 mx-auto text-muted-foreground" />
                <p className="mt-2 text-muted-foreground">
                  No cashiers assigned
                </p>
                <Button variant="ghost" size="sm" className="mt-4">
                  <Icons.plus className="h-4 w-4 mr-2" />
                  Add Your First Cashier
                </Button>
              </div>
            )}
          </CardContent>
          {shop.cashiers.length > 0 && (
            <CardFooter className="text-sm text-muted-foreground">
              Showing {shop.cashiers.length} cashiers •{" "}
              {Math.round(activeCashiersPct)}% active
            </CardFooter>
          )}
        </Card>
      </div>

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
        description="This will permanently delete the shop and all its data."
      />
    </div>
  );
}
