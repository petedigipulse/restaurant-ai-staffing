/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // Simple configuration for Next.js 14
  trailingSlash: false,
  images: {
    unoptimized: true,
  },
  // Prevent static generation issues
  experimental: {
    // Disable static generation for problematic routes
    staticPageGenerationTimeout: 0,
  },
};

module.exports = nextConfig;
