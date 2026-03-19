import type { NextApiRequest, NextApiResponse } from 'next'
import { env } from '@/env/server.mjs'
import { prisma } from '../../server/db/client'

const LOCALES = ['en', 'pl', 'es', 'de', 'pt', 'fr', 'ko', 'ar', 'tr', 'ja', 'it']

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const [users, articles] = await Promise.all([
        prisma.user.findMany({
            select: { username: true },
        }),
        prisma.article.findMany({
            where: { isPublished: true },
            select: { slug: true, updatedAt: true },
            orderBy: { publishedAt: 'desc' },
        }),
    ])

    res.statusCode = 200
    res.setHeader('Content-Type', 'text/xml')
    res.setHeader('Cache-control', 'stale-while-revalidate, s-maxage=3600')

    const baseUrl = env.NEXTAUTH_URL

    const userUrls = users
        .map(({ username }) => `<url><loc>${baseUrl}/${username}</loc></url>`)
        .join('')

    const articleUrls = articles
        .map(({ slug, updatedAt }) => {
            const hreflangs = LOCALES.map((locale) => {
                const prefix = locale === 'en' ? '' : `/${locale}`
                return `<xhtml:link rel="alternate" hreflang="${locale}" href="${baseUrl}${prefix}/blog/${slug}"/>`
            }).join('')

            const xDefault = `<xhtml:link rel="alternate" hreflang="x-default" href="${baseUrl}/blog/${slug}"/>`
            const lastmod = updatedAt ? `<lastmod>${updatedAt.toISOString()}</lastmod>` : ''

            return `<url><loc>${baseUrl}/blog/${slug}</loc>${lastmod}${hreflangs}${xDefault}</url>`
        })
        .join('')

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
                xmlns:xhtml="http://www.w3.org/1999/xhtml">
        ${userUrls}
        ${articleUrls}
        </urlset>
    `

    res.end(xml)
}
