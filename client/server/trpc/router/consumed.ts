import { z } from "zod"
import moment from "moment";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { createConsumedSchema } from '@/server/schema/consumed.schema'

export const consumedRouter = router({
    getDay: publicProcedure
        .input(
            z.object({
                username: z.string(),
                whenAdded: z.date(),
            })
        )
        .query(async ({ ctx, input: { username, whenAdded } }) => {
            return await ctx.prisma.consumed.findMany({
                where: {
                    user: {
                        username,
                    },
                    whenAdded: {
                        gte: moment(whenAdded).startOf('day').toDate(),
                        lte: moment(whenAdded).endOf('day').toDate(),
                    },
                },
                include: {
                    product: true,
                    user: {
                        select: {
                            id: true,
                            username: true,
                            image: true,
                        }
                    }
                },
                orderBy: {
                    meal: 'asc',
                },
            })
        }),
    create: protectedProcedure
        .input(createConsumedSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.consumed.create({
                data: {
                    ...input,
                    userId: ctx.session.user.id,
                }
            })
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .mutation(async ({ ctx, input: { id } }) => {
            return await ctx.prisma.consumed.delete({
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
        }),
})
