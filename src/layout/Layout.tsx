import Footer from './Footer'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import TopNavbar from './TopNavbar'
import { useSession } from 'next-auth/react'
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

const getCookie = (cookieName: string) => {
    let cookie: any = {}
    document.cookie.split(';').forEach(function (el) {
        let [key, value] = el.split('=')
        cookie[key.trim()] = value
    })
    const raw = cookie[cookieName]
    try {
        return raw ? decodeURIComponent(raw) : raw
    } catch {
        return raw
    }
}

const Layout = ({ children }: { children: any }) => {
    const router = useRouter()
    const isPublicPath = PUBLIC_PATHS.some(p => router.pathname === p || router.pathname.startsWith(p + '/'))
    const [isAllowedLocation, setIsAllowedLocation] = useState(() => isPublicPath)
    const { data: sessionData, status } = useSession()

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
        if (status === 'loading') {
            return
        }

        // Fallback: if middleware redirect didn't fire (e.g. client-side nav to "/")
        if (
            status === 'authenticated' &&
            router.pathname === SIGN_IN_PATH
        ) {
            const lastPath = getCookie('lastPath')
            router.push(lastPath && lastPath !== SIGN_IN_PATH ? lastPath : '/coach')
            return
        }

        setIsAllowedLocation(true)
    }, [status, router, sessionData])

    // Save current path as cookie so middleware can redirect instantly on next load
    useEffect(() => {
        if (
            router?.asPath &&
            router.asPath !== SIGN_IN_PATH &&
            !router.asPath.includes('callback') &&
            sessionData
        ) {
            const pathToSave = router.asPath.includes(
                `${sessionData?.user?.username}/consumed`
            )
                ? router.asPath.slice(0, router.asPath.length - 10) +
                      moment().format('YYYY-MM-DD')
                : router.asPath

            document.cookie = `lastPath=${encodeURIComponent(pathToSave)}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`
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
    const isLandingPage = router.pathname === SIGN_IN_PATH && status !== 'loading' && !sessionData?.user

    const isFullWidthPage = isLandingPage || isBlog

    return (
        <main className={`pb-safe dark container flex flex-col ${isFullWidthPage ? 'min-h-screen' : 'max-w-5xl h-screen'}`}>
            {status !== 'loading' && (
                isFullWidthPage ? (
                    <div className="mx-auto w-full max-w-5xl px-4">
                        <TopNavbar />
                    </div>
                ) : (
                    <TopNavbar />
                )
            )}
            <div className={`flex flex-1 ${isLandingPage ? '' : 'flex-row pt-4'} ${isFullWidthPage ? '' : 'px-4'}`}>
                <div className={`pb-safe mx-auto flex w-full min-w-0 items-stretch ${isFullWidthPage ? '' : 'max-w-3xl'}`}>
                    {status === 'loading' ? null : children}
                </div>
            </div>
            <Footer />
        </main>
    )
}

export default Layout
