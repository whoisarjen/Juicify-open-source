/** @type {import("next").NextConfig} */

const nextTranslate = require("next-translate");

const isProduction = process.env.NODE_ENV === 'production'

const withPWA = require("next-pwa")({
    dest: 'public',
    disable: !isProduction,
    register: isProduction,
    skipWaiting: isProduction,
})

const nextConfig = {
    reactStrictMode: false, // react-beautiful-dnd is not working, when true
    env: {
        NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH: 3,
        NEXT_PUBLIC_DEFAULT_NUMBER_OF_MEALS: 5,
        SERVER: isProduction ? 'https://server.juicify.app/graphql' : 'http://localhost:8000/graphql',
        APP_VERSION: new Date().toISOString(),
        isProduction,
    },
    ...nextTranslate(),
}

module.exports = withPWA(nextConfig);
