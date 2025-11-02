import axios from 'axios';

// Use relative URL for internal API routes in Next.js fullstack
const baseURL = typeof window !== 'undefined' 
  ? '' // Client-side: use relative URL
  : process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'; // Server-side: use full URL if needed

const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
