import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Completely disable static generation
  output: 'export',
  // Disable all static optimization
  trailingSlash: false,
  // Disable image optimization
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
