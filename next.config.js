/** @type {import('next').NextConfig} */

const path = require('path');

const nextConfig = {
  publicRuntimeConfig: {
    fusionFeedUrl:
      process.env.FUSION_FEED_URL || 'https://feed.fusion.tempus-ex.com',
  },
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    '.*',
  ],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};

module.exports = nextConfig;
