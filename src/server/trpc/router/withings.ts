import { z } from 'zod'
import moment from 'moment'
import { router, protectedProcedure } from '../trpc'
import { syncWithingsData } from '@/server/withings/sync'

export const withingsRouter = router({
    sync: protectedProcedure.mutation(async ({ ctx }) => {
        const userId = ctx.session.user.id

        const hasWithings = await ctx.prisma.account.findFirst({
            where: { userId, provider: 'withings' },
            select: { userId: true },
        })

        if (!hasWithings) {
            throw new Error('No Withings account connected')
        }

        await syncWithingsData(userId)

        await ctx.prisma.withingsSyncLog.create({
            data: { userId, status: 'ok', message: 'manual sync' },
        })

        return { success: true }
    }),
    dayStats: protectedProcedure
        .input(z.object({ date: z.string() }))
        .query(async ({ ctx, input: { date } }) => {
            const userId = ctx.session.user.id
            const dayStart = moment(date, 'YYYY-MM-DD').startOf('day').toDate()
            const dayEnd = moment(date, 'YYYY-MM-DD').endOf('day').toDate()

            const [activity, sleep, workouts] = await Promise.all([
                ctx.prisma.withingsActivity.findFirst({
                    where: { userId, date: { gte: dayStart, lte: dayEnd } },
                }),
                ctx.prisma.withingsSleep.findFirst({
                    where: { userId, date: { gte: dayStart, lte: dayEnd } },
                }),
                ctx.prisma.withingsWorkout.findMany({
                    where: { userId, startDate: { gte: dayStart, lte: dayEnd } },
                    orderBy: { startDate: 'asc' },
                    select: {
                        category: true,
                        categoryName: true,
                        startDate: true,
                        endDate: true,
                        steps: true,
                        distance: true,
                        calories: true,
                    },
                }),
            ])

            if (!activity && !sleep && workouts.length === 0) return null

            return {
                steps: activity?.steps ?? null,
                totalCalories: activity ? Math.round(Number(activity.totalCalories)) : null,
                activeCalories: activity ? Math.round(Number(activity.activeCalories)) : null,
                workouts: workouts.map(w => ({
                    category: w.category,
                    categoryName: w.categoryName,
                    startDate: w.startDate,
                    endDate: w.endDate,
                    steps: w.steps,
                    distance: Number(w.distance),
                    durationMin: (w.endDate.getTime() - w.startDate.getTime()) / 60000,
                })),
                totalSleepTime: sleep?.totalSleepTime ?? null,
                sleepScore: sleep?.sleepScore ?? null,
                hrAverage: sleep?.hrAverage ?? null,
                hrMin: sleep?.hrMin ?? null,
                hrMax: sleep?.hrMax ?? null,
            }
        }),
    dashboard: protectedProcedure
        .input(
            z.object({
                days: z.coerce.number().min(1).max(365).default(30),
            })
        )
        .query(async ({ ctx, input: { days } }) => {
            const userId = ctx.session.user.id
            const since = new Date(
                Date.now() - days * 24 * 60 * 60 * 1000
            )

            const [activities, sleepRecords, workouts, measurements, lastSync] =
                await Promise.all([
                    ctx.prisma.withingsActivity.findMany({
                        where: { userId, date: { gte: since } },
                        orderBy: { date: 'asc' },
                    }),
                    ctx.prisma.withingsSleep.findMany({
                        where: { userId, date: { gte: since } },
                        orderBy: { date: 'asc' },
                    }),
                    ctx.prisma.withingsWorkout.findMany({
                        where: { userId, startDate: { gte: since } },
                        orderBy: { startDate: 'desc' },
                    }),
                    ctx.prisma.measurement.findMany({
                        where: { userId, source: 'withings', whenAdded: { gte: since } },
                        orderBy: { whenAdded: 'asc' },
                    }),
                    ctx.prisma.withingsSyncLog.findFirst({
                        where: { userId, status: 'ok' },
                        orderBy: { createdAt: 'desc' },
                        select: { createdAt: true },
                    }),
                ])

            return {
                activities,
                sleepRecords,
                workouts,
                measurements,
                lastSyncedAt: lastSync?.createdAt ?? null,
            }
        }),
})
