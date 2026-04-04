import { z } from "zod"
import { omit } from "lodash"
import { router, protectedProcedure } from "../trpc"
import { supplementSchema, createSupplementSchema } from "@/server/schema/supplement.schema"

export const supplementRouter = router({
    getAll: protectedProcedure
        .query(async ({ ctx }) => {
            return await ctx.prisma.supplement.findMany({
                where: { userId: ctx.session.user.id },
                orderBy: { name: 'asc' },
            })
        }),

    create: protectedProcedure
        .input(createSupplementSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.supplement.create({
                data: {
                    ...input,
                    userId: ctx.session.user.id,
                },
            })
        }),

    update: protectedProcedure
        .input(supplementSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.supplement.update({
                data: omit(input, ['id']),
                where: {
                    id_userId: {
                        id: input.id,
                        userId: ctx.session.user.id,
                    },
                },
            })
        }),

    delete: protectedProcedure
        .input(z.object({ id: z.coerce.number() }))
        .mutation(async ({ ctx, input: { id } }) => {
            return await ctx.prisma.supplement.delete({
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    },
                },
            })
        }),

    getDueForDate: protectedProcedure
        .input(z.object({ date: z.coerce.date() }))
        .query(async ({ ctx, input: { date } }) => {
            const supplements = await ctx.prisma.supplement.findMany({
                where: { userId: ctx.session.user.id, isActive: true },
                orderBy: { name: 'asc' },
            })

            // Normalize to midnight UTC for consistent date-only comparison
            const targetUTC = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())

            return supplements.filter(s => {
                const createdUTC = Date.UTC(s.createdAt.getUTCFullYear(), s.createdAt.getUTCMonth(), s.createdAt.getUTCDate())
                const diffDays = Math.round((targetUTC - createdUTC) / (1000 * 60 * 60 * 24))
                return diffDays >= 0 && diffDays % s.frequency === 0
            })
        }),

    toggleActive: protectedProcedure
        .input(z.object({ id: z.coerce.number(), isActive: z.boolean() }))
        .mutation(async ({ ctx, input: { id, isActive } }) => {
            return await ctx.prisma.supplement.update({
                data: { isActive },
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    },
                },
            })
        }),
})
