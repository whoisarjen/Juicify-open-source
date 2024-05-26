import '../styles/global.css'
import Layout from '../layout/Layout'
import MUI from '../layout/MUI'
import Header from '../layout/Header'
import { trpc } from '@/utils/trpc.utils'
import { SessionProvider } from 'next-auth/react'
import { type AppType } from 'next/app'
import { type Session } from 'next-auth'
import { GoogleAnalytics } from 'src/layout/GoogleAnalytics'

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <MUI>
            <Header />
            <GoogleAnalytics />
            <SessionProvider session={session}>
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            </SessionProvider>
        </MUI>
    )
}

export default trpc.withTRPC(App)
