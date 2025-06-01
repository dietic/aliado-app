import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreDevErrors: true,
  },
  // webpack: (config) => {
  //   config.resolve.alias = {
  //     ...(config.resolve.alias || {}),
  //     '@': path.resolve(__dirname, 'src'),
  //   }
  //   return config
  // },
  // turbopack: {},
};

export default nextConfig;
