import Footer from './Footer'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import SidebarLeft from './SidebarLeft'
import SidebarRight from './SidebarRight'
import SidebarRightLoggouted from './SidebarRightLoggouted'
import styled from 'styled-components'
import { useSession, signOut } from 'next-auth/react'
import { DialogMissingSettings } from '@/components/DialogMissingSettings'
import Button from '@mui/material/Button';
import useTranslation from 'next-translate/useTranslation'

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

export const SIGN_IN_PATH = '/'

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
    const { data: sessionData } = useSession()

    // useEffect(() => {
    //     (async () => {
    //         const locale = await getCookie('NEXT_LOCALE') // Redirect for PWA's scope

    //         if (locale && router.locale != locale) {
    //             router.push(router.asPath, router.asPath, { locale });
    //             return
    //         }
    //     })()
    // }, [status, router])

    useEffect(() => {
        if (sessionData?.user?.isBanned) {
            signOut({ callbackUrl: SIGN_IN_PATH })
            return
        }
    }, [router, sessionData?.user?.isBanned])

    const isLoggoutedGrid = !sessionData || router.pathname === SIGN_IN_PATH

    return (
        <main>
            {router.pathname.includes('blog') || router.pathname === SIGN_IN_PATH
                ? <>{children}</>
                : <Grid>
                    <SidebarLeft />
                    <Content>{children}</Content>
                    {isLoggoutedGrid
                        ? <SidebarRightLoggouted />
                        : <SidebarRight />
                    }
                    <Footer />
                    {!sessionData?.user &&
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
            }
            {sessionData?.user?.height === 0 && <DialogMissingSettings />}
        </main>
    )
}

export default Layout;