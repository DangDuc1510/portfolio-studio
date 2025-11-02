import axios from 'axios';

// Determine baseURL for API calls
// Client-side: use relative URL
// Server-side: use absolute URL with protocol and host
const getBaseURL = (): string => {
  // Client-side: use relative URL
  if (typeof window !== 'undefined') {
    return '';
  }

  // Server-side: construct absolute URL
  // Priority: NEXT_PUBLIC_API_BASE_URL > VERCEL_URL > localhost
  
  // Check for explicit API base URL
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }

  // Vercel deployment
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Production mode but not on Vercel: try to use same origin
  // In Next.js, during SSR in production, we can use the request host
  // For now, fallback to localhost with detected port
  const port = process.env.PORT || process.env.NEXT_PUBLIC_PORT || '4000';
  
  // If running in production mode locally, use http (not https)
  // On actual production server, this should be set via NEXT_PUBLIC_API_BASE_URL
  if (process.env.NODE_ENV === 'production') {
    // Try to detect if we're on a production server
    // If PORT is not default, might be on a server
    const protocol = 'http';
    const baseURL = `${protocol}://localhost:${port}`;
    console.log('[axiosInstance] Using baseURL:', baseURL);
    return baseURL;
  }

  // Development: use http://localhost:PORT
  const baseURL = `http://localhost:${port}`;
  console.log('[axiosInstance] Using baseURL:', baseURL);
  return baseURL;
};

const axiosInstance = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Add request interceptor for debugging
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
      console.log('[axiosInstance] Request:', config.method?.toUpperCase(), config.url);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle build-time errors gracefully
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Enhanced error logging
    console.error('[axiosInstance] Error:', {
      message: error.message,
      code: error.code,
      url: error.config?.url,
      baseURL: error.config?.baseURL,
      method: error.config?.method,
    });
    
    // Log but don't fail build if connection refused
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ERR_INVALID_URL') {
      if (typeof process !== 'undefined') {
        console.warn('[axiosInstance] API connection error, check baseURL configuration');
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
