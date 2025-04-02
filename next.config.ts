import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    authInterrupts: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**'
      },
      {
        protocol: 'http',
        hostname: '**'
      }
    ]
  },
  reactStrictMode: false,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    AUTH_SECRET: process.env.AUTH_SECRET
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
