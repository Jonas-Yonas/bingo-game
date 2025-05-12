import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { ShopFormValues } from "@/lib/validations/shopSchema";

// Type used for lists
interface Shop {
  id: string;
  name: string;
  location: string;
  shopCommission: number;
  systemCommission: number;
  walletBalance: number;
}

// Fetch all shops
export function useShops() {
  return useQuery<Shop[], AxiosError>({
    queryKey: ["shops"],
    queryFn: async () => {
      const { data } = await axios.get("/api/shops");
      return data;
    },
    staleTime: 60 * 1000,
    retry: (failureCount, error) => {
      if (error.response?.status === 404) return false;
      return failureCount < 3;
    },
  });
}

// Fetch a single shop
export function useShop(id?: string) {
  return useQuery<Shop, AxiosError>({
    queryKey: ["shops", id],
    queryFn: async () => {
      const { data } = await axios.get(`/api/shops/${id}`);
      return data;
    },
    enabled: !!id,
  });
}

// Add new shop
export function useAddShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ShopFormValues) => {
      const response = await axios.post("/api/shops", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
    onError: (error: AxiosError) => {
      console.error("Shop creation failed:", error.response?.data);
      // You can add toast notifications here if needed
    },
  });
}

// Update existing shop
export function useUpdateShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & ShopFormValues) =>
      axios.patch(`/api/shops/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });
}

// Delete existing shop
export function useDeleteShop() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) =>
      axios.delete(`/api/shops/${id}`).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shops"] });
    },
  });
}
