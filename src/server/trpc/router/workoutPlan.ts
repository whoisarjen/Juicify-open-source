import { z } from "zod";
import { omit } from "lodash";

import { router, publicProcedure, protectedProcedure } from "../trpc";
import { createWorkoutPlanSchema, workoutPlanSchema } from "@/server/schema/workoutPlan.schema";

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

            return workoutPlan as unknown as WorkoutPlan<typeof workoutPlan>
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
                orderBy: {
                    name: 'asc',
                },
            }) as unknown as WorkoutPlan[]
        }),
    create: protectedProcedure
        .input(createWorkoutPlanSchema)
        .mutation(async ({ ctx, input }) => {
            return await ctx.prisma.workoutPlan.create({
                data: {
                    ...input,
                    userId: ctx.session.user.id,
                    exercises: [],
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
            return await ctx.prisma.workoutPlan.update({
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
    addPredefinedPlan: protectedProcedure
        .mutation(async ({ ctx }) => {
            const predefinedWorkouts = [
                {
                    name: "LOWER A - Glute & Core Focus",
                    description: "Focus on glute activation and core strength",
                    exercises: [
                        { name: "Cable Crunches (kneeling)", series: 4, reps: 15, rir: 2 },
                        { name: "Hip Thrust", series: 4, reps: 8, rir: 3 },
                        { name: "Bulgarian Split Squats", series: 3, reps: 12, rir: 3 },
                        { name: "Single Leg RDL", series: 3, reps: 10, rir: 3 },
                        { name: "Machine Hip Abduction", series: 3, reps: 15, rir: 2 }
                    ]
                },
                {
                    name: "UPPER A - Back Focus",
                    description: "Focus on back strength and width",
                    exercises: [
                        { name: "Cable Wood Chops (high to low)", series: 4, reps: 15, rir: 2 },
                        { name: "Bent Over Row", series: 4, reps: 8, rir: 3 },
                        { name: "Pull-ups/Lat Pulldown", series: 3, reps: 12, rir: 3 },
                        { name: "Overhead Press", series: 3, reps: 10, rir: 3 },
                        { name: "Machine Chest Press", series: 3, reps: 12, rir: 3 }
                    ]
                },
                {
                    name: "LOWER B - Posterior Chain & Core",
                    description: "Focus on posterior chain and core stability",
                    exercises: [
                        { name: "Hanging Leg Raises", series: 4, reps: 12, rir: 2 },
                        { name: "Romanian Deadlift", series: 4, reps: 10, rir: 3 },
                        { name: "Close Loaded Back Extension", series: 3, reps: 15, rir: 3 },
                        { name: "Leg Press", series: 3, reps: 15, rir: 3 },
                        { name: "Calf Raises", series: 3, reps: 20, rir: 2 }
                    ]
                },
                {
                    name: "UPPER B - Back Width & Core",
                    description: "Focus on back width and core strength",
                    exercises: [
                        { name: "Cable Side Crunches", series: 4, reps: 15, rir: 2 },
                        { name: "Cable Row (Wide Grip)", series: 4, reps: 12, rir: 3 },
                        { name: "Reverse Flyes", series: 3, reps: 15, rir: 3 },
                        { name: "Standing Lateral Raise", series: 3, reps: 15, rir: 2 },
                        { name: "Incline Dumbbell Press", series: 3, reps: 12, rir: 3 }
                    ]
                }
            ];

            const createdWorkouts = [];

            for (const workout of predefinedWorkouts) {
                const exercisesWithIds = [];

                for (const exercise of workout.exercises) {
                    let existingExercise = await ctx.prisma.exercise.findFirst({
                        where: {
                            name: {
                                equals: exercise.name,
                                mode: 'insensitive'
                            },
                            isDeleted: false,
                            OR: [
                                { userId: null },
                                { userId: ctx.session.user.id }
                            ]
                        }
                    });

                    if (!existingExercise) {
                        existingExercise = await ctx.prisma.exercise.create({
                            data: {
                                name: exercise.name,
                                nameLength: exercise.name.length,
                                userId: null
                            }
                        });
                    }

                    exercisesWithIds.push({
                        id: existingExercise.id,
                        name: existingExercise.name,
                        series: exercise.series,
                        reps: exercise.reps,
                        rir: exercise.rir
                    });
                }

                const createdWorkout = await ctx.prisma.workoutPlan.create({
                    data: {
                        name: workout.name,
                        description: workout.description,
                        userId: ctx.session.user.id,
                        exercises: exercisesWithIds
                    }
                });

                createdWorkouts.push(createdWorkout);
            }

            return createdWorkouts;
        }),
});
