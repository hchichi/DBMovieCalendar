/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.doubanio.com',
        pathname: '/view/photo/**',
      },
    ],
    unoptimized: true,
  },
  output: 'standalone',
}

module.exports = nextConfig
