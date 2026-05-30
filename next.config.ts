import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  serverExternalPackages: ["ioredis", "pg", "@prisma/adapter-pg"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        pathname: "/storage/v1/**",
        hostname: "*.supabase.co",
      },
    ],
  },
};

export default nextConfig;
