/** @type {import("next").NextConfig} */

const nextTranslate = require('next-translate-plugin');
const withSerwist = require("@serwist/next").default;

const isProduction = process.env.NODE_ENV === 'production'

const nextConfig = {
    reactStrictMode: false,
    turbopack: {},
    images: {
        remotePatterns: [
            { hostname: 'localhost' },
            { hostname: 'juicify.whoisarjen.com' },
            { hostname: 'images.unsplash.com' },
        ],
    },
    ...nextTranslate(),
    async redirects() {
        return [
            {
                source: '/sitemap.xml',
                destination: '/api/sitemap',
                permanent: true,
            },
        ]
    },
}

module.exports = isProduction
    ? withSerwist({
        swSrc: "src/sw.ts",
        swDest: "public/sw.js",
        disable: false,
    })(nextConfig)
    : nextConfig;
