import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";

type TopUpData = {
  shopId: string;
  amount: number;
  method: string;
  reference: string;
};

export const useTopUpShop = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: TopUpData) => {
      const response = await fetch(`/api/shops/${data.shopId}/topup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount,
          method: data.method,
          reference: data.reference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to top up shop");
      }

      return response.json();
    },
    onSuccess: (data, variables) => {
      // Invalidate the shop query to refresh the balance
      queryClient.invalidateQueries({
        queryKey: ["shop", variables.shopId],
      });

      toast({
        title: "Success",
        description: `Successfully topped up $${variables.amount.toFixed(2)}`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};
