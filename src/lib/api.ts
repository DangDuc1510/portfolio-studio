import axiosInstance from "@/lib/axiosInstance";

// Albums API
export const getAlbums = async () => {
  const response = await axiosInstance.get("/api/albums");
  return response.data;
};

export const getAlbumById = async (id: string) => {
  const response = await axiosInstance.get(`/api/albums/${id}`);
  return response.data;
};

export const createAlbum = async (albumData: Record<string, unknown>) => {
  const response = await axiosInstance.post("/api/albums", albumData);
  return response.data;
};

export const updateAlbum = async (
  id: string,
  albumData: Record<string, unknown>
) => {
  const response = await axiosInstance.patch(`/api/albums/${id}`, albumData);
  return response.data;
};

export const deleteAlbum = async (id: string) => {
  const response = await axiosInstance.delete(`/api/albums/${id}`);
  return response.data;
};

// Products API
export const getProducts = async (filters?: {
  search?: string;
  productType?: "QUAY_DUNG" | "THIET_KE" | "CHUP_CHINH_ANH";
  albumId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  // QUAY_DUNG filters
  location?: string | string[];
  categoryText?: string | string[];
  equipmentIds?: string | string[];
  // THIET_KE filters
  designType?: string | string[];
  clientType?: string | string[];
  toolsUsed?: string | string[];
  // CHUP_CHINH_ANH filters
  photographyType?: string | string[];
  // Year filter (based on createdAt)
  year?: string | string[];
}) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.productType) params.append("productType", filters.productType);
  if (filters?.albumId) params.append("albumId", filters.albumId);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  // QUAY_DUNG filters
  if (filters?.location) {
    const location = Array.isArray(filters.location)
      ? filters.location
      : [filters.location];
    params.append("location", JSON.stringify(location));
  }
  if (filters?.categoryText) {
    const categoryText = Array.isArray(filters.categoryText)
      ? filters.categoryText
      : [filters.categoryText];
    params.append("categoryText", JSON.stringify(categoryText));
  }
  if (filters?.equipmentIds) {
    const equipmentIds = Array.isArray(filters.equipmentIds)
      ? filters.equipmentIds
      : [filters.equipmentIds];
    params.append("equipmentIds", JSON.stringify(equipmentIds));
  }

  // THIET_KE filters
  if (filters?.designType) {
    const designType = Array.isArray(filters.designType)
      ? filters.designType
      : [filters.designType];
    params.append("designType", JSON.stringify(designType));
  }
  if (filters?.clientType) {
    const clientType = Array.isArray(filters.clientType)
      ? filters.clientType
      : [filters.clientType];
    params.append("clientType", JSON.stringify(clientType));
  }
  if (filters?.toolsUsed) {
    const toolsUsed = Array.isArray(filters.toolsUsed)
      ? filters.toolsUsed
      : [filters.toolsUsed];
    params.append("toolsUsed", JSON.stringify(toolsUsed));
  }

  // CHUP_CHINH_ANH filters
  if (filters?.photographyType) {
    const photographyType = Array.isArray(filters.photographyType)
      ? filters.photographyType
      : [filters.photographyType];
    params.append("photographyType", JSON.stringify(photographyType));
  }

  // Year filter
  if (filters?.year) {
    const year = Array.isArray(filters.year) ? filters.year : [filters.year];
    params.append("year", JSON.stringify(year));
  }

  const queryString = params.toString();
  const url = queryString ? `/api/products?${queryString}` : "/api/products";
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
};

export const createProduct = async (productData: Record<string, unknown>) => {
  const response = await axiosInstance.post("/api/products", productData);
  return response.data;
};

export const updateProductById = async (
  id: string,
  productData: Record<string, unknown>
) => {
  const response = await axiosInstance.patch(
    `/api/products/${id}`,
    productData
  );
  return response.data;
};

export const deleteProductById = async (id: string) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};

// Equipment API
export const getEquipment = async (filters?: {
  search?: string;
  type?: "camera" | "lens" | "drone" | "gimbal" | "other";
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append("search", filters.search);
  if (filters?.type) params.append("type", filters.type);
  if (filters?.page) params.append("page", filters.page.toString());
  if (filters?.limit) params.append("limit", filters.limit.toString());
  if (filters?.sortBy) params.append("sortBy", filters.sortBy);
  if (filters?.sortOrder) params.append("sortOrder", filters.sortOrder);

  const queryString = params.toString();
  const url = queryString ? `/api/equipment?${queryString}` : "/api/equipment";
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getEquipmentById = async (id: string) => {
  const response = await axiosInstance.get(`/api/equipment/${id}`);
  return response.data;
};

export const createEquipment = async (equipmentData: {
  name: string;
  type: "camera" | "lens" | "drone" | "gimbal" | "other";
}) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.post("/api/equipment", equipmentData, {
    headers: {
      ...(apiKey && { "X-API-Key": apiKey }),
    },
  });
  return response.data;
};

export const updateEquipment = async (
  id: string,
  equipmentData: Partial<{
    name: string;
    type: "camera" | "lens" | "drone" | "gimbal" | "other";
  }>
) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(
    `/api/equipment/${id}`,
    equipmentData,
    {
      headers: {
        ...(apiKey && { "X-API-Key": apiKey }),
      },
    }
  );
  return response.data;
};

export const deleteEquipment = async (id: string) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.delete(`/api/equipment/${id}`, {
    headers: {
      ...(apiKey && { "X-API-Key": apiKey }),
    },
  });
  return response.data;
};

// Homepage Sections API
export const getHomepageSections = async () => {
  const response = await axiosInstance.get("/api/homepage-sections");
  return response.data;
};

export const createHomepageSection = async (
  sectionData: Record<string, unknown>
) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.post(
    "/api/homepage-sections",
    sectionData,
    {
      headers: {
        ...(apiKey && { "X-API-Key": apiKey }),
      },
    }
  );
  return response.data;
};

export const updateHomepageSection = async (
  id: string,
  sectionData: Record<string, unknown>
) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(
    `/api/homepage-sections/${id}`,
    sectionData,
    {
      headers: {
        ...(apiKey && { "X-API-Key": apiKey }),
      },
    }
  );
  return response.data;
};

export const getHomepageSectionById = async (id: string) => {
  const response = await axiosInstance.get(`/api/homepage-sections/${id}`);
  return response.data;
};

export const deleteHomepageSection = async (id: string) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.delete(`/api/homepage-sections/${id}`, {
    headers: {
      ...(apiKey && { "X-API-Key": apiKey }),
    },
  });
  return response.data;
};

// Upload API
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);

  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;

  const response = await axiosInstance.post("/api/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      ...(apiKey && { "X-API-Key": apiKey }),
    },
  });
  return response.data;
};

export const deleteUploadedImage = async (url: string, publicId?: string) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;

  const response = await axiosInstance.delete("/api/upload", {
    data: { url, publicId },
    headers: {
      ...(apiKey && { "X-API-Key": apiKey }),
    },
  });
  return response.data;
};

// Stats API
export const getDashboardStats = async () => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.get("/api/stats/dashboard", {
    headers: {
      ...(apiKey && { "X-API-Key": apiKey }),
    },
  });
  return response.data;
};
