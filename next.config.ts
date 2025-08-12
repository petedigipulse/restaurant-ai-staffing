import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    // Disable static generation to prevent prerendering issues
    staticPageGenerationTimeout: 0,
  },
  // Force all pages to be dynamic to prevent prerendering
  generateStaticParams: async () => {
    return [];
  },
  // Disable static optimization for problematic pages
  trailingSlash: false,
  // Force dynamic rendering
  dynamicParams: true,
};

export default nextConfig;
