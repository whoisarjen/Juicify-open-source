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
                    name: 'desc',
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
                    name: "WORKOUT A - Hip Power & Core",
                    description: "Glute-focused power session with core activation. Emphasizes hip extension strength and abdominal development.",
                    burnedCalories: 320,
                    exercises: [
                        { name: "Cable Crunches (kneeling)", series: 5, reps: 14, rir: 3 },
                        { name: "Hip Thrust", series: 4, reps: 7, rir: 4 },
                        { name: "Single Leg RDL", series: 3, reps: 9, rir: 4 },
                        { name: "Bulgarian Split Squats", series: 3, reps: 11, rir: 4 },
                        { name: "Leg Extensions", series: 3, reps: 14, rir: 4 }
                    ]
                },
                {
                    name: "WORKOUT B - Back & Press Power",
                    description: "Heavy strength-focused session targeting back thickness and pressing power. Core rotation and upper body development.",
                    burnedCalories: 330,
                    exercises: [
                        { name: "Cable Wood Chops (high to low)", series: 5, reps: 14, rir: 3 },
                        { name: "Bent Over Row", series: 4, reps: 7, rir: 4 },
                        { name: "Overhead Press", series: 3, reps: 9, rir: 4 },
                        { name: "Leg Curls", series: 3, reps: 11, rir: 4 },
                        { name: "Machine Chest Press", series: 3, reps: 10, rir: 4 }
                    ]
                },
                {
                    name: "WORKOUT C - Posterior Chain & Legs",
                    description: "Hip hinge dominant session with quad development. Focuses on posterior chain strength and lower abs conditioning.",
                    burnedCalories: 310,
                    exercises: [
                        { name: "Hanging Leg Raises", series: 5, reps: 10, rir: 3 },
                        { name: "Romanian Deadlift", series: 4, reps: 9, rir: 4 },
                        { name: "Close Loaded Back Extension", series: 3, reps: 14, rir: 4 },
                        { name: "Leg Press", series: 3, reps: 14, rir: 4 },
                        { name: "Machine Hip Abduction", series: 3, reps: 14, rir: 3 }
                    ]
                },
                {
                    name: "WORKOUT D - Pull & Pump",
                    description: "Volume-focused pulling session with upper body pump work. Emphasizes back width, shoulder health, and oblique development.",
                    burnedCalories: 300,
                    exercises: [
                        { name: "Cable Side Crunches", series: 5, reps: 14, rir: 3 },
                        { name: "Cable Row (Wide Grip)", series: 4, reps: 11, rir: 4 },
                        { name: "Lat Pulldown", series: 3, reps: 10, rir: 4 },
                        { name: "Standing Lateral Raise", series: 3, reps: 14, rir: 3 },
                        { name: "Incline Dumbbell Press", series: 3, reps: 10, rir: 4 }
                    ]
                }
            ];

            const createdWorkouts = [];

            for (const workout of predefinedWorkouts) {
                const exercisesWithIds = [];

                for (const exercise of workout.exercises) {
                    const exerciseVariations = [exercise.name];

                    // Add alternative names for common exercises
                    if (exercise.name.toLowerCase().includes('lat pulldown')) {
                        exerciseVariations.push('Pull-ups/Lat Pulldown', 'Pulldown', 'Lat Pull Down');
                    }
                    if (exercise.name.toLowerCase().includes('cable side crunches')) {
                        exerciseVariations.push('Cable Side Crunch', 'Side Crunches');
                    }

                    let existingExercise = await ctx.prisma.exercise.findFirst({
                        where: {
                            AND: [
                                {
                                    OR: exerciseVariations.map(variation => ({
                                        name: {
                                            equals: variation,
                                            mode: 'insensitive'
                                        }
                                    }))
                                },
                                { isDeleted: false },
                                {
                                    OR: [
                                        { userId: null },
                                        { userId: ctx.session.user.id }
                                    ]
                                }
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
                        burnedCalories: workout.burnedCalories,
                        userId: ctx.session.user.id,
                        exercises: exercisesWithIds
                    }
                });

                createdWorkouts.push(createdWorkout);
            }

            return createdWorkouts;
        }),
});
