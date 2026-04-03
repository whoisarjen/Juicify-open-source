import '../styles/global.css'
import Layout from '../layout/Layout'
import MUI from '../layout/MUI'
import Header from '../layout/Header'
import { trpc } from '@/utils/trpc.utils'
import { SessionProvider, useSession } from 'next-auth/react'
import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { GoogleAnalytics } from 'src/layout/GoogleAnalytics'
import ErrorBoundary from '@/components/ErrorBoundary'
import { type ReactNode, useEffect, useState } from 'react'

const SESSION_CACHE_KEY = 'juicify-session'

function SessionCacheSync({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession()

    useEffect(() => {
        if (status === 'authenticated' && session) {
            localStorage.setItem(SESSION_CACHE_KEY, JSON.stringify(session))
        } else if (status === 'unauthenticated') {
            localStorage.removeItem(SESSION_CACHE_KEY)
        }
    }, [session, status])

    return <>{children}</>
}

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    const [initialSession] = useState<Session | null>(() => {
        if (session) return session
        if (typeof window === 'undefined') return null
        try {
            const raw = localStorage.getItem(SESSION_CACHE_KEY)
            return raw ? JSON.parse(raw) : null
        } catch {
            return null
        }
    })

    return (
        <ErrorBoundary>
            <MUI>
                <Header />
                <GoogleAnalytics />
                <SessionProvider
                    session={initialSession}
                    refetchInterval={5 * 60}
                    refetchOnWindowFocus={true}
                >
                    <SessionCacheSync>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </SessionCacheSync>
                </SessionProvider>
            </MUI>
        </ErrorBoundary>
    )
}

export default trpc.withTRPC(App)
