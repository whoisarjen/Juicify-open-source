/** @type {import("next").NextConfig} */

const nextTranslate = require('next-translate-plugin');

const isProduction = process.env.NODE_ENV === 'production'

const withPWA = require("next-pwa")({
    dest: 'public',
    disable: !isProduction,
    register: isProduction,
    skipWaiting: isProduction,
})

const env = {
    NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH: 3,
    NEXT_PUBLIC_DEFAULT_NUMBER_OF_MEALS: 5,
    APP_VERSION: new Date().toISOString(),
    isProduction,
}

const nextConfig = {
    reactStrictMode: false, // react-beautiful-dnd is not working, when true
    env,
    images: {
        domains: [
            'strapi.juicify.app',
            'localhost',
            'localhost:1337',
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
