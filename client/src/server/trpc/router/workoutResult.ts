import { z } from "zod";
import { omit } from "lodash";
import moment from "moment"

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { workoutResultSchema } from "@/server/schema/workoutResult.schema";

export const workoutResultRouter = router({
    get: publicProcedure
        .input(
            z.object({
                id: z.number(),
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { id, username } }) => {
            const workoutResult = await ctx.prisma.workoutResult.findFirstOrThrow({
                where: {
                    id,
                    user: {
                        username,
                    },
                },
                include: {
                    user: true,
                    workoutPlan: true,
                },
            })

            const previousWorkoutResult = workoutResult.workoutPlanId
                ? await ctx.prisma.workoutResult.findFirst({
                    where: {
                        whenAdded: {
                            lt: workoutResult.whenAdded,
                        },
                        userId: workoutResult.userId,
                        workoutPlanId: workoutResult.workoutPlanId,
                    },
                    orderBy: {
                        whenAdded: 'desc',
                    },
                })
                : undefined

            return {
                ...workoutResult,
                previousWorkoutResult,
            } as unknown as Omit<WorkoutResult<typeof workoutResult>, 'workoutPlan'> & { workoutPlan?: WorkoutPlan } & { previousWorkoutResult?: WorkoutResult<typeof workoutResult> }
        }),
    getDay: publicProcedure
        .input(
            z.object({
                username: z.string(),
                whenAdded: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
            })
        )
        .query(async ({ ctx, input: { username, whenAdded } }) => {
            return await ctx.prisma.workoutResult.findMany({
                where: {
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
            }) as unknown as WorkoutResult[]
        }),
    getPeriod: publicProcedure
        .input(
            z.object({
                username: z.string(),
                startDate: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
                endDate: z.preprocess(whenAdded => moment(String(whenAdded)).toDate(), z.date()),
            })
        )
        .query(async ({ ctx, input: { username, startDate, endDate } }) => {
            return await ctx.prisma.workoutResult.findMany({
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
                    whenAdded: 'desc'
                }
            }) as unknown as WorkoutResult[]
        }),
    getAll: publicProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { username } }) => {
            return await ctx.prisma.workoutResult.findMany({
                where: {
                    user: {
                        username,
                    },
                },
                orderBy: {
                    whenAdded: 'desc'
                }
            }) as unknown as WorkoutResult[]
        }),
    create: protectedProcedure
        .input(
            z.object({
                workoutPlanId: z.number(),
                whenAdded: z.date().optional().default(new Date())
            })
        )
        .mutation(async ({ ctx, input: { workoutPlanId } }) => {
            const workoutPlan = await ctx.prisma.workoutPlan.findFirstOrThrow({
                where: {
                    id: workoutPlanId,
                    userId: ctx.session.user.id,
                }
            }) as unknown as WorkoutPlan

            return await ctx.prisma.workoutResult.create({
                data: {
                    userId: ctx.session.user.id,
                    workoutPlanId: workoutPlan.id,
                    name: workoutPlan.name,
                    burnedCalories: workoutPlan.burnedCalories,
                    exercises: workoutPlan.exercises.map(exercise => ({ ...exercise, results: [] }))
                }
            })
        }),
    update: protectedProcedure
        .input(workoutResultSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.workoutResult.update({
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
            return await ctx.prisma.workoutResult.delete({
                where: {
                    id_userId: {
                        id,
                        userId: ctx.session.user.id,
                    }
                }
            })
        }),
});
