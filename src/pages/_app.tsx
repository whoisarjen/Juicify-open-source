import "../styles/global.css"
import { store } from "../redux/store"
import { Provider } from "react-redux"
import Layout from "../layout/Layout"
import MUI from "../layout/MUI"
import ServiceWorker from "../layout/ServiceWorker"
import { trpc } from '../utils/trpc'
import { SessionProvider } from "next-auth/react"
import { type AppType } from 'next/app'
import { type Session } from "next-auth"

const App: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}) => {
    return (
        <MUI>
            <SessionProvider session={session}>
                <Provider store={store}>
                    <ServiceWorker>
                        <Layout>
                            <Component {...pageProps} />
                        </Layout>
                    </ServiceWorker>
                </Provider>
            </SessionProvider>
        </MUI>
    )
}

export default trpc.withTRPC(App)
