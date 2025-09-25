import type { NextConfig } from 'next'

const config: NextConfig = {
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
  // Disable caching in development to prevent stale component issues
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value:
              process.env.NODE_ENV === 'development'
                ? 'no-cache, no-store, must-revalidate'
                : 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

// Bundle analyzer configuration
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

export default withBundleAnalyzer(config)
