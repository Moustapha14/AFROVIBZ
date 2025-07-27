/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['localhost', 'your-s3-bucket.s3.amazonaws.com'],
  },
  env: {
    CUSTOM_KEY: 'my-value',
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      };
    }
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
};

module.exports = nextConfig;
