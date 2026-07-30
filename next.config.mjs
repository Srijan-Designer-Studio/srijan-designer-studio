/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fzhxybcrddmyklrdjgwz.supabase.co',
      },
    ],
  },
};

export default nextConfig;