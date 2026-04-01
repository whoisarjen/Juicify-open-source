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
        let status: 'ok' | 'error' = 'ok'
        let message: string | null = null

        try {
            await syncWithingsData(account.userId)
        } catch (error) {
            console.error(
                `Withings sync failed for user ${account.userId}:`,
                error,
            )
            status = 'error'
            message =
                error instanceof Error
                    ? error.message
                    : 'Unknown error'
        }

        await prisma.withingsSyncLog.create({
            data: {
                userId: account.userId,
                status,
                message,
            },
        })

        results.push({ userId: account.userId, status, message })
    }

    return res.status(200).json({ results })
}
