import { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during build time
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Ignore TypeScript build errors during production builds
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['res.cloudinary.com'], // Add Cloudinary domain here
  },
  webpack: (config) => {
    // Custom Webpack configuration if needed
    return config;
  },
};

export default nextConfig;
