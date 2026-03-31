import type { NextApiRequest, NextApiResponse } from 'next'
import { getServerAuthSession } from '@/server/common/get-server-auth-session'
import { exchangeCodeForTokens } from '@/server/withings/client'
import { prisma } from '@/server/db/client'
import { env } from '@/env/server.mjs'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse,
) {
    const session = await getServerAuthSession({ req, res })
    if (!session?.user) {
        return res.status(401).json({ error: 'Not authenticated' })
    }

    const code = req.query.code as string
    if (!code) {
        return res.status(400).json({ error: 'Missing authorization code' })
    }

    const redirectUri = `${env.NEXTAUTH_URL}/api/withings/callback`
    const tokens = await exchangeCodeForTokens(code, redirectUri)

    await prisma.account.upsert({
        where: {
            provider_providerAccountId: {
                provider: 'withings',
                providerAccountId: tokens.userid,
            },
        },
        update: {
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at:
                Math.floor(Date.now() / 1000) + tokens.expires_in,
            scope: tokens.scope,
            token_type: tokens.token_type,
        },
        create: {
            userId: (session.user as { id: number }).id,
            type: 'oauth',
            provider: 'withings',
            providerAccountId: tokens.userid,
            access_token: tokens.access_token,
            refresh_token: tokens.refresh_token,
            expires_at:
                Math.floor(Date.now() / 1000) + tokens.expires_in,
            scope: tokens.scope,
            token_type: tokens.token_type,
        },
    })

    res.redirect('/')
}
