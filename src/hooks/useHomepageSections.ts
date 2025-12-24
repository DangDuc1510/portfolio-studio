import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHomepageSections,
  createHomepageSection,
  updateHomepageSection,
  deleteHomepageSection,
  getHomepageSectionById,
} from "@/lib/api";

export interface HomepageSection {
  _id: string;
  sectionName: string;
  isVisible: boolean;
  content: Record<string, unknown>;
}

// Query keys
export const homepageSectionKeys = {
  all: ["homepage-sections"] as const,
  lists: () => [...homepageSectionKeys.all, "list"] as const,
  list: (filters: string) =>
    [...homepageSectionKeys.lists(), { filters }] as const,
  details: () => [...homepageSectionKeys.all, "detail"] as const,
  detail: (id: string) => [...homepageSectionKeys.details(), id] as const,
};

// Get all homepage sections
export function useHomepageSections() {
  return useQuery({
    queryKey: homepageSectionKeys.lists(),
    queryFn: getHomepageSections,
    staleTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
}

// Get single section (from list)
export function useHomepageSection(
  sectionName: string | undefined,
  sections?: HomepageSection[]
) {
  return sections?.find((s) => s.sectionName === sectionName);
}

// Get single section by ID
export function useHomepageSectionById(id: string | undefined) {
  return useQuery({
    queryKey: homepageSectionKeys.detail(id!),
    queryFn: () => getHomepageSectionById(id!),
    enabled: !!id,
  });
}

// Create homepage section mutation
export function useCreateHomepageSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<HomepageSection, "_id">) =>
      createHomepageSection(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: homepageSectionKeys.lists(),
      });
    },
  });
}

// Update homepage section mutation
export function useUpdateHomepageSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<HomepageSection>;
    }) => updateHomepageSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: homepageSectionKeys.lists(),
      });
    },
  });
}

// Delete homepage section mutation
export function useDeleteHomepageSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteHomepageSection(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: homepageSectionKeys.lists(),
      });
    },
  });
}
