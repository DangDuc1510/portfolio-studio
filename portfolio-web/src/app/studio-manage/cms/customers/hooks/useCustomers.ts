import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  getCustomerById,
  deleteCustomerById,
} from "@/lib/api";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  submissionDate: string;
}

// Query keys
export const customerKeys = {
  all: ["customers"] as const,
  lists: () => [...customerKeys.all, "list"] as const,
  list: (filters: string) => [...customerKeys.lists(), { filters }] as const,
  details: () => [...customerKeys.all, "detail"] as const,
  detail: (id: string) => [...customerKeys.details(), id] as const,
};

// Get all customers
export function useCustomers() {
  return useQuery({
    queryKey: customerKeys.lists(),
    queryFn: getCustomers,
  });
}

// Get single customer
export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: customerKeys.detail(id!),
    queryFn: () => getCustomerById(id!),
    enabled: !!id,
  });
}

// Delete customer mutation
export function useDeleteCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteCustomerById,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
    },
  });
}

