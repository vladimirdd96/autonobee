/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: false,
  images: {
    domains: ['images.unsplash.com'],
    unoptimized: true,
  },
  experimental: {
    optimizeCss: true,
  },
  webpack: (config) => {
    // Disable minification completely
    config.optimization.minimize = false;
    return config;
  },
}

module.exports = nextConfig
