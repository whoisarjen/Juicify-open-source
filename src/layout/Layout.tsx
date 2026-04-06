import Footer from './Footer'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'
import TopNavbar from './TopNavbar'
import { useSession } from 'next-auth/react'
import { DialogMissingSettings } from '@/components/DialogMissingSettings'
import FullPageError from '@/components/FullPageError'
import moment from 'moment'
import { trpc } from '@/utils/trpc.utils'
import { handleSignOut } from '@/utils/user.utils'

const SIGN_IN_PATH = '/'

const PUBLIC_PATHS = [
    '/',
    '/blog',
    '/401',
    '/403',
    '/404',
    '/_offline',
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
    const router = useRouter()
    const isPublicPath = PUBLIC_PATHS.some(p => router.pathname === p || router.pathname.startsWith(p + '/'))
    const [isAllowedLocation, setIsAllowedLocation] = useState(() => isPublicPath)
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

    if (status !== 'loading' && !isPublicPath) {
        if (status === 'unauthenticated') {
            return <FullPageError code={401} message="You need to sign in to access this page" />
        }

        if (router.query.login && router.query.login !== sessionData?.user?.username) {
            return <FullPageError code={403} message="You don't have permission to access this page" />
        }
    }

    const isBlog = router.pathname.includes('blog')
    const isNeutralPath = isBlog || router.pathname === SIGN_IN_PATH
    const isLandingPage = router.pathname === SIGN_IN_PATH && status !== 'loading' && !sessionData?.user

    return (
        <main className={`pb-safe dark container flex max-w-5xl flex-col ${isLandingPage ? 'min-h-screen' : 'h-screen'}`}>
            {status !== 'loading' && !isLandingPage && <TopNavbar />}
            <div className={`flex flex-1 ${isLandingPage ? '' : 'flex-row pt-4'} px-4`}>
                <div className="pb-safe mx-auto flex w-full max-w-3xl min-w-0 items-stretch">
                    {status === 'loading' ? null : children}
                </div>
            </div>
            {!isLandingPage && <Footer />}
            {sessionData?.user?.height === 0 && !skippedSettings && (
                <DialogMissingSettings onSkip={handleSkipMissingSettings} />
            )}
        </main>
    )
}

export default Layout
