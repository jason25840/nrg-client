/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "media.istockphoto.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "www.gravatar.com", // ✅ Fix for gravatar issue
      },
      {
        protocol: "https",
        hostname: "www.shutterstock.com",
      },
    ],
  },
  reactStrictMode: true, // ✅ Ensures best practices
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5001/api/:path*",
      },
    ];
  },
};

export default nextConfig;