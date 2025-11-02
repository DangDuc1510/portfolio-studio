import axiosInstance from '@/lib/axiosInstance';

// Albums API
export const getAlbums = async () => {
  const response = await axiosInstance.get('/albums');
  return response.data;
};

export const getAlbumById = async (id: string) => {
  const response = await axiosInstance.get(`/albums/${id}`);
  return response.data;
};

export const createAlbum = async (albumData: any) => {
  const response = await axiosInstance.post('/albums', albumData);
  return response.data;
};

export const updateAlbum = async (id: string, albumData: any) => {
  const response = await axiosInstance.patch(`/albums/${id}`, albumData);
  return response.data;
};

export const deleteAlbum = async (id: string) => {
  const response = await axiosInstance.delete(`/albums/${id}`);
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
  const url = queryString ? `/customers?${queryString}` : '/customers';
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.get(url, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const getCustomerById = async (id: string) => {
  const response = await axiosInstance.get(`/customers/${id}`);
  return response.data;
};

export const createCustomer = async (customerData: any) => {
  const response = await axiosInstance.post('/customers', customerData);
  return response.data;
};

export const updateCustomerById = async (id: string, data: any) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(`/customers/${id}`, data, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const deleteCustomerById = async (id: string) => {
  const response = await axiosInstance.delete(`/customers/${id}`);
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
  const url = queryString ? `/products?${queryString}` : '/products';
  const response = await axiosInstance.get(url);
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
  return response.data;
};

export const getProductCategories = async () => {
  const response = await axiosInstance.get('/products/categories');
  return response.data;
};

export const createProduct = async (productData: any) => {
  const response = await axiosInstance.post('/products', productData);
  return response.data;
};

export const updateProductById = async (id: string, productData: any) => {
  const response = await axiosInstance.patch(`/products/${id}`, productData);
  return response.data;
};

export const deleteProductById = async (id: string) => {
  const response = await axiosInstance.delete(`/products/${id}`);
  return response.data;
};

// Homepage Sections API
export const getHomepageSections = async () => {
  const response = await axiosInstance.get('/homepage-sections');
  return response.data;
};

export const updateHomepageSection = async (id: string, sectionData: any) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(`/homepage-sections/${id}`, sectionData, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const getHomepageSectionById = async (id: string) => {
  const response = await axiosInstance.get(`/homepage-sections/${id}`);
  return response.data;
};

// Upload API
export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  
  const response = await axiosInstance.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const deleteUploadedImage = async (url: string, publicId?: string) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  
  const response = await axiosInstance.delete('/upload', {
    data: { url, publicId },
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

// Categories API
export const getCategories = async () => {
  const response = await axiosInstance.get('/categories');
  return response.data;
};

export const getCategoryById = async (id: string) => {
  const response = await axiosInstance.get(`/categories/${id}`);
  return response.data;
};

export const createCategory = async (categoryData: any) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.post('/categories', categoryData, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const updateCategory = async (id: string, categoryData: any) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.patch(`/categories/${id}`, categoryData, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.delete(`/categories/${id}`, {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};

// Stats API
export const getDashboardStats = async () => {
  const apiKey = process.env.NEXT_PUBLIC_CMS_API_KEY;
  const response = await axiosInstance.get('/stats/dashboard', {
    headers: {
      ...(apiKey && { 'X-API-Key': apiKey }),
    },
  });
  return response.data;
};
