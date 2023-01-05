import Footer from './Footer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SidebarLeft from './SidebarLeft'
import SidebarRight from './SidebarRight'
import SidebarRightLoggouted from './SidebarRightLoggouted'
import styled from 'styled-components'
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

const Layout = ({ children }: { children: any }) => {
    const router = useRouter()
    const [isAllowedLocation, setIsAllowedLocation] = useState(false)
    const { data, status } = useSession()

    useEffect(() => {
        (async () => {
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

    // TODO do I need it?
    useEffect(() => {
        localStorage.setItem('asPath', router.asPath)
    }, [router.asPath])

    // TODO do I need it?
    useEffect(() => {
        const asPath = localStorage.getItem('asPath')
        if (asPath) {
            router.push(asPath)
        }
    }, [router])

    const isLoggoutedGrid = !data || notRequiredAuth.filter(route => route == router.pathname).length || router.pathname == '/'

    if (!isAllowedLocation || status === 'loading') {
        return null
    }

    return (
        <main>
            {router.pathname.includes('blog') || router.pathname == '/'
                ? <>{children}</>
                : <Grid>
                    <SidebarLeft />
                    <Content>{children}</Content>
                    {
                        isLoggoutedGrid
                            ? <SidebarRightLoggouted />
                            : <SidebarRight />
                    }
                </Grid>
            }
            <Footer />
        </main>
    )
}

export default Layout;