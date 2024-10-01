/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["for-later.s3.eu-central-1.amazonaws.com"],
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    return config;
  },
};

export default nextConfig;
