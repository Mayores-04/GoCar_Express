import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
        // Disable ESLint during build time
        ignoreDuringBuilds: true,
      },
};

export default nextConfig;
