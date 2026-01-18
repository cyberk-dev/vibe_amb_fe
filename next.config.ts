import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for Aptos SDK's got/keyv dependency issues with Next.js
  serverExternalPackages: ["keyv", "cacheable-request"],

  webpack: (config, { isServer }) => {
    // Handle Node.js-only modules in client bundle
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        dns: false,
        child_process: false,
        http2: false,
      };
    }

    return config;
  },
};

export default nextConfig;
