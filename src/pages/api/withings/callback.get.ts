import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.send({
        code: 200,
        message: 'Withings callback received successfully',
    })
}
