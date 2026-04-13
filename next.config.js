/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ofbuiybymxkviplrbxls.supabase.co',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;
