import Footer from './Footer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SidebarLeft from './SidebarLeft'
import SidebarRight from './SidebarRight'
import styled from 'styled-components'
import { useSession, signOut } from 'next-auth/react'
import { DialogMissingSettings } from '@/components/DialogMissingSettings'
import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation'
import moment from 'moment'

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
    min-height: calc(calc(100vh - env(safe-area-inset-bottom)) - var(--BothNavHeightAndPadding));
    padding-bottom: env(safe-area-inset-bottom);
    @media (max-width: 726px) {
        width: calc(100% - 24px);
    }
`

const SignInFloatingButton = styled.div`
    width: 100%;
    max-width: 702px;
    position: fixed;
    bottom: 90px;
    left: 50%;
    transform: translate(-50%, 0);
    ${this} > div {
        margin: 0 16px;
        width: calc(100% - 32px);
    }
`

const SIGN_IN_PATH = '/'

const REQUIRED_AUTH_PATHS = [
    '/workout',
    '/statistics',
    '/barcode',
    '/coach',
    '/macronutrients',
    '/measurements',
    '/settings',
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
    const { t } = useTranslation('home')
    const router = useRouter()
    const [isAllowedLocation, setIsAllowedLocation] = useState(false)
    const { data: sessionData, status } = useSession()

    useEffect(() => {
        (async () => {
            const locale = await getCookie('NEXT_LOCALE') // Redirect for PWA's scope

            if (locale && router.locale != locale) {
                router.push(router.asPath, router.asPath, { locale });
                return
            }

            if (status === 'loading') {
                return
            }

            if (status === 'unauthenticated' && REQUIRED_AUTH_PATHS.includes(router.pathname)) {
                router.push(SIGN_IN_PATH)
                return
            }

            if (status === 'authenticated' && router.pathname === SIGN_IN_PATH) {
                const asPath = localStorage.getItem('asPath')
                const redirectTo = asPath && asPath !== SIGN_IN_PATH ? asPath : '/coach'
                router.push(redirectTo)
                return
            }

            setIsAllowedLocation(true)
        })()
    }, [status, router])

    useEffect(() => {
        if (router?.asPath && router.asPath !== SIGN_IN_PATH && !router.asPath.includes('callback')) {
            localStorage.setItem('asPath', router.asPath.includes(`${sessionData?.user?.username}/consumed`)
                ? router.asPath.slice(0, router.asPath.length - 10) + moment().format('YYYY-MM-DD')
                : router.asPath
            )
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [router?.asPath])

    useEffect(() => {
        if (sessionData?.user?.isBanned) {
            signOut({ callbackUrl: SIGN_IN_PATH })
            return
        }
    }, [router, sessionData?.user?.isBanned])

    if (!isAllowedLocation) {
        return null
    }

    const isNeutralPath = router.pathname.includes('blog') || router.pathname === SIGN_IN_PATH

    return (
        <main>
            <Grid>
                <SidebarLeft />
                <Content>{children}</Content>
                <SidebarRight />
                <Footer />
                {!sessionData?.user && !isNeutralPath &&
                    <SignInFloatingButton>
                        <Button
                            component="div"
                            color="primary"
                            variant="contained"
                            aria-label="authorization"
                            onClick={() => router.push(SIGN_IN_PATH)}
                        >
                            {t('I_ALSO_WANT_TO_CHANGE_MY_BODY')}
                        </Button>
                    </SignInFloatingButton>
                }
            </Grid>
            {sessionData?.user?.height === 0 && <DialogMissingSettings />}
        </main>
    )
}

export default Layout;