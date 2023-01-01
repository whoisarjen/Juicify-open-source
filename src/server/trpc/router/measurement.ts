import { z } from "zod"
import moment from "moment"
import { omit } from "lodash"

import { router, publicProcedure, protectedProcedure } from "../trpc"
import { measurementSchema, createMeasurementSchema } from "@/server/schema/measurement.schema"

export const measurementRouter = router({
    getDay: publicProcedure
        .input(
            z.object({
                username: z.string(),
                whenAdded: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
            })
        )
        .query(async ({ ctx, input: { username, whenAdded } }) => {
            return await ctx.prisma.measurement.findFirst({
                where: {
                    weight: {
                        gte: 0,
                    },
                    whenAdded: {
                        gte: moment(whenAdded).startOf('day').toDate(),
                        lte: moment(whenAdded).endOf('day').toDate(),
                    },
                    user: {
                        username,
                    },
                },
                orderBy: {
                    whenAdded: 'desc'
                }
            })
        }),
    getAll: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { username } }) => {
            return await ctx.prisma.measurement.findMany({
                take: 10,
                where: {
                    user: {
                        username,
                    },
                },
                orderBy: [
                    {
                        id: 'desc',
                    },
                    {
                        whenAdded: 'desc',
                    }
                ],
            })
        }),
    create: protectedProcedure
        .input(createMeasurementSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.measurement.create({
                data: {
                    ...input,
                    userId: ctx.session.user.id,
                }
            })
        }),
    update: protectedProcedure
        .input(measurementSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.measurement.update({
                data: omit(input, ['id']),
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
            return await ctx.prisma.measurement.delete({
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
        }),
})
