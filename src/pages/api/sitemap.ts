import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from "@prisma/client"
import { env } from '@/env/server.mjs'

const prisma = new PrismaClient()

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const users = await prisma.user.findMany()

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-control', 'stale-while-revalidate, s-maxage=3600')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"> 
        <url>
            ${users.map(({ username }) => `<loc>${`${env.NEXTAUTH_URL}/${username}`}</loc>`)}
        </url>
        </urlset>
    `

    res.end(xml)
}
