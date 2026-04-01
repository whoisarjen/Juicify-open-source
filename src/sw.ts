import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { CacheFirst, NetworkFirst, Serwist, ExpirationPlugin } from "serwist";

declare global {
    interface WorkerGlobalScope extends SerwistGlobalConfig {
        __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
    }
}

declare const self: WorkerGlobalScope & typeof globalThis;

const serwist = new Serwist({
    precacheEntries: self.__SW_MANIFEST,
    skipWaiting: true,
    clientsClaim: true,
    navigationPreload: true,
    runtimeCaching: [
        // tRPC API calls — network first, fall back to cache for offline
        {
            matcher: /\/api\/trpc\/.*/i,
            handler: new NetworkFirst({
                cacheName: 'trpc-api',
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 64,
                        maxAgeSeconds: 60 * 60, // 1 hour
                    }),
                ],
                networkTimeoutSeconds: 10,
            }),
        },
        // Fonts — cache first, long TTL
        {
            matcher: /\/fonts\/.*/i,
            handler: new CacheFirst({
                cacheName: 'fonts',
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 16,
                        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
                    }),
                ],
            }),
        },
        // Static assets — cache first
        {
            matcher: /\/_next\/static\/.*/i,
            handler: new CacheFirst({
                cacheName: 'next-static',
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 128,
                        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
                    }),
                ],
            }),
        },
        // Images — cache first
        {
            matcher: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
            handler: new CacheFirst({
                cacheName: 'images',
                plugins: [
                    new ExpirationPlugin({
                        maxEntries: 64,
                        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
                    }),
                ],
            }),
        },
        // Everything else — default strategies
        ...defaultCache,
    ],
    fallbacks: {
        entries: [
            {
                url: "/_offline",
                matcher({ request }) {
                    return request.destination === "document";
                },
            },
        ],
    },
});

serwist.addEventListeners();
