import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:6090/api/:path*",
      },
    ];
  },
  allowedDevOrigins: ['oscar-macbook-dev-3000.quntem.co.uk', 'oscar-macbook-dev-3001.quntem.co.uk'],
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
