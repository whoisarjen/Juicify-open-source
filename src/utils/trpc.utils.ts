import { httpBatchLink, loggerLink } from "@trpc/client";
import { createTRPCNext } from "@trpc/next";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { get, set, del } from "idb-keyval";
import superjson from "superjson";

import { type AppRouter } from "@/server/trpc/router/_app";

const getBaseUrl = () => {
    if (typeof window !== "undefined") return ""; // browser should use relative url
    if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
    return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

let _queryClient: QueryClient | undefined

function getQueryClient() {
    if (!_queryClient) {
        _queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    staleTime: 1000 * 60 * 5, // 5 min — data stays fresh, no refetch on navigation
                    gcTime: 1000 * 60 * 60 * 24, // 24h — keep in memory for persistence
                    refetchOnWindowFocus: false,
                    retryOnMount: false,
                    retry: false,
                },
                mutations: {
                    retry: false,
                },
            },
        })

        if (typeof window !== 'undefined') {
            persistQueryClient({
                queryClient: _queryClient,
                persister: {
                    persistClient: (client) => set('JUICIFY_CACHE', client),
                    restoreClient: () => get('JUICIFY_CACHE'),
                    removeClient: () => del('JUICIFY_CACHE'),
                },
                maxAge: 1000 * 60 * 60 * 24, // 24h
            })
        }
    }
    return _queryClient
}

export const trpc = createTRPCNext<AppRouter>({
    transformer: superjson,
    config() {
        return {
            queryClient: getQueryClient(),
            links: [
                loggerLink({
                    enabled: (opts) =>
                        process.env.NODE_ENV === "development" ||
                        (opts.direction === "down" && opts.result instanceof Error),
                }),
                httpBatchLink({
                    url: `${getBaseUrl()}/api/trpc`,
                    transformer: superjson,
                }),
            ],
        };
    },
    ssr: false,
});

/**
 * Inference helper for inputs
 * @example type HelloInput = RouterInputs['example']['hello']
 **/
export type RouterInputs = inferRouterInputs<AppRouter>;
/**
 * Inference helper for outputs
 * @example type HelloOutput = RouterOutputs['example']['hello']
 **/
export type RouterOutputs = inferRouterOutputs<AppRouter>;
