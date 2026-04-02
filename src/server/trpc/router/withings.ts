import { z } from 'zod'
import moment from 'moment'
import { router, protectedProcedure } from '../trpc'

export const withingsRouter = router({
    dayStats: protectedProcedure
        .input(z.object({ date: z.string() }))
        .query(async ({ ctx, input: { date } }) => {
            const userId = ctx.session.user.id
            const dayStart = moment(date, 'YYYY-MM-DD').startOf('day').toDate()
            const dayEnd = moment(date, 'YYYY-MM-DD').endOf('day').toDate()

            const [activity, sleep] = await Promise.all([
                ctx.prisma.withingsActivity.findFirst({
                    where: { userId, date: { gte: dayStart, lte: dayEnd } },
                }),
                ctx.prisma.withingsSleep.findFirst({
                    where: { userId, date: { gte: dayStart, lte: dayEnd } },
                }),
            ])

            if (!activity && !sleep) return null

            return {
                steps: activity?.steps ?? null,
                totalCalories: activity ? Math.round(Number(activity.totalCalories)) : null,
                activeCalories: activity ? Math.round(Number(activity.activeCalories)) : null,
                totalSleepTime: sleep?.totalSleepTime ?? null,
                sleepScore: sleep?.sleepScore ?? null,
                hrAverage: sleep?.hrAverage ?? null,
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
