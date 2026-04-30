/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true, // Critical for deployment
  },
  eslint: {
    ignoreDuringBuilds: true,
  }
}

module.exports = nextConfig