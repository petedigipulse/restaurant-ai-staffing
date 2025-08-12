import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Completely disable static generation
  output: 'export',
  // Disable all static optimization
  trailingSlash: false,
  // Force dynamic rendering everywhere
  dynamicParams: true,
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  // Disable static generation
  generateStaticParams: async () => {
    return [];
  },
};

export default nextConfig;
