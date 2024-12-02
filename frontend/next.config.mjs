/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/playground',
  output: 'standalone',
  experimental: {
    optimizePackageImports: ['@mantine/core', '@mantine/hooks']
  }
}

export default nextConfig
