import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Force all pages to be dynamic to prevent prerendering
  generateStaticParams: async () => {
    return [];
  },
  // Disable static optimization for problematic pages
  trailingSlash: false,
  // Force dynamic rendering
  dynamicParams: true,
  // Disable static generation
  output: 'standalone',
};

export default nextConfig;
