import type { NextConfig } from "next";
import withNextIntl from 'next-intl/plugin';

const withIntl = withNextIntl(
  // This is the default location of the configuration file
  './src/i18n.ts'
);

const nextConfig: NextConfig = {
  /* config options here */
};

export default withIntl(nextConfig);
