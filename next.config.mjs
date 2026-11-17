import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  ...(process.env.NEXT_STANDALONE === 'true' ? { output: 'standalone' } : {}),
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gibs.earthdata.nasa.gov'
      },
      {
        protocol: 'https',
        hostname: 'nsidc.org'
      }
    ]
  }
};

export default withNextIntl(nextConfig);
