import "../global.css";
import 'react-toastify/dist/ReactToastify.css';
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Layout from "../layout/Layout";
import MUI from "../layout/MUI";
import Notify from "../layout/Notify";
import URQL from "../layout/URQL";
import ServiceWorker from "layout/ServiceWorker";
import type { AppType } from 'next/app';
import { trpc } from '../utils/trpc';
import { SessionProvider } from "next-auth/react"

interface AppProps {
    Component: any
    pageProps: any
}

const App: AppType = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) => {
    return (
        <MUI>
            <Notify>
                <SessionProvider session={session}>
                    <Provider store={store}>
                        <URQL>
                            <ServiceWorker>
                                <Layout>
                                    <Component {...pageProps} />
                                </Layout>
                            </ServiceWorker>
                        </URQL>
                    </Provider>
                </SessionProvider>
            </Notify>
        </MUI>
    );
}

export default trpc.withTRPC(App);
