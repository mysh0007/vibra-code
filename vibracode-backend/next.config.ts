import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  devIndicators: false,
  allowedDevOrigins: ["https://www.vibracodeapp.com", "https://vibracodeapp.com"],
  experimental: {
    serverActions: {
      bodySizeLimit: '50mb',
    },
  },
  // حل مشكلة وحدات Node في الـ Middleware والـ Edge
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
      };
    }
    return config;
  },
};

export default nextConfig;
