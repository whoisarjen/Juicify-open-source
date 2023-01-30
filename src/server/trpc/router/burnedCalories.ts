import { createBurnedCaloriesSchema, burnedCaloriesSchema } from "@/server/schema/burnedCalories.schema";
import { omit } from "lodash";
import moment from "moment";
import { z } from "zod"

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const burnedCaloriesRouter = router({
    getPeriod: publicProcedure
        .input(
            z.object({
                username: z.string(),
                startDate: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
                endDate: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
            })
        )
        .query(async ({ ctx, input: { username, startDate, endDate } }) => {
            return await ctx.prisma.burnedCalories.findMany({
                where: {
                    whenAdded: {
                        gte: moment(startDate).startOf('day').toDate(),
                        lte: moment(endDate).endOf('day').toDate(),
                    },
                    user: {
                        username,
                    },
                },
                orderBy: {
                    createdAt: 'asc',
                },
            })
        }),
    create: protectedProcedure
        .input(createBurnedCaloriesSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.burnedCalories.create({
                data: {
                    ...input,
                    userId: ctx.session.user.id,
                }
            })
        }),
    update: protectedProcedure
        .input(burnedCaloriesSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.burnedCalories.update({
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
            return await ctx.prisma.burnedCalories.delete({
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
        }),
});
