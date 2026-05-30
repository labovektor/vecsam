import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
