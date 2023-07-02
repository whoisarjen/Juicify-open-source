import { createProductSchema } from "@/server/schema/product.schema";
import { z } from "zod"

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const productRouter = router({
    getById: publicProcedure
        .input(
            z.object({
                id: z.number(),
            })
        )
        .query(async ({ ctx, input: { id } }) => {
            return await ctx.prisma.product.findFirstOrThrow({
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            id,
                        },
                        {
                            isDeleted: false,
                            userId: ctx.session?.user?.id || null,
                            id,
                        },
                    ]
                },
            })
        }),
    getByBarcode: publicProcedure
        .input(
            z.object({
                barcode: z.string(),
            })
        )
        .query(async ({ ctx, input: { barcode } }) => {
            return await ctx.prisma.product.findFirstOrThrow({
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            barcode,
                        },
                        {
                            isDeleted: false,
                            userId: ctx.session?.user?.id || null,
                            barcode,
                        },
                    ]
                },
                orderBy: {
                    userId: 'asc',
                },
            })
        }),
    getAll: publicProcedure
        .input(
            z.object({
                name: z.string(),
                take: z.number().optional().default(10),
                skip: z.number().optional().default(0),
            })
        )
        .query(async ({ ctx, input: { name, take, skip } }) => {
            const preparedName = name.trim()
            const contains = preparedName.substring(0, preparedName.length - 1)

            return await ctx.prisma.product.findMany({
                take,
                skip,
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            name: {
                                contains,
                                mode: 'insensitive',
                            },
                        },
                        {
                            isDeleted: false,
                            userId: ctx.session?.user?.id || null,
                            name: {
                                contains,
                                mode: 'insensitive',
                            },
                        },
                    ]
                },
                orderBy: {
                    nameLength: 'asc',
                },
            })
        }),
    create: protectedProcedure
        .input(createProductSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.product.create({
                data: {
                    ...input,
                    nameLength: input.name.length,
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
            return await ctx.prisma.product.update({
                data: {
                    isDeleted: true,
                },
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
        }),
})
