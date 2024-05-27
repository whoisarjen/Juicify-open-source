/** @type {import("next").NextConfig} */

const nextTranslate = require('next-translate-plugin');

const isProduction = process.env.NODE_ENV === 'production'

const withPWA = require("next-pwa")({
    dest: 'public',
    disable: !isProduction,
    register: isProduction,
    skipWaiting: isProduction,
})

const nextConfig = {
    reactStrictMode: false, // react-beautiful-dnd is not working, when true
    env,
    images: {
        domains: [
            'localhost',
            'juicify.app',
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

module.exports = withPWA(nextConfig);
