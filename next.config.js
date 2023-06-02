/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        fusionFeedUrl: process.env.FUSION_FEED_URL || 'https://feed.fusion.tempus-ex.com',
    },
    reactStrictMode: true,
    output: 'standalone',
    compiler: {
        removeConsole: false,
      },
      productionBrowserSourceMaps: true,
};

module.exports = nextConfig;
