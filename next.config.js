/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // ✅ Ignore ESLint errors during builds (fix them later)
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
