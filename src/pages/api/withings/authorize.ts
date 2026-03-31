import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@/env/server.mjs'

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
    if (!env.WITHINGS_CLIENT_ID) {
        return res.status(501).json({ error: 'Withings integration not configured' })
    }

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: env.WITHINGS_CLIENT_ID,
        redirect_uri: `${env.NEXTAUTH_URL}/api/withings/callback`,
        scope: 'user.metrics,user.activity,user.sleepevents',
        state: 'withings_oauth',
    })

    res.redirect(
        `https://account.withings.com/oauth2_user/authorize2?${params.toString()}`,
    )
}
