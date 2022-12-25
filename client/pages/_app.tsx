import "../global.css";
import 'react-toastify/dist/ReactToastify.css';
import { store } from "../redux/store";
import { Provider } from "react-redux";
import Layout from "../layout/Layout";
import MUI from "../layout/MUI";
import Notify from "../layout/Notify";
import URQL from "../layout/URQL";
import ServiceWorker from "layout/ServiceWorker";

interface AppProps {
    Component: any
    pageProps: any
}

const App = ({ Component, pageProps }: AppProps) => {
    return (
        <MUI>
            <Notify>
                <Provider store={store}>
                    <URQL>
                        <ServiceWorker>
                            <Layout>
                                <Component {...pageProps} />
                            </Layout>
                        </ServiceWorker>
                    </URQL>
                </Provider>
            </Notify>
        </MUI>
    );
}

export default App;
