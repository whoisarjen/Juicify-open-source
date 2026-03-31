import { z } from 'zod'
import { router, protectedProcedure } from '../trpc'

export const withingsRouter = router({
    dashboard: protectedProcedure
        .input(
            z.object({
                days: z.number().min(1).max(365).default(30),
            })
        )
        .query(async ({ ctx, input: { days } }) => {
            const userId = ctx.session.user.id
            const since = new Date(
                Date.now() - days * 24 * 60 * 60 * 1000
            )

            const [activities, sleepRecords, workouts, measurements] =
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
                ])

            return { activities, sleepRecords, workouts, measurements }
        }),
    latestDaily: protectedProcedure.query(async ({ ctx }) => {
        const userId = ctx.session.user.id

        const [activity, sleep] = await Promise.all([
            ctx.prisma.withingsActivity.findFirst({
                where: { userId },
                orderBy: { date: 'desc' },
            }),
            ctx.prisma.withingsSleep.findFirst({
                where: { userId },
                orderBy: { date: 'desc' },
            }),
        ])

        return { activity, sleep }
    }),
})
