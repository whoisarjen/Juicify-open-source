import { createProductSchema } from "@/server/schema/product.schema";
import { z } from "zod"

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const productRouter = router({
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
    getAll: publicProcedure // TODO need to more natural language for name here and also exercise
        .input(
            z.object({
                name: z.string(),
            })
        )
        .query(async ({ ctx, input: { name } }) => {
            const contains = name.trim()

            return await ctx.prisma.product.findMany({
                take: 10,
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
