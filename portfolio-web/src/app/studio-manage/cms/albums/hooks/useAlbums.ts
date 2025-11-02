import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAlbums,
  getAlbumById,
  createAlbum,
  updateAlbum,
  deleteAlbum,
} from "@/lib/api";

export interface Album {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  productIds: string[];
}

// Query keys
export const albumKeys = {
  all: ["albums"] as const,
  lists: () => [...albumKeys.all, "list"] as const,
  list: (filters: string) => [...albumKeys.lists(), { filters }] as const,
  details: () => [...albumKeys.all, "detail"] as const,
  detail: (id: string) => [...albumKeys.details(), id] as const,
};

// Get all albums
export function useAlbums() {
  return useQuery({
    queryKey: albumKeys.lists(),
    queryFn: getAlbums,
  });
}

// Get single album
export function useAlbum(id: string | undefined) {
  return useQuery({
    queryKey: albumKeys.detail(id!),
    queryFn: () => getAlbumById(id!),
    enabled: !!id,
  });
}

// Create album mutation
export function useCreateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
  });
}

// Update album mutation
export function useUpdateAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Album> }) =>
      updateAlbum(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: albumKeys.detail(variables.id),
      });
    },
  });
}

// Delete album mutation
export function useDeleteAlbum() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAlbum,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: albumKeys.lists() });
    },
  });
}

