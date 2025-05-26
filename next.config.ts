import type { NextConfig } from 'next'
import path from 'path'

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    }
    return config
  },
  // turbopack: {},
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: '1mb', // optional
      allowedOrigins: ['*'], // optional
    },
  },
}

export default withBundleAnalyzer(nextConfig)
