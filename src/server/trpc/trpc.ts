import { redis } from "@/utils/redis.utils";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getClientIp } from 'request-ip'
import { type Context } from "./context";

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

export const router = t.router;

/**
 * Reusable middleware to ensure
 * users are logged in
 */
const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    return next({
        ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
        },
    });
});

const SPAM_PROTECTION_IP_TO_SKIP = [null, '127.0.0.1', '::1', '::ffff:127.0.0.1']
const SPAM_PROTECTION_LIMIT_FOR_CALLS = {
    NUMBER_OF_CALLS: 200,
    DURATION: 300,
}

const spamProtectionMiddleware = t.middleware(async ({ path, type, ctx: { req }, next }) => {
    const userIp = getClientIp(req)

    if (userIp && !SPAM_PROTECTION_IP_TO_SKIP.some(ip => ip === userIp)) {
        const currentStatusOfIp = await redis.get(userIp)

        const updatedStatusOfIp = Number(currentStatusOfIp || 0) + 1

        if (updatedStatusOfIp >= SPAM_PROTECTION_LIMIT_FOR_CALLS.NUMBER_OF_CALLS) {
            await redis.set(
                userIp,
                updatedStatusOfIp,
                { EX: SPAM_PROTECTION_LIMIT_FOR_CALLS.NUMBER_OF_CALLS },
            )

            throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
        }

        await redis.set(
            userIp,
            updatedStatusOfIp,
            { EX: SPAM_PROTECTION_LIMIT_FOR_CALLS.DURATION },
        )
    }

    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;

    console.log(`${result.ok ? 'OK' : 'Non-OK'} request timing:`, {
        path,
        type,
        durationMs,
        userIp,
        redis: await redis.get(userIp || ''),
    })
    return result;
});

/**
 * Unprotected procedure
 **/
export const publicProcedure = t
    .procedure
    .use(spamProtectionMiddleware)

/**
 * Protected procedure
 **/
export const protectedProcedure = t
    .procedure
    .use(spamProtectionMiddleware)
    .use(isAuthed);
