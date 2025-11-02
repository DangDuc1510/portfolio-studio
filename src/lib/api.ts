import axiosInstance from '@/lib/axiosInstance';

// Albums API
export const getAlbums = async () => {
  const response = await axiosInstance.get('/api/albums');
  return response.data;
};

export const getAlbumById = async (id: string) => {
  const response = await axiosInstance.get(`/api/albums/${id}`);
  return response.data;
};

export const createAlbum = async (albumData: Record<string, unknown>) => {
  const response = await axiosInstance.post('/api/albums', albumData);
  return response.data;
};

export const updateAlbum = async (id: string, albumData: Record<string, unknown>) => {
  const response = await axiosInstance.patch(`/api/albums/${id}`, albumData);
  return response.data;
};

export const deleteAlbum = async (id: string) => {
  const response = await axiosInstance.delete(`/api/albums/${id}`);
  return response.data;
};

// Customers API
export const getCustomers = async (filters?: {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
  
  const queryString = params.toString();
  const url = queryString ? `/api/customers?${queryString}` : '/api/customers';
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.get(url, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const getCustomerById = async (id: string) => {
  const response = await axiosInstance.get(`/api/customers/${id}`);
  return response.data;
};

export const createCustomer = async (customerData: Record<string, unknown>) => {
  const response = await axiosInstance.post('/api/customers', customerData);
  return response.data;
};

export const updateCustomerById = async (id: string, data: Record<string, unknown>) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(`/api/customers/${id}`, data, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const deleteCustomerById = async (id: string) => {
  const response = await axiosInstance.delete(`/api/customers/${id}`);
  return response.data;
};

// Products API
export const getProducts = async (filters?: {
  search?: string;
  category?: string;
  albumId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.albumId) params.append('albumId', filters.albumId);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.sortOrder) params.append('sortOrder', filters.sortOrder);
  
  const queryString = params.toString();
  const url = queryString ? `/api/products?${queryString}` : '/api/products';
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/api/products/${id}`);
  return response.data;
};

export const getProductCategories = async () => {
  const response = await axiosInstance.get('/api/products/categories');
  return response.data;
};

export const createProduct = async (productData: Record<string, unknown>) => {
  const response = await axiosInstance.post('/api/products', productData);
  return response.data;
};

export const updateProductById = async (id: string, productData: Record<string, unknown>) => {
  const response = await axiosInstance.patch(`/api/products/${id}`, productData);
  return response.data;
};

export const deleteProductById = async (id: string) => {
  const response = await axiosInstance.delete(`/api/products/${id}`);
  return response.data;
};

// Homepage Sections API
export const getHomepageSections = async () => {
  const response = await axiosInstance.get('/api/homepage-sections');
  return response.data;
};

export const updateHomepageSection = async (id: string, sectionData: Record<string, unknown>) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(`/api/homepage-sections/${id}`, sectionData, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const getHomepageSectionById = async (id: string) => {
  const response = await axiosInstance.get(`/api/homepage-sections/${id}`);
  return response.data;
};

// Upload API
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  
  const response = await axiosInstance.post('/api/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const deleteUploadedImage = async (url: string, publicId?: string) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  
  const response = await axiosInstance.delete('/api/upload', {
    data: { url, publicId },
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

// Categories API
export const getCategories = async () => {
  const response = await axiosInstance.get('/api/categories');
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await axiosInstance.get(`/api/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData: Record<string, unknown>) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.post('/api/categories', categoryData, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const updateCategory = async (id: string, categoryData: Record<string, unknown>) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(`/api/categories/${id}`, categoryData, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.delete(`/api/categories/${id}`, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

// Stats API
export const getDashboardStats = async () => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.get('/api/stats/dashboard', {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};
