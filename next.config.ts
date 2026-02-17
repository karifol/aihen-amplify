import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'booth.pximg.net',
      },
    ],
  },
};

export default nextConfig;
