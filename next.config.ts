import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  reactStrictMode: false,
  env: {
    DATABASE_URL: process.env.DATABASE_URL,
  },
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
};

export default nextConfig;
