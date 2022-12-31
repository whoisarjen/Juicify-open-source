import { createProductSchema } from "@/server/schema/product.schema";
import { z } from "zod"

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const productRouter = router({
    getAll: publicProcedure
        .input(
            z.object({
                name: z.string(),
            })
        )
        .query(async ({ ctx, input: { name } }) => {
            return await ctx.prisma.product.findMany({
                take: 10,
                where: {
                    OR: [
                        {
                            isDeleted: false,
                            userId: null,
                            name: {
                                contains: name,
                            },
                        },
                        ...(ctx.session?.user?.id
                            ? [{
                                isDeleted: false,
                                userId: ctx.session.user.id,
                                name: {
                                    contains: name,
                                },
                            }]
                            : []
                        )
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
