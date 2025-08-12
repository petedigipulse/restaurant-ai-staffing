import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable static optimization to prevent prerendering issues
  trailingSlash: false,
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  // Force all pages to be dynamic
  experimental: {
    // Disable static generation
    staticPageGenerationTimeout: 0,
  },
};

export default nextConfig;
