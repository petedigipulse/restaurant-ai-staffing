import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Disable all static optimization
  trailingSlash: false,
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  // Disable static generation completely
  generateStaticParams: async () => {
    return [];
  },
};

export default nextConfig;
