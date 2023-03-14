/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        fusionFeedUrl: process.env.FUSION_FEED_URL || 'https://feed.fusion.tempus-ex.com',
    },
    reactStrictMode: true,
    output: 'standalone',
};

module.exports = nextConfig;
