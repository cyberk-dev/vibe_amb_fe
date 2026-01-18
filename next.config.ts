import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fix for Aptos SDK's got/keyv dependency issues with Next.js
  serverExternalPackages: ["keyv", "cacheable-request"],

  // Turbopack configuration (used by Vercel)
  turbopack: {
    resolveAlias: {
      // Alias Node.js-only modules to prevent bundling errors
      fs: { browser: "./node_modules/next/dist/compiled/empty-modules/fs.js" },
      net: { browser: "./node_modules/next/dist/compiled/empty-modules/net.js" },
      tls: { browser: "./node_modules/next/dist/compiled/empty-modules/tls.js" },
      dns: { browser: "./node_modules/next/dist/compiled/empty-modules/dns.js" },
      child_process: { browser: "./node_modules/next/dist/compiled/empty-modules/child_process.js" },
      http2: { browser: "./node_modules/next/dist/compiled/empty-modules/http2.js" },
    },
  },

  // Webpack configuration (used locally)
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
