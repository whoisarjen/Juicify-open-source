import { createProductSchema } from "@/server/schema/product.schema";
import { z } from "zod"

import { router, protectedProcedure } from "../trpc";

export const productRouter = router({
    getById: protectedProcedure
        .input(
            z.object({
                id: z.coerce.number(),
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
                            userId: ctx.session.user.id,
                            id,
                        },
                    ]
                },
            })
        }),
    getByBarcode: protectedProcedure
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
                            userId: ctx.session.user.id,
                            barcode,
                        },
                    ]
                },
                orderBy: {
                    userId: 'asc',
                },
            })
        }),
    getAll: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                take: z.coerce.number().optional().default(10),
                skip: z.coerce.number().optional().default(0),
            })
        )
        .query(async ({ ctx, input: { name, take, skip } }) => {
            const contains = name.trim()

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
                            userId: ctx.session.user.id,
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
                id: z.coerce.number(),
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
