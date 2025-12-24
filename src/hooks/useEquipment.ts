import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getEquipment,
  getEquipmentById,
  createEquipment,
  updateEquipment,
  deleteEquipment,
} from "@/lib/api";

export type EquipmentType = "camera" | "lens" | "drone" | "gimbal" | "other";

export interface Equipment {
  _id: string;
  name: string;
  type: EquipmentType;
  createdAt?: string;
  updatedAt?: string;
}

// Query keys
export const equipmentKeys = {
  all: ["equipment"] as const,
  lists: () => [...equipmentKeys.all, "list"] as const,
  list: (filters: string) => [...equipmentKeys.lists(), { filters }] as const,
  details: () => [...equipmentKeys.all, "detail"] as const,
  detail: (id: string) => [...equipmentKeys.details(), id] as const,
};

// Get all equipment
export function useEquipment(filters?: {
  search?: string;
  type?: EquipmentType;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  return useQuery({
    queryKey: filters
      ? [...equipmentKeys.lists(), filters]
      : equipmentKeys.lists(),
    queryFn: () => getEquipment(filters),
  });
}

// Get single equipment
export function useEquipmentById(id: string | undefined) {
  return useQuery({
    queryKey: equipmentKeys.detail(id!),
    queryFn: () => getEquipmentById(id!),
    enabled: !!id,
  });
}

// Create equipment mutation
export function useCreateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

// Update equipment mutation
export function useUpdateEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Equipment>;
    }) => updateEquipment(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: equipmentKeys.detail(variables.id),
      });
    },
  });
}

// Delete equipment mutation
export function useDeleteEquipment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteEquipment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: equipmentKeys.lists() });
    },
  });
}

