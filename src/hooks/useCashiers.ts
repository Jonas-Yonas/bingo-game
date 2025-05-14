import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CashierFormValues } from "@/lib/validations/cashierSchema";
import { Shop } from "@/types";

interface Cashier {
  id: string;
  name: string;
  email: string;
  phone?: string;
  isActive: boolean;
  status: "AVAILABLE" | "ON_BREAK" | "OFF_DUTY";
  // shop?: {
  //   id: string;
  //   name: string;
  //   location: string;
  // };
  shop?: Shop;
  createdAt?: Date;
  updatedAt?: Date;
  userId?: string;
}

// Fetch all cashiers
export function useCashiers() {
  return useQuery<Cashier[], AxiosError>({
    queryKey: ["cashiers"],
    queryFn: async () => {
      const { data } = await axios.get("/api/cashiers");
      return data;
    },
    staleTime: 60 * 1000, // 1 minute cache
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Fetch a single cashier
export function useCashier(id?: string) {
  return useQuery<Cashier, AxiosError>({
    queryKey: ["cashiers", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/cashiers/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// Add new cashier
export function useAddCashier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CashierFormValues) => {
      const response = await axios.post("/api/cashiers", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
    },
    onError: (error: AxiosError) => {
      console.error("Cashier creation failed:", error.response?.data);
      // You can add toast notifications here if needed
    },
  });
}

// Update existing cashier
export function useUpdateCashier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      ...data
    }: { id: string } & Partial<CashierFormValues>) =>
      axios.patch(`/api/cashiers/${id}`, data).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
      queryClient.invalidateQueries({ queryKey: ["cashiers", variables.id] });
    },
  });
}

// Delete existing cashier
export function useDeleteCashier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/cashiers/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
    },
    onError: (error: AxiosError) => {
      console.error("Cashier deletion failed:", error.response?.data);
    },
  });
}

// Toggle cashier active status
export function useToggleCashierStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      axios.patch(`/api/cashiers/${id}`, { isActive }).then((res) => res.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
      queryClient.invalidateQueries({ queryKey: ["cashiers", variables.id] });
    },
  });
}

export function useShopCashiers(shopId?: string) {
  return useQuery<Cashier[]>({
    queryKey: ["cashiers", "shop", shopId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/shops/${shopId}/cashiers`);
      return data;
    },
    enabled: !!shopId,
  });
}
