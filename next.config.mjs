/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/assets/:path*',
        destination: 'https://fzhxybcrddmyklrdjgwz.supabase.co/storage/v1/object/public/:path*',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "randomuser.me",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "i.pinimg.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "images-pw.pixieset.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "www.image2url.com",
        port: '',
        pathname: '/**',
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;