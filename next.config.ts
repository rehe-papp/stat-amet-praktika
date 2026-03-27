import type { NextConfig } from "next";

const nextConfig: NextConfig = process.env.EXPORT_STATIC === 'true'
  ? {
      output: 'export',
      trailingSlash: true,
      basePath: '/stat-amet-praktika',
      images: {
        unoptimized: true, 
      },
    }
  : {
      /* config options here */
    };

export default nextConfig;
