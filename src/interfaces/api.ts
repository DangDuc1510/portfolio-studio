// API Route Params Interface
export interface RouteParams {
  params: Promise<{ id: string }>;
}

// API Response Types
export interface ApiErrorResponse {
  error: string;
  message?: string;
  details?: string;
  hint?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UploadFileResponse {
  success: boolean;
  message: string;
  file: {
    publicId: string;
    url: string;
    originalName: string;
    mimetype: string;
    size: number;
    width?: number;
    height?: number;
    format?: string;
  };
}

export interface DeleteFileResponse {
  success: boolean;
  message: string;
  result: string;
}

export interface DashboardStatsResponse {
  totals: {
    albums: number;
    products: number;
    homepageSections: number;
  };
  productsOverTime: Array<{
    date: string;
    count: number;
  }>;
  albumsWithProductCount: Array<{
    name: string;
    productCount: number;
  }>;
}
