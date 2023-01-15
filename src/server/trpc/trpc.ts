import { redis } from "@/utils/redis.utils";
import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { getClientIp } from 'request-ip'
import { type Context } from "./context";
import { SPAM_PROTECTION_LIMIT_FOR_CALLS } from '@/utils/trpc.utils'
import { Histogram, register } from "prom-client"

register.clear();

const restResponseTimeHistogram = new Histogram({
    name: 'rest_response_time_duration_milliseconds',
    help: 'Rest response time of API calls in milliseconds',
    labelNames: ['ip', 'path', 'type', 'status'],
})

const dbResponseTimeHistogram = new Histogram({
    name: 'db_response_time_duration_milliseconds',
    help: 'DB response time of API calls in milliseconds',
    labelNames: ['ip', 'path', 'type', 'status'],
})

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape;
    },
});

export const router = t.router;

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

const spamProtectionMiddleware = t.middleware(async ({ ctx: { req }, next }) => {
    const userIp = getClientIp(req)

    if (userIp) {
        const currentStatusOfIp = await redis.get(userIp)
        const updatedStatusOfIp = Number(currentStatusOfIp || 0) + 1

        if (updatedStatusOfIp >= SPAM_PROTECTION_LIMIT_FOR_CALLS.NUMBER_OF_CALLS) {
            await redis.set(
                userIp,
                SPAM_PROTECTION_LIMIT_FOR_CALLS.NUMBER_OF_CALLS,
                { EX: SPAM_PROTECTION_LIMIT_FOR_CALLS.BAN_DURATION },
            )

            throw new TRPCError({ code: "TOO_MANY_REQUESTS" });
        }

        await redis.set(
            userIp,
            updatedStatusOfIp,
            { EX: SPAM_PROTECTION_LIMIT_FOR_CALLS.DURATION },
        )
    }

    return await next();
});

const prometheusRestResponseMiddleware = t.middleware(async ({ path, type, ctx: { req }, next }) => {
    const ip = getClientIp(req) || ''
    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;

    restResponseTimeHistogram.observe({
        ip,
        path,
        type,
        status: result.ok ? 'OK' : 'Non-OK',
    }, durationMs)

    return result;
});

const prometheusDBResponseMiddleware = t.middleware(async ({ path, type, ctx: { req }, next }) => {
    const ip = getClientIp(req) || ''
    const start = Date.now();
    const result = await next();
    const durationMs = Date.now() - start;

    dbResponseTimeHistogram.observe({
        ip,
        path,
        type,
        status: result.ok ? 'OK' : 'Non-OK',
    }, durationMs)

    return result;
});

export const publicProcedure = t
    .procedure
    .use(prometheusRestResponseMiddleware)
    .use(spamProtectionMiddleware)
    .use(prometheusDBResponseMiddleware)

export const protectedProcedure = t
    .procedure
    .use(prometheusRestResponseMiddleware)
    .use(spamProtectionMiddleware)
    .use(prometheusDBResponseMiddleware)
    .use(isAuthed)
