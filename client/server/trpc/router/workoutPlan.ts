import { z } from "zod";
import { omit } from "lodash";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { type ExerciseSchema, exerciseSchema } from "server/schema/exercise.schema";
import { workoutPlanSchema } from "server/schema/workoutPlan.schema";

export const workoutPlanRouter = router({
    get: publicProcedure
        .input(
            z.object({
                id: z.number(),
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { id, username } }) => {
            const workoutPlan = await ctx.prisma.workoutPlan.findFirstOrThrow({
                where: {
                    id,
                    isDeleted: false,
                    user: {
                        username,
                    },
                },
                include: {
                    user: true,
                },
            });

            return workoutPlan as unknown as Omit<typeof workoutPlan, 'exercises'> & { exercises: ExerciseSchema[] }
        }),
    getAll: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { username } }) => {
            return await ctx.prisma.workoutPlan.findMany({
                where: {
                    isDeleted: false,
                    user: {
                        username,
                    },
                },
            });
        }),
    create: protectedProcedure
        .input(
            z.object({
                name: z.string(),
                exercises: z.array(exerciseSchema)
                    .optional()
                    .default([])
            })
        )
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.workoutPlan.create({
                data: {
                    ...input,
                    userId: ctx.session.user.id,
                }
            })
        }),
    update: protectedProcedure
        .input(workoutPlanSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.workoutPlan.update({
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
            return await ctx.prisma.workoutPlan.delete({
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
        }),
});
