import type { NextApiRequest, NextApiResponse } from "next";

const manifest = {
    "theme_color": "#121212",
    "background_color": "#121212",
    "display": "standalone",
    "scope": "/",
    "start_url": "/coach",
    "name": "Juicify",
    "short_name": "Juicify",
    "icons": [
        {
            "src": "/icons/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "/icons/manifest-icon-192.maskable.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable"
        },
        {
            "src": "/icons/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "any"
        },
        {
            "src": "/icons/manifest-icon-512.maskable.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable"
        }
    ]
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    res.send(manifest)
}
