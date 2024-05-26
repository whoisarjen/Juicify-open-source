import { z } from "zod"
import moment from "moment";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { consumedSchema, createConsumedSchema } from '@/server/schema/consumed.schema'
import { omit } from "lodash";

export const consumedRouter = router({
    getPeriod: publicProcedure
        .input(
            z.object({
                username: z.string(),
                startDate: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
                endDate: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
            })
        )
        .query(async ({ ctx, input: { username, startDate, endDate } }) => {
            return await ctx.prisma.consumed.findMany({
                where: {
                    user: {
                        username,
                    },
                    whenAdded: {
                        gte: moment(startDate).startOf('day').toDate(),
                        lte: moment(endDate).endOf('day').toDate(),
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
    update: protectedProcedure
        .input(consumedSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.consumed.update({
                data: {
                    ...omit(input, ['id']),
                },
                where: {
                    id_userId: {
                        id: input.id,
                        userId: ctx.session.user.id,
                    }
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
