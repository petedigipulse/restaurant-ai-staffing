import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Simple configuration for Next.js 14
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
