/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    MONGODB_URI: "",
    GOOGLE_CLIENT: "",
    GOOGLE_SECRET: "",
    NEXTAUTH_SECRET: "",
    NEXT_PUBLIC_AWS_BUCKET_NAME: "",
    NEXT_PUBLIC_AWS_REGION: "",
    AWS_ACCESS_KEY_ID: "",
    AWS_SECRET_ACCESS_KEY: "",
  },
  images: {
    remotePatterns: [
      {
        protocol: "",
        hostname: "",
      },
    ],
  },
};

module.exports = nextConfig;
