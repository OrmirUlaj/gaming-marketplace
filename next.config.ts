// next.config.ts
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com', // your image host
        port: '',                         // no custom port
        pathname: '/**',                  // allow any path
      },
    ],
  },
}

export default nextConfig
