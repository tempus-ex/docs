/** @type {import('next').NextConfig} */
const nextConfig = {
    publicRuntimeConfig: {
        fusionFeedUrl: process.env.FUSION_FEED_URL || 'https://feed.fusion.tempus-ex.com',
    },
    reactStrictMode: true,
    output: 'standalone',
    // See: https://github.com/swagger-api/swagger-ui/issues/8245
    transpilePackages: ['react-syntax-highlighter', 'swagger-client', 'swagger-ui-react'],
};

module.exports = nextConfig;
