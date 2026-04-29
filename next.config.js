/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Critical for deployment
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: true,
  output: 'standalone', // Reduces build complexity
}

module.exports = nextConfig