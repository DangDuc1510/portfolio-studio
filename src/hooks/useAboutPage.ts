import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { IAboutPage } from "@/lib/models/AboutPage";

// API Functions
const fetchAboutPage = async (
  includeUnpublished: boolean = false
): Promise<IAboutPage | null> => {
  const url = includeUnpublished
    ? "/api/about-page?includeUnpublished=true"
    : "/api/about-page";

  const response = await fetch(url);
  const result = await response.json();

  if (!response.ok) {
    if (response.status === 404) {
      return null;
    }
    throw new Error(result.message || "Failed to fetch about page");
  }

  return result.data;
};

const updateAboutPage = async (data: Partial<IAboutPage>): Promise<IAboutPage> => {
  const response = await fetch("/api/about-page", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update about page");
  }

  return result.data;
};

const createAboutPage = async (data: Partial<IAboutPage>): Promise<IAboutPage> => {
  const response = await fetch("/api/about-page", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to create about page");
  }

  return result.data;
};

// Custom Hooks

/**
 * Hook to fetch about page data
 * @param includeUnpublished - Include unpublished data (for CMS)
 */
export function useAboutPage(includeUnpublished: boolean = false) {
  return useQuery({
    queryKey: ["about-page", includeUnpublished],
    queryFn: () => fetchAboutPage(includeUnpublished),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook to update about page
 */
export function useUpdateAboutPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateAboutPage,
    onSuccess: () => {
      // Invalidate both queries (published and unpublished)
      queryClient.invalidateQueries({ queryKey: ["about-page"] });
    },
  });
}

/**
 * Hook to create about page
 */
export function useCreateAboutPage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAboutPage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["about-page"] });
    },
  });
}

