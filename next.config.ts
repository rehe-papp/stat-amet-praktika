import type { NextConfig } from "next";

const nextConfig: NextConfig = process.env.EXPORT_STATIC
  ? {
      output: 'export',
      trailingSlash: true,
      basePath: '/stat-amet-praktika',
    }
  : {
      /* config options here */
    };

export default nextConfig;
