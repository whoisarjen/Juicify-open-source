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
    reactStrictMode: true,
    env: {
        PRODUCT_DECIMAL_PLACES: 1,
        DEFAULT_NUMBER_OF_MEALS: 5,
        MAX_SUPPORTED_AGE_IN_DAYS: 7,
        NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH: 3,
        SERVER: isProduction ? 'https://server.juicify.app/graphql' : 'http://localhost:8000/graphql',
        INDEXEDDB: 'cache',
        APP_VERSION: new Date().toISOString(),
        isProduction,
    },
    // webpackDevMiddleware: config => {
    //     config.watchOptions = {
    //         poll: 2000,
    //         aggregateTimeout: 600,
    //         ignored: /node_modules/,
    //     }
    //     return config
    // },
    // @ts-ignore
    ...nextTranslate(),
}

module.exports = withPWA(nextConfig);
