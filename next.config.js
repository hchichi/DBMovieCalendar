/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.doubanio.com',
        pathname: '/view/photo/**',
      },
      {
        protocol: 'https',
        hostname: 'img1.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img2.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img3.doubanio.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img9.doubanio.com',
        pathname: '/**',
      }
    ],
  },
  output: 'standalone',
}

module.exports = nextConfig
