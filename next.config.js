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
        APP_VERSION: new Date().toISOString(),
        NEXTAUTH_SECRET: "w@yYo%aJ;]#FXj{;j?@d`#48NHrC'eT]5DyLQD@Bv0LWkivPE)~X@sGB,v;ev/)",
        DISCORD_CLIENT_ID: "1056593142381547630",
        DISCORD_CLIENT_SECRET: "xO5xLnwaxH9y2e3O4egNNWfp4R0273fN",
        GOOGLE_CLIENT_ID: "658821628417-vpspbk50qh0qb7cbg6d4h6hd2e9up3h2.apps.googleusercontent.com",
        GOOGLE_CLIENT_SECRET: "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",
        isProduction,
    },
    ...nextTranslate(),
}

module.exports = withPWA(nextConfig);
