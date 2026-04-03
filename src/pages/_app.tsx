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
import { useLayoutEffect, useState } from 'react'

// Start reading SW cache immediately when JS loads — before React mounts
let _resolved: Session | null | undefined

const cachedSessionPromise =
    typeof window !== 'undefined' && 'caches' in window
        ? caches
              .match('/api/auth/session')
              .then((res) => res?.json())
              .then((data) => {
                  _resolved = data?.user ? data : null
                  return _resolved
              })
              .catch(() => {
                  _resolved = null
                  return null
              })
        : (() => {
              _resolved = null
              return Promise.resolve(null)
          })()

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session: sessionRaw, ...pageProps },
}) => {
    const [cachedSession, setCachedSession] = useState<Session | null>(
        () => _resolved ?? null
    )
    const [cacheChecked, setCacheChecked] = useState(
        () => _resolved !== undefined || typeof window === 'undefined'
    )

    useLayoutEffect(() => {
        if (cacheChecked) return
        cachedSessionPromise.then((data) => {
            if (data) setCachedSession(data)
            setCacheChecked(true)
        })
    }, [cacheChecked])

    const session = sessionRaw ?? cachedSession ?? undefined

    if (!session && !cacheChecked) return null

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
