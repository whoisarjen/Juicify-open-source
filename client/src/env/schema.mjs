// @ts-check
import { z } from "zod";

/**
 * Specify your server-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 */
export const serverSchema = z.object({
    REDIS_URL: z.string(),
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET: z.string(),
    NEXTAUTH_URL: z.string().url(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    NEXT_PUBLIC_API_TOKEN: z.string(),
    NEXT_PUBLIC_STRAPI_URL: z.string(),
});

/**
 * Specify your client-side environment variables schema here.
 * This way you can ensure the app isn't built with invalid env vars.
 * To expose them to the client, prefix them with `NEXT_PUBLIC_`.
 */
export const clientSchema = z.object({
    NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH: z.number(),
    NEXT_PUBLIC_DEFAULT_NUMBER_OF_MEALS: z.number(),
    NEXT_PUBLIC_NODE_ENV: z.enum(["development", "test", "production"]),
    NEXT_PUBLIC_API_TOKEN: z.string(),
    NEXT_PUBLIC_STRAPI_URL: z.string(),
    NEXT_PUBLIC_NEXTAUTH_URL: z.string(),
});

/**
 * You can't destruct `process.env` as a regular object, so you have to do
 * it manually here. This is because Next.js evaluates this at build time,
 * and only used environment variables are included in the build.
 * @type {{ [k in keyof z.infer<typeof clientSchema>]: z.infer<typeof clientSchema>[k] | undefined }}
 */
export const clientEnv = {
    NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH: Number(process.env.NEXT_PUBLIC_SEARCH_MIN_NAME_LENGTH),
    NEXT_PUBLIC_DEFAULT_NUMBER_OF_MEALS: Number(process.env.NEXT_PUBLIC_DEFAULT_NUMBER_OF_MEALS),
    NEXT_PUBLIC_NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_API_TOKEN: process.env.NEXT_PUBLIC_API_TOKEN,
    NEXT_PUBLIC_STRAPI_URL: process.env.NEXT_PUBLIC_STRAPI_URL,
    NEXT_PUBLIC_NEXTAUTH_URL: process.env.NEXT_PUBLIC_NEXTAUTH_URL,
};
