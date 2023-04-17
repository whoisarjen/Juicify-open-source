import { env } from '@/env/client.mjs'
import Script from 'next/script'

const GOOGLE_ANALYTICS_ID = 'G-RTCFC3JGV2'

export const GoogleAnalytics = () => {
    if (env.NEXT_PUBLIC_NODE_ENV === 'production') {
        return (
            <>
                <Script
                    src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ANALYTICS_ID}`}
                    strategy="afterInteractive"
                />
                <Script id="google-analytics" strategy="afterInteractive">
                    {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){window.dataLayer.push(arguments);}
                    gtag('js', new Date());

                    gtag('config', ${GOOGLE_ANALYTICS_ID});
                `}
                </Script>
            </>
        )
    }

    return null
}
