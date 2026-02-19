/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  images: {
    // Enable optimized image delivery
    formats: ['image/avif', 'image/webp'],
    // Device sizes and image sizes for responsive images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Cache optimized images for 1 year (31536000 seconds)
    minimumCacheTTL: 31536000,
    // Allow unoptimized images during development
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Enable compression for better performance
  compress: true,
};

export default nextConfig;
