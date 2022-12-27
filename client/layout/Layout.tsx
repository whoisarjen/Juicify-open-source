import Footer from './Footer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SidebarLeft from './SidebarLeft'
import SidebarRight from './SidebarRight'
import SidebarRightLoggouted from './SidebarRightLoggouted'
import SidebarLeftLoggouted from './SidebarLeftLoggouted'
import styled from 'styled-components'
import DialogAddProducts from '@/containers/DialogAddProducts/DialogAddProducts'
import DialogEditConsumed from '@/containers/DialogEditConsumed/DialogEditConsumed'
import DialogShowProduct from '@/containers/DialogShowProduct/DialogShowProduct'
import DialogAddProduct from '@/containers/DialogAddProduct/DialogAddProduct'
import moment from 'moment'
import { useSession } from 'next-auth/react'

const Grid = styled.div`
    margin: auto;
    display: grid;
    width: 100%;
    max-width: 1226px;
    grid-template-columns: 250px 726px 250px;
    @media (max-width: 1468px) {
        max-width: 976px;
        grid-template-columns: 726px 250px;
    }
    @media (max-width: 1105px) {
        max-width: 726px;
        grid-template-columns: 726px;
    }
    @media (max-width: 726px) {
        max-width: 100%;
        grid-template-columns: 1fr;
    }
`

const Content = styled.div`
    width: 100%;
    margin: 0 auto;
    max-width: 702px;
    padding: 12px;
    display: grid;
    min-height: calc(calc(100vh - calc(env(safe-area-inset-bottom) * 2)) - var(--BothNavHeightAndPadding));
    padding-bottom: env(safe-area-inset-bottom);
    @media (max-width: 726px) {
        width: calc(100% - 24px);
    }
`

const requiredAuth = [
    '',
    '/settings',
    '/workout',
    '/statistics',
    '/macronutrients',
    '/coach',
    '/barcode'
]

const notRequiredAuth = [
    '/',
    '/login',
    '/register',
    '/reset-password'
]

const getCookie = async (cookieName: string) => {
    let cookie: any = {};
    document.cookie.split(';').forEach(function (el) {
        let [key, value] = el.split('=');
        cookie[key.trim()] = value;
    })
    return cookie[cookieName];
}

const isBrowserValid = async () => {
    let agent: any = { browser: { name: null, version: null, v: null, userAgent: null, app: null } };
    let nAgt: any = navigator.userAgent;
    let browserName: any = navigator.appName;
    let fullVersion: any = '' + parseFloat(navigator.appVersion);
    let majorVersion: any = parseInt(navigator.appVersion, 10);
    let nameOffset, verOffset;
    if ((verOffset = nAgt.indexOf("Opera")) != -1) {
        browserName = "Opera";
        fullVersion = nAgt.substring(verOffset + 6);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
        browserName = "Microsoft Internet Explorer";
        fullVersion = nAgt.substring(verOffset + 5);
    }
    else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
        browserName = "Chrome";
        fullVersion = nAgt.substring(verOffset + 7);
    }
    else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
        browserName = "Safari";
        fullVersion = nAgt.substring(verOffset + 7);
        if ((verOffset = nAgt.indexOf("Version")) != -1)
            fullVersion = nAgt.substring(verOffset + 8);
    }
    else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
        browserName = "Firefox";
        fullVersion = nAgt.substring(verOffset + 8);
    }
    else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
        browserName = nAgt.substring(nameOffset, verOffset);
        fullVersion = nAgt.substring(verOffset + 1);
        if (browserName.toLowerCase() == browserName.toUpperCase()) {
            browserName = navigator.appName;
        }
    }
    majorVersion = parseInt('' + fullVersion, 10);
    if (isNaN(majorVersion)) {
        fullVersion = '' + parseFloat(navigator.appVersion);
        majorVersion = parseInt(navigator.appVersion, 10);
    }
    agent.browser.name = browserName;
    agent.browser.version = fullVersion;
    agent.browser.v = majorVersion;
    agent.browser.app = navigator.appName;
    agent.browser.userAgent = navigator.userAgent;
    if (agent.browser.name == "Microsoft Internet Explorer" && parseInt(agent.browser.v) < 100) return false // Not supporting IE
    if (agent.browser.name == "Chrome" && parseInt(agent.browser.v) < 4) return false
    if (agent.browser.name == "Firefox" && parseInt(agent.browser.v) < 11) return false
    if (agent.browser.name == "Opera" && parseInt(agent.browser.v) < 13) return false
    if (agent.browser.name == "Safari" && parseInt(agent.browser.v) < 5) return false
    return true;
}

const Layout = ({ children }: { children: any }) => {
    const router = useRouter()
    const [isAllowedLocation, setIsAllowedLocation] = useState(false)
    const { data } = useSession()

    useEffect(() => {
        (async () => {
            if (!(await isBrowserValid()) && router.pathname != '/not-supported') {
                return router.push('/not-supported')
            }

            const locale = await getCookie('NEXT_LOCALE') // Redirect for PWA's scope
            if (locale && router.locale != locale) {
                return router.push(router.asPath, router.asPath, { locale });
            }

            if (data?.user?.username && notRequiredAuth.includes(router.pathname)) {
                router.push(`/${data.user.username}/consumed/${moment().format('YYYY-MM-DD')}`);
            } else if (!data && requiredAuth.includes(router.pathname)) {
                router.push('/')
            } else {
                setIsAllowedLocation(true)
            }
        })()
    }, [router, data])

    const isLoggoutedGrid = !data || notRequiredAuth.filter(route => route == router.pathname).length || router.pathname == '/'

    return (
        <main>
            {isAllowedLocation &&
                <>
                    {router.pathname.includes('blog') || router.pathname == '/'
                        ? <>{children}</>
                        : <Grid>
                            {
                                isLoggoutedGrid
                                    ? <SidebarLeftLoggouted />
                                    : <SidebarLeft />
                            }
                            <Content>{children}</Content>
                            {
                                isLoggoutedGrid
                                    ? <SidebarRightLoggouted />
                                    : <SidebarRight />
                            }
                        </Grid>
                    }
                    <Footer />
                    {data &&
                        <>
                            <DialogAddProducts />
                            <DialogEditConsumed />
                            <DialogShowProduct>
                                <DialogAddProduct />
                            </DialogShowProduct>
                        </>
                    }
                </>
            }
        </main>
    )
}

export default Layout;