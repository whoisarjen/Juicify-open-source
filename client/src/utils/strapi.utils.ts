import { env } from '@/env/server.mjs'

export const getFromStrapi = async (where: string) => {
    const response = await fetch(`${env.NEXT_PUBLIC_STRAPI_URL}/api/${where}?populate=*`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${env.NEXT_PUBLIC_API_TOKEN}`,
        },
    })

    return await response.json()
}
