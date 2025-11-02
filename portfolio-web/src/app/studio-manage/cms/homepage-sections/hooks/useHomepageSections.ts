import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getHomepageSections,
  updateHomepageSection,
} from "@/lib/api";

export interface HomepageSection {
  id: string;
  sectionName: string;
  isVisible: boolean;
  content: any;
}

// Query keys
export const homepageSectionKeys = {
  all: ["homepage-sections"] as const,
  lists: () => [...homepageSectionKeys.all, "list"] as const,
  list: (filters: string) => [...homepageSectionKeys.lists(), { filters }] as const,
  details: () => [...homepageSectionKeys.all, "detail"] as const,
  detail: (id: string) => [...homepageSectionKeys.details(), id] as const,
};

// Get all homepage sections
export function useHomepageSections() {
  return useQuery({
    queryKey: homepageSectionKeys.lists(),
    queryFn: getHomepageSections,
  });
}

// Get single section (from list)
export function useHomepageSection(sectionName: string | undefined, sections?: HomepageSection[]) {
  return sections?.find(s => s.sectionName === sectionName);
}

// Update homepage section mutation
export function useUpdateHomepageSection() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<HomepageSection> }) =>
      updateHomepageSection(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: homepageSectionKeys.lists() });
    },
  });
}

