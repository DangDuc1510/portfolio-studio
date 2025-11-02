import axios from 'axios';

// Use relative URL for internal API routes in Next.js fullstack
// In Next.js, we can use absolute URLs with the same origin during SSR
const baseURL = typeof window !== 'undefined' 
  ? '' // Client-side: use relative URL
  : process.env.NEXT_PUBLIC_API_BASE_URL || 
    (typeof process !== 'undefined' && process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : ''); // Server-side: use empty for same-origin or Vercel URL

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout for build
});

// Add response interceptor to handle build-time errors gracefully
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Log but don't fail build if connection refused
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
        console.warn('API connection unavailable during build, data will be fetched at runtime');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
