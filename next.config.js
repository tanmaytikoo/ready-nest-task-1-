/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {},
  images: {
    localPatterns: [
      {
        pathname: '/uploads/**',
        search: '',
      },
    ],
  },
}

module.exports = nextConfig
