import axios from "axios";
import { CashierFormValues } from "@/lib/validations/cashierSchema";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";

// hooks/useCashiers.ts
export function useAddCashier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CashierFormValues) =>
      axios.post("/api/cashiers", data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
    },
  });
}

export function useUpdateCashier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: { id: string } & CashierFormValues) =>
      axios.patch(`/api/cashiers/${id}`, data).then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cashiers"] });
    },
  });
}

export function useCashier(id?: string) {
  return useQuery({
    queryKey: ["cashiers", id],
    queryFn: () => axios.get(`/api/cashiers/${id}`).then((res) => res.data),
    enabled: !!id,
  });
}
