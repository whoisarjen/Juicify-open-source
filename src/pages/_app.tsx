import '../styles/global.css'
import Layout from '../layout/Layout'
import MUI from '../layout/MUI'
import Header from '../layout/Header'
import { trpc } from '@/utils/trpc.utils'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { GoogleAnalytics } from 'src/layout/GoogleAnalytics'
import ErrorBoundary from '@/components/ErrorBoundary'
import { useState } from 'react'

// Start reading SW cache immediately when JS loads — before React mounts
let _resolved: Session | null | undefined

if (typeof window !== 'undefined' && 'caches' in window) {
    caches
        .match('/api/auth/session')
        .then((res) => res?.json())
        .then((data) => {
            _resolved = data?.user ? data : null
        })
        .catch(() => {
            _resolved = null
        })
} else {
    _resolved = null
}

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session: sessionRaw, ...pageProps },
}) => {
    const [cachedSession] = useState(() => _resolved ?? null)

    const session = sessionRaw ?? cachedSession ?? undefined

    return (
        <ErrorBoundary>
            <MUI>
                <Header />
                <GoogleAnalytics />
                <SessionProvider session={session} refetchInterval={5 * 60}>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SessionProvider>
            </MUI>
        </ErrorBoundary>
    )
}

export default trpc.withTRPC(App)
