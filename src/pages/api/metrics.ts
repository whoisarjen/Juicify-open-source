import type { NextApiRequest, NextApiResponse } from 'next'
import { register, collectDefaultMetrics } from "prom-client";

collectDefaultMetrics({ prefix: 'juicify' })

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.setHeader('Content-type', register.contentType)
    res.end(await register.metrics())
}
