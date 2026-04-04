import Footer from './Footer'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import SidebarLeft from './SidebarLeft'
import { useSession } from 'next-auth/react'
import { DialogMissingSettings } from '@/components/DialogMissingSettings'
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
    '/supplements',
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
    const [isAllowedLocation, setIsAllowedLocation] = useState(
        () => !REQUIRED_AUTH_PATHS.includes(router.pathname)
    )
    const [skippedSettings, setSkippedSettings] = useState(false)
    const { data: sessionData, status } = useSession()

    useEffect(() => {
        if (localStorage.getItem('skipMissingSettings') === 'true') {
            setSkippedSettings(true)
        }
    }, [])

    const handleSkipMissingSettings = useCallback(() => {
        localStorage.setItem('skipMissingSettings', 'true')
        setSkippedSettings(true)
    }, [])

    const { data: versionData } = trpc.version.get.useQuery(undefined, {
        enabled: typeof window !== 'undefined' && !!process.env.isProduction,
    })

    useEffect(() => {
        if (versionData && localStorage.getItem('version') !== versionData) {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker
                    .getRegistrations()
                    .then(function (registrations) {
                        for (let registration of registrations) {
                            registration
                                .unregister()
                                .then(() => {
                                    localStorage.setItem('version', versionData)
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
    }, [versionData])

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
    const isLandingPage = router.pathname === SIGN_IN_PATH && status !== 'loading' && !sessionData?.user

    return (
        <main className={`pb-safe dark container flex max-w-5xl flex-col ${isLandingPage ? 'min-h-screen' : 'h-screen'}`}>
            <div className={`flex flex-1 ${isLandingPage ? '' : 'flex-row gap-4'} p-4`}>
                {status !== 'loading' && !isLandingPage && (
                    <div className="relative max-xl:hidden w-52 shrink-0">
                        <SidebarLeft />
                    </div>
                )}
                <div className="pb-safe flex flex-[1.618_1_0%] min-w-0 items-stretch">
                    {status === 'loading' ? null : children}
                </div>
            </div>
            {!isLandingPage && <Footer />}
            {status === 'unauthenticated' && !isNeutralPath && (
                <div className="fixed bottom-24 left-0 flex w-full items-center justify-center">
                    <button
                        className="rounded bg-primary-dark px-4 py-2 text-[#121212] hover:bg-[#64b5f6] disabled:opacity-50"
                        aria-label="authorization"
                        onClick={() => router.push(SIGN_IN_PATH)}
                    >
                        {t('I_ALSO_WANT_TO_CHANGE_MY_BODY')}
                    </button>
                </div>
            )}
            {sessionData?.user?.height === 0 && !skippedSettings && (
                <DialogMissingSettings onSkip={handleSkipMissingSettings} />
            )}
        </main>
    )
}

export default Layout
