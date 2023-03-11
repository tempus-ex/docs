/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        fusionFeedUrl: process.env.FUSION_FEED_URL || 'https://feed.fusion.tempus-ex.com',
    },
    reactStrictMode: true,
};

module.exports = nextConfig;
