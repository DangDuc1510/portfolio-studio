import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCustomers,
  getCustomerById,
  updateCustomerById,
  deleteCustomerById,
} from "@/lib/api";

export interface Customer {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  submissionDate: string;
  status?: 'pending' | 'contacted' | 'scheduled' | 'completed' | 'cancelled';
  note?: string;
  serviceCount?: number;
  isReturningCustomer?: boolean;
  previousNote?: string;
  createdAt?: string;
  updatedAt?: string;
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
export function useCustomers(filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) {
  return useQuery({
    queryKey: filters ? [...customerKeys.lists(), filters] : customerKeys.lists(),
    queryFn: () => getCustomers(filters),
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

// Update customer mutation
export function useUpdateCustomer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      updateCustomerById(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: customerKeys.detail(variables.id),
      });
    },
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

