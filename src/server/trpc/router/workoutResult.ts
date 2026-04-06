import { z } from "zod";
import { omit } from "lodash";
import moment from "moment"

import { router, protectedProcedure } from "../trpc";
import { workoutResultSchema } from "@/server/schema/workoutResult.schema";

export const workoutResultRouter = router({
    get: protectedProcedure
        .input(
            z.object({
                id: z.coerce.number(),
                username: z.string(),
                searchAllPlans: z.boolean().optional().default(true),
            })
        )
        .query(async ({ ctx, input: { id, username, searchAllPlans } }) => {

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

            const previousWorkoutResults =
                !searchAllPlans && !workoutResult.workoutPlanId
                    ? []
                    : await ctx.prisma.workoutResult.findMany({
                        where: {
                            whenAdded: {
                                lt: workoutResult.whenAdded,
                            },
                            userId: workoutResult.userId,
                            ...(!searchAllPlans
                                ? { workoutPlanId: workoutResult.workoutPlanId }
                                : {}),
                        },
                        orderBy: {
                            whenAdded: 'desc',
                        },
                        take: searchAllPlans ? 20 : 5,
                    })

            // Process the last 5 workout results to find the most recent result for each exercise
            let previousWorkoutResult: any = undefined

            if (previousWorkoutResults.length > 0) {
                // Create a map to store the most recent result for each exercise
                const latestExerciseResults = new Map<number, any>()

                // Go through all previous workouts (already ordered by most recent first)
                for (const prevWorkout of previousWorkoutResults) {
                    const exercises = prevWorkout.exercises as any[]
                    if (exercises && Array.isArray(exercises)) {
                        for (const exercise of exercises) {
                            // If we haven't seen this exercise yet, or if this exercise has results
                            if (exercise && typeof exercise === 'object' && exercise.id &&
                                !latestExerciseResults.has(exercise.id) &&
                                exercise.results && Array.isArray(exercise.results) && exercise.results.length > 0) {
                                latestExerciseResults.set(exercise.id, exercise)
                            }
                        }
                    }
                }

                // Create a mock previous workout result with the latest exercise data
                if (latestExerciseResults.size > 0) {
                    previousWorkoutResult = {
                        ...previousWorkoutResults[0], // Use the most recent workout as base
                        exercises: Array.from(latestExerciseResults.values())
                    }
                }
            }

            return {
                ...workoutResult,
                previousWorkoutResult,
            } as unknown as Omit<WorkoutResult<typeof workoutResult>, 'workoutPlan'> & { workoutPlan?: WorkoutPlan } & { previousWorkoutResult?: WorkoutResult<typeof workoutResult> }
        }),
    getDay: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                whenAdded: z.coerce.date(),
            })
        )
        .query(async ({ ctx, input: { username, whenAdded } }) => {

            return await ctx.prisma.workoutResult.findMany({
                where: {
                    whenAdded: {
                        gte: whenAdded,
                        lte: whenAdded,
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
    getPeriod: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                startDate: z.coerce.date(),
                endDate: z.coerce.date(),
            })
        )
        .query(async ({ ctx, input: { username, startDate, endDate } }) => {

            return await ctx.prisma.workoutResult.findMany({
                where: {
                    whenAdded: {
                        gte: startDate,
                        lte: endDate,
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
    getAll: protectedProcedure
        .input(
            z.object({
                username: z.string(),
                take: z.coerce.number().min(1).max(100).optional().default(50),
                cursor: z.coerce.number().optional(),
            })
        )
        .query(async ({ ctx, input: { username, take, cursor } }) => {

            const items = await ctx.prisma.workoutResult.findMany({
                where: {
                    user: {
                        username,
                    },
                },
                orderBy: {
                    whenAdded: 'desc'
                },
                take: take + 1,
                ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
            }) as unknown as WorkoutResult[]

            let nextCursor: number | undefined = undefined
            if (items.length > take) {
                const nextItem = items.pop()
                nextCursor = nextItem?.id
            }

            return {
                items,
                nextCursor,
            }
        }),
    create: protectedProcedure
        .input(
            z.object({
                workoutPlanId: z.coerce.number(),
                whenAdded: z.coerce.date().optional().default(new Date())
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
                id: z.coerce.number(),
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
    getStatistics: protectedProcedure
        .input(
            z.object({
                username: z.string(),
            })
        )
        .query(async ({ ctx, input: { username } }) => {

            // Get ALL workout results for the user (no year filter)
            const workoutResults = await ctx.prisma.workoutResult.findMany({
                where: {
                    user: {
                        username,
                    },
                },
                select: {
                    id: true,
                    whenAdded: true,
                    name: true,
                    burnedCalories: true,
                },
                orderBy: {
                    whenAdded: 'desc'
                }
            });

            // If no workouts, return empty structure
            if (workoutResults.length === 0) {
                return {
                    totalWorkouts: 0,
                    totalCaloriesBurned: 0,
                    averageWorkoutsPerWeek: 0,
                    averageWorkoutsPerMonth: 0,
                    months: [],
                    yearlyComparison: {},
                    dateRange: {
                        earliest: null,
                        latest: null,
                    }
                };
            }

            // Get date range
            const sortedWorkouts = workoutResults.sort((a, b) =>
                new Date(a.whenAdded).getTime() - new Date(b.whenAdded).getTime()
            );
            const earliestDate = moment(sortedWorkouts[0].whenAdded);
            const latestDate = moment(sortedWorkouts[sortedWorkouts.length - 1].whenAdded);

            // Initialize detailed statistics structure
            const statistics = {
                totalWorkouts: workoutResults.length,
                totalCaloriesBurned: 0,
                averageWorkoutsPerWeek: 0,
                averageWorkoutsPerMonth: 0,
                months: [] as Array<{
                    month: string;
                    monthName: string;
                    year: number;
                    totalWorkouts: number;
                    totalCaloriesBurned: number;
                    weeks: Array<{
                        week: string;
                        weekNumber: number;
                        startDate: string;
                        endDate: string;
                        workouts: number;
                        caloriesBurned: number;
                        workoutDays: Array<{
                            date: string;
                            workouts: number;
                            caloriesBurned: number;
                        }>;
                    }>;
                    dailyBreakdown: Array<{
                        date: string;
                        dayName: string;
                        workouts: number;
                        caloriesBurned: number;
                    }>;
                }>,
                yearlyComparison: {} as Record<string, number>,
                dateRange: {
                    earliest: earliestDate.format('YYYY-MM-DD'),
                    latest: latestDate.format('YYYY-MM-DD'),
                }
            };

            // Calculate total calories burned
            statistics.totalCaloriesBurned = workoutResults.reduce((total, workout) => total + workout.burnedCalories, 0);

            // Group workouts by month-year
            const workoutsByMonth: Record<string, typeof workoutResults> = {};
            workoutResults.forEach(workout => {
                const monthKey = moment(workout.whenAdded).format('YYYY-MM');
                if (!workoutsByMonth[monthKey]) {
                    workoutsByMonth[monthKey] = [];
                }
                workoutsByMonth[monthKey].push(workout);
            });

            // Process only months that have workouts
            for (const monthKey of Object.keys(workoutsByMonth)) {
                const monthWorkouts = workoutsByMonth[monthKey];
                const monthStart = moment(monthKey + '-01');
                const monthEnd = monthStart.clone().endOf('month');
                const monthName = monthStart.format('MMMM');
                const year = monthStart.year();

                // Generate all weeks for this month
                const weeks = [];
                let weekStart = monthStart.clone().startOf('isoWeek');

                while (weekStart.isBefore(monthEnd) || weekStart.isSame(monthEnd, 'week')) {
                    const weekEnd = weekStart.clone().endOf('isoWeek');
                    const weekNumber = weekStart.isoWeek();
                    const weekKey = weekStart.format('YYYY-[W]WW');

                    // Get workouts for this week
                    const weekWorkouts = monthWorkouts.filter(workout => {
                        const workoutDate = moment(workout.whenAdded);
                        return workoutDate.isBetween(weekStart, weekEnd, 'day', '[]');
                    });

                    // Generate daily breakdown for this week
                    const workoutDays = [];
                    for (let day = 0; day < 7; day++) {
                        const currentDay = weekStart.clone().add(day, 'days');
                        if (currentDay.month() === monthStart.month() && currentDay.year() === year) {
                            const dayWorkouts = weekWorkouts.filter(workout =>
                                moment(workout.whenAdded).isSame(currentDay, 'day')
                            );

                            workoutDays.push({
                                date: currentDay.format('YYYY-MM-DD'),
                                workouts: dayWorkouts.length,
                                caloriesBurned: dayWorkouts.reduce((total, workout) => total + workout.burnedCalories, 0),
                            });
                        }
                    }

                    if (weekWorkouts.length > 0 || workoutDays.some(day => day.workouts > 0)) {
                        weeks.push({
                            week: weekKey,
                            weekNumber,
                            startDate: weekStart.format('YYYY-MM-DD'),
                            endDate: weekEnd.format('YYYY-MM-DD'),
                            workouts: weekWorkouts.length,
                            caloriesBurned: weekWorkouts.reduce((total, workout) => total + workout.burnedCalories, 0),
                            workoutDays,
                        });
                    }

                    weekStart.add(1, 'week');
                }

                // Generate daily breakdown for the entire month
                const dailyBreakdown = [];
                for (let day = 1; day <= monthEnd.date(); day++) {
                    const currentDay = moment([year, monthStart.month(), day]);
                    const dayWorkouts = monthWorkouts.filter(workout =>
                        moment(workout.whenAdded).isSame(currentDay, 'day')
                    );

                    dailyBreakdown.push({
                        date: currentDay.format('YYYY-MM-DD'),
                        dayName: currentDay.format('dddd'),
                        workouts: dayWorkouts.length,
                        caloriesBurned: dayWorkouts.reduce((total, workout) => total + workout.burnedCalories, 0),
                    });
                }

                statistics.months.push({
                    month: monthKey,
                    monthName,
                    year,
                    totalWorkouts: monthWorkouts.length,
                    totalCaloriesBurned: monthWorkouts.reduce((total, workout) => total + workout.burnedCalories, 0),
                    weeks,
                    dailyBreakdown,
                });
            }

            // Sort months by date (most recent first)
            statistics.months.sort((a, b) => b.month.localeCompare(a.month));

            // Calculate averages based on actual time period
            const totalMonths = moment().diff(earliestDate, 'months', true);
            const totalWeeks = moment().diff(earliestDate, 'weeks', true);
            statistics.averageWorkoutsPerWeek = Math.round((statistics.totalWorkouts / Math.max(totalWeeks, 1)) * 100) / 100;
            statistics.averageWorkoutsPerMonth = Math.round((statistics.totalWorkouts / Math.max(totalMonths, 1)) * 100) / 100;

            // Get yearly comparison data
            const yearsArray = workoutResults.map(workout => moment(workout.whenAdded).year());
            const uniqueYears = Array.from(new Set(yearsArray));
            for (const year of uniqueYears) {
                const yearWorkouts = workoutResults.filter(workout =>
                    moment(workout.whenAdded).year() === year
                ).length;
                statistics.yearlyComparison[year.toString()] = yearWorkouts;
            }

            return statistics;
        }),
});
