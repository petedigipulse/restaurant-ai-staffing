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
  generateStaticParams: async () => {
    return [];
  },
};

export default nextConfig;
