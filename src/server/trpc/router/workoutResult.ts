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
    getStatistics: publicProcedure
        .input(
            z.object({
                username: z.string(),
                year: z.number().optional(),
            })
        )
        .query(async ({ ctx, input: { username, year } }) => {
            const currentYear = year || new Date().getFullYear();
            
            // Get all workout results for the user in the specified year
            const workoutResults = await ctx.prisma.workoutResult.findMany({
                where: {
                    user: {
                        username,
                    },
                    whenAdded: {
                        gte: new Date(`${currentYear}-01-01`),
                        lte: new Date(`${currentYear}-12-31T23:59:59`),
                    },
                },
                select: {
                    id: true,
                    whenAdded: true,
                    name: true,
                    burnedCalories: true,
                },
                orderBy: {
                    whenAdded: 'asc'
                }
            });

            // Initialize detailed statistics structure
            const statistics = {
                year: currentYear,
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
            };

            // Calculate total calories burned
            statistics.totalCaloriesBurned = workoutResults.reduce((total, workout) => total + workout.burnedCalories, 0);

            // Generate all months for the year (even if no workouts)
            for (let month = 0; month < 12; month++) {
                const monthStart = moment([currentYear, month]);
                const monthEnd = moment([currentYear, month]).endOf('month');
                const monthKey = monthStart.format('YYYY-MM');
                const monthName = monthStart.format('MMMM');

                // Get workouts for this month
                const monthWorkouts = workoutResults.filter(workout => 
                    moment(workout.whenAdded).format('YYYY-MM') === monthKey
                );

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
                        if (currentDay.month() === month) {
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

                    weeks.push({
                        week: weekKey,
                        weekNumber,
                        startDate: weekStart.format('YYYY-MM-DD'),
                        endDate: weekEnd.format('YYYY-MM-DD'),
                        workouts: weekWorkouts.length,
                        caloriesBurned: weekWorkouts.reduce((total, workout) => total + workout.burnedCalories, 0),
                        workoutDays,
                    });

                    weekStart.add(1, 'week');
                }

                // Generate daily breakdown for the entire month
                const dailyBreakdown = [];
                for (let day = 1; day <= monthEnd.date(); day++) {
                    const currentDay = moment([currentYear, month, day]);
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
                    year: currentYear,
                    totalWorkouts: monthWorkouts.length,
                    totalCaloriesBurned: monthWorkouts.reduce((total, workout) => total + workout.burnedCalories, 0),
                    weeks: weeks.filter(week => 
                        week.workoutDays.some(day => day.workouts > 0) || 
                        moment(week.startDate).month() === month ||
                        moment(week.endDate).month() === month
                    ),
                    dailyBreakdown,
                });
            }

            // Calculate averages
            const totalWeeksInYear = 52;
            statistics.averageWorkoutsPerWeek = Math.round((statistics.totalWorkouts / totalWeeksInYear) * 100) / 100;
            statistics.averageWorkoutsPerMonth = Math.round((statistics.totalWorkouts / 12) * 100) / 100;

            // Get data for previous years for comparison
            const previousYears = [currentYear - 1, currentYear - 2];
            for (const prevYear of previousYears) {
                const prevYearWorkouts = await ctx.prisma.workoutResult.count({
                    where: {
                        user: { username },
                        whenAdded: {
                            gte: new Date(`${prevYear}-01-01`),
                            lte: new Date(`${prevYear}-12-31T23:59:59`),
                        },
                    },
                });
                statistics.yearlyComparison[prevYear.toString()] = prevYearWorkouts;
            }

            return statistics;
        }),
});
