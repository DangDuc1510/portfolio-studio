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
export const getCustomers = async () => {
  const response = await axiosInstance.get('/customers');
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

export const deleteCustomerById = async (id: string) => {
  const response = await axiosInstance.delete(`/customers/${id}`);
  return response.data;
};

// Products API
export const getProducts = async () => {
  const response = await axiosInstance.get('/products');
  return response.data;
};

export const getProductById = async (id: string) => {
  const response = await axiosInstance.get(`/products/${id}`);
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
  const response = await axiosInstance.patch(`/homepage-sections/${id}`, sectionData);
  return response.data;
};
