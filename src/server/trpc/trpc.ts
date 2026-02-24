import { initTRPC, TRPCError } from '@trpc/server'
import { Prisma } from '@prisma/client'
import superjson from 'superjson'
import { type Context } from './context'

const t = initTRPC.context<Context>().create({
    transformer: superjson,
    errorFormatter({ shape }) {
        return shape
    },
})

export const router = t.router

const errorHandlingMiddleware = t.middleware(async ({ next }) => {
    try {
        return await next()
    } catch (error) {
        if (error instanceof TRPCError) {
            throw error
        }
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2025') {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Record not found',
                })
            }
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Database error',
            })
        }
        throw new TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: 'An unexpected error occurred',
        })
    }
})

const isAuthed = t.middleware(({ ctx, next }) => {
    if (!ctx.session || !ctx.session.user) {
        throw new TRPCError({ code: 'UNAUTHORIZED' })
    }
    return next({
        ctx: {
            session: { ...ctx.session, user: ctx.session.user },
        },
    })
})

export const publicProcedure = t.procedure.use(errorHandlingMiddleware)

export const protectedProcedure = t.procedure
    .use(errorHandlingMiddleware)
    .use(isAuthed)
