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
  // Add special handling for environment variables
  env: {
    // Ensure the app doesn't crash if KV variables are missing
    KV_REST_API_URL: process.env.KV_REST_API_URL || '',
    KV_REST_API_TOKEN: process.env.KV_REST_API_TOKEN || '',
  }
}

module.exports = nextConfig
