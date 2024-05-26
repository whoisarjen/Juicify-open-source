import Footer from './Footer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import SidebarLeft from './SidebarLeft'
import SidebarRight from './SidebarRight'
import { useSession } from 'next-auth/react'
import { DialogMissingSettings } from '@/components/DialogMissingSettings'
import Button from '@mui/material/Button'
import useTranslation from 'next-translate/useTranslation'
import moment from 'moment'
import { trpc } from '@/utils/trpc.utils'
import { handleSignOut } from '@/utils/user.utils'

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
    let cookie: any = {}
    document.cookie.split(';').forEach(function (el) {
        let [key, value] = el.split('=')
        cookie[key.trim()] = value
    })
    return cookie[cookieName]
}

const Layout = ({ children }: { children: any }) => {
    const { t } = useTranslation('home')
    const router = useRouter()
    const [isAllowedLocation, setIsAllowedLocation] = useState(false)
    const { data: sessionData, status } = useSession()

    trpc.version.get.useQuery(undefined, {
        enabled: typeof window !== 'undefined' && !!process.env.isProduction,
        onSuccess(data) {
            if (localStorage.getItem('version') !== data) {
                if ('serviceWorker' in navigator) {
                    navigator.serviceWorker
                        .getRegistrations()
                        .then(function (registrations) {
                            for (let registration of registrations) {
                                registration
                                    .unregister()
                                    .then(() => {
                                        localStorage.setItem('version', data)
                                    })
                                    .finally(() => {
                                        window.location.reload()
                                    })
                            }
                        })
                        .catch(function (err) {
                            console.error(
                                'Service Worker registration failed: ',
                                err
                            )
                        })
                }
            }
        },
    })

    useEffect(() => {
        (async () => {
            const locale = await getCookie('NEXT_LOCALE') // Redirect for PWA's scope

            if (locale && router.locale != locale) {
                router.push(router.asPath, router.asPath, { locale })
                return
            }

            if (status === 'loading') {
                return
            }

            if (
                status === 'unauthenticated' &&
                REQUIRED_AUTH_PATHS.includes(router.pathname)
            ) {
                router.push(SIGN_IN_PATH)
                return
            }

            if (
                status === 'authenticated' &&
                router.pathname === SIGN_IN_PATH
            ) {
                const asPath = localStorage.getItem('asPath')

                if (asPath?.includes('consumed') && sessionData.user && asPath.includes(sessionData.user.username)) {
                    router.push(asPath.slice(0, asPath.length - 10) + moment().format('YYYY-MM-DD'))
                    return
                }

                router.push(asPath && asPath !== SIGN_IN_PATH ? asPath : '/coach')
                return
            }

            setIsAllowedLocation(true)
        })()
    }, [status, router, sessionData])

    useEffect(() => {
        if (
            router?.asPath &&
            router.asPath !== SIGN_IN_PATH &&
            !router.asPath.includes('callback') &&
            sessionData
        ) {
            localStorage.setItem(
                'asPath',
                router.asPath.includes(
                    `${sessionData?.user?.username}/consumed`
                )
                    ? router.asPath.slice(0, router.asPath.length - 10) +
                          moment().format('YYYY-MM-DD')
                    : router.asPath
            )
        }
    }, [router.asPath, sessionData])

    useEffect(() => {
        if (sessionData?.user?.isBanned) {
            handleSignOut()
        }
    }, [router, sessionData?.user?.isBanned])

    if (!isAllowedLocation) {
        return null
    }

    const isBlog = router.pathname.includes('blog')
    const isNeutralPath = isBlog || router.pathname === SIGN_IN_PATH

    const isSidebarGrid = !isBlog

    return (
        <main className="pb-safe dark container flex h-screen max-w-7xl flex-col">
            <div className="flex flex-1 flex-row gap-4 p-4">
                <div className="relative w-64 max-xl:hidden">
                    <SidebarLeft />
                </div>
                <div className="pb-safe flex flex-1 items-stretch">{children}</div>
                {isSidebarGrid && (
                    <div className="w-64 max-lg:hidden">
                        <SidebarRight />
                    </div>
                )}
            </div>
            <Footer />
            {!sessionData?.user && !isNeutralPath && (
                <div className="fixed bottom-24 left-0 flex w-full items-center justify-center">
                    <Button
                        component="div"
                        color="primary"
                        variant="contained"
                        aria-label="authorization"
                        onClick={() => router.push(SIGN_IN_PATH)}
                    >
                        {t('I_ALSO_WANT_TO_CHANGE_MY_BODY')}
                    </Button>
                </div>
            )}
            {sessionData?.user?.height === 0 && <DialogMissingSettings />}
        </main>
    )
}

export default Layout
