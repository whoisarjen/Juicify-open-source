import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@/env/server.mjs'
import { syncWithingsRange } from '@/server/withings/sync'
import { prisma } from '@/server/db/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (!env.CRON_SECRET) {
        return res.status(501).json({ error: 'Not configured' })
    }

    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const days = Math.min(Number(req.query.days) || 60, 365)

    const withingsAccounts = await prisma.account.findMany({
        where: { provider: 'withings' },
        select: { userId: true },
    })

    const results = []
    for (const account of withingsAccounts) {
        try {
            await syncWithingsRange(account.userId, days)
            results.push({ userId: account.userId, days, status: 'ok' })
        } catch (error) {
            console.error(
                `Withings backfill failed for user ${account.userId}:`,
                error,
            )
            results.push({
                userId: account.userId,
                status: 'error',
                message:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',
            })
        }
    }

    return res.status(200).json({ results })
}
