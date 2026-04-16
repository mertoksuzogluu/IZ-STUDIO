/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['iyzipay'],
  },
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Upgrade-Insecure-Requests',
            value: '1',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig


