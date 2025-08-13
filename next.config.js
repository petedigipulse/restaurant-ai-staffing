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
    // Add any experimental features here if needed
  },
};

module.exports = nextConfig;
