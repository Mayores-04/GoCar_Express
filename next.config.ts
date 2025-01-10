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
    domains: ["localhost"], // Add your allowed image domains here
  },
  webpack: (config) => {
    // Custom Webpack configuration if needed
    return config;
  },
};

export default nextConfig;
