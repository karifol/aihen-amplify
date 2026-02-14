import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Chat API: /api/chat/... → API Gateway
      {
        source: '/api/chat/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/:path*`,
      },
      // Coordinator API: /api/coordinator/... → API Gateway
      {
        source: '/api/coordinator/:path*',
        destination: `${process.env.NEXT_PUBLIC_COORDINATOR_API_URL}/:path*`,
      },
      // Items API: /api/items/:path* → API Gateway
      {
        source: '/api/items/:path*',
        destination: `${process.env.NEXT_PUBLIC_ITEMS_API_URL}/:path*`,
      },
    ]
  },
};

export default nextConfig;
