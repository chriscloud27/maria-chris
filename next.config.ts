import type { NextConfig } from "next";
import withNextIntl from 'next-intl/plugin';

const withIntl = withNextIntl(
  // This is the default location of the configuration file
  './src/i18n.ts'
);

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
      },
    ],
  },
};

export default withIntl(nextConfig);
