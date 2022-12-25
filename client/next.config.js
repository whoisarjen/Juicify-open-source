const nextTranslate = require("next-translate");

const withPWA = require("next-pwa")({
    dest: 'public'
})

const isDev = process.env.NODE_ENV === 'development'

module.exports = withPWA({
    reactStrictMode: true,
    pwa: {
        dest: "public",
        register: true,
        skipWaiting: true,
        disable: isDev,
    },
    env: {
        PRODUCT_DECIMAL_PLACES: 1,
        DEFAULT_NUMBER_OF_MEALS: 5,
        MAX_SUPPORTED_AGE_IN_DAYS: 7,
        SEARCH_MIN_NAME_LENGTH: 3,
        SERVER: isDev ? 'http://localhost:8000/graphql' : 'https://server.juicify.app/graphql',
        INDEXEDDB: 'cache',
        APP_VERSION: new Date().toISOString(),
    },
    webpackDevMiddleware: config => {
        config.watchOptions = {
            poll: 1000,
            aggregateTimeout: 300,
        }
        return config
    },
    ...nextTranslate(),
});
