import { z } from "zod"
import { omit } from "lodash"
import { type PrismaClient } from '@prisma/client'

import { router, publicProcedure, protectedProcedure } from "../trpc"
import { measurementSchema, createMeasurementSchema } from "@/server/schema/measurement.schema"

async function syncUserWeight(
    prisma: PrismaClient,
    userId: number,
    measurementWeight: number,
    measurementDate: Date,
) {
    if (measurementWeight <= 0) return

    const user = await prisma.user.findUniqueOrThrow({ where: { id: userId } })
    if (measurementDate >= user.weightUpdatedAt) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                weight: measurementWeight,
                weightUpdatedAt: measurementDate,
            },
        })
    }
}

async function recalcUserWeight(prisma: PrismaClient, userId: number) {
    const latest = await prisma.measurement.findFirst({
        where: { userId },
        orderBy: { whenAdded: 'desc' },
    })
    if (latest) {
        await prisma.user.update({
            where: { id: userId },
            data: {
                weight: latest.weight,
                weightUpdatedAt: latest.whenAdded,
            },
        })
    }
}

export const measurementRouter = router({
    getDay: publicProcedure
        .input(
            z.object({
                username: z.string(),
                whenAdded: z.coerce.date(),
                whenAddedEnd: z.coerce.date().optional(),
            })
        )
        .query(async ({ ctx, input: { username, whenAdded, whenAddedEnd } }) => {
            return await ctx.prisma.measurement.findFirst({
                where: {
                    weight: {
                        gte: 0,
                    },
                    whenAdded: {
                        gte: whenAdded,
                        lte: whenAddedEnd ?? whenAdded,
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
                take: 30,
                where: {
                    source: null,
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
            const whenAdded = input.whenAdded ?? new Date()
            const dayStart = new Date(whenAdded)
            dayStart.setHours(0, 0, 0, 0)
            const dayEnd = new Date(whenAdded)
            dayEnd.setHours(23, 59, 59, 999)

            const existing = await ctx.prisma.measurement.findFirst({
                where: {
                    userId: ctx.session.user.id,
                    whenAdded: { gte: dayStart, lte: dayEnd },
                },
            })

            const measurement = existing
                ? await ctx.prisma.measurement.update({
                    data: {
                        ...input,
                        weight: Number(input.weight) > 0
                            ? input.weight
                            : existing.weight,
                    },
                    where: {
                        id_userId: {
                            id: existing.id,
                            userId: ctx.session.user.id,
                        },
                    },
                })
                : await ctx.prisma.measurement.create({
                    data: {
                        ...input,
                        userId: ctx.session.user.id,
                    },
                })

            await syncUserWeight(
                ctx.prisma,
                ctx.session.user.id,
                Number(measurement.weight),
                measurement.whenAdded,
            )
            return measurement
        }),
    update: protectedProcedure
        .input(measurementSchema)
        .mutation(async ({ ctx, input }) => {
            const measurement = await ctx.prisma.measurement.update({
                data: omit(input, ['id']),
                where: {
                    id_userId: {
                        id: input.id,
                        userId: ctx.session.user.id,
                    }
                }
            })
            await syncUserWeight(
                ctx.prisma,
                ctx.session.user.id,
                Number(measurement.weight),
                measurement.whenAdded,
            )
            return measurement
        }),
    delete: protectedProcedure
        .input(
            z.object({
                id: z.coerce.number(),
            })
        )
        .mutation(async ({ ctx, input: { id } }) => {
            const deleted = await ctx.prisma.measurement.delete({
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
            if (deleted.whenAdded.getTime() >= ctx.session.user.weightUpdatedAt.getTime()) {
                await recalcUserWeight(ctx.prisma, ctx.session.user.id)
            }
            return deleted
        }),
})
