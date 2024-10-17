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
  },
}

module.exports = nextConfig
