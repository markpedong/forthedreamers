import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.resolve.fallback = {
        // fs: false,
      //   tls: false,
      //   net: false,
      //   child_process: false,
      //   nock: false,
      //   "mock-aws-s3": false,
      //   "aws-sdk": false
      }
    }
    return config;
  }
};

export default nextConfig;
