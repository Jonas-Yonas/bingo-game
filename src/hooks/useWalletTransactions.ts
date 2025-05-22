import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@/components/ui/use-toast";
import { WalletTransaction } from "@/types";

export const useWalletTransactions = () => {
  return useQuery<WalletTransaction[]>({
    queryKey: ["wallet-transactions"],
    queryFn: async () => {
      const res = await fetch("/api/wallet/transactions");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });
};

export const useTopUpWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      amount: number;
      method: string;
      reference: string;
      shopId: string;
    }) => {
      const response = await fetch("/api/wallet/top-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Top-up failed");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["wallet-transactions"],
      });

      toast({
        title: "Success",
        description: "Wallet topped up successfully",
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
