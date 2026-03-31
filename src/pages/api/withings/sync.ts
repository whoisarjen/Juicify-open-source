import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@/env/server.mjs'
import { syncWithingsData } from '@/server/withings/sync'
import { prisma } from '@/server/db/client'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    if (!env.CRON_SECRET) {
        return res.status(501).json({ error: 'Cron not configured' })
    }

    const authHeader = req.headers.authorization
    if (authHeader !== `Bearer ${env.CRON_SECRET}`) {
        return res.status(401).json({ error: 'Unauthorized' })
    }

    const withingsAccounts = await prisma.account.findMany({
        where: { provider: 'withings' },
        select: { userId: true },
    })

    const results = []
    for (const account of withingsAccounts) {
        try {
            await syncWithingsData(account.userId)
            results.push({ userId: account.userId, status: 'ok' })
        } catch (error) {
            console.error(
                `Withings sync failed for user ${account.userId}:`,
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
