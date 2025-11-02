import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Disable turbopack in production build for Vercel compatibility
  // Turbopack can be enabled in dev mode via package.json scripts
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
