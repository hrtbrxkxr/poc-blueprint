import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.*.com" },
      { protocol: "https", hostname: "*.cloudfront.net" },
    ],
  },
  env: {
    NEXT_PUBLIC_CONSUMER_ID: process.env.NEXT_PUBLIC_CONSUMER_ID ?? "consumer-a",
  },
};

export default nextConfig;
