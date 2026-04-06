import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BLOG_ONLY_LOCALES = ['es', 'de', 'pt', 'fr', 'ko', 'ar', 'tr', 'ja', 'it']

const getSessionCookie = (request: NextRequest) =>
    request.cookies.get('__Secure-next-auth.session-token')?.value ??
    request.cookies.get('next-auth.session-token')?.value

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const locale = request.nextUrl.locale

    // Authenticated user landing on "/" → instant redirect to last page
    if (pathname === '/' && getSessionCookie(request)) {
        const raw = request.cookies.get('lastPath')?.value
        if (raw && raw !== '/' && raw !== '%2F') {
            let lastPath = decodeURIComponent(raw)

            // Update consumed diary date to today (path ends with /YYYY-MM-DD)
            if (lastPath.includes('/consumed/')) {
                lastPath = lastPath.replace(
                    /\/consumed\/\d{4}-\d{2}-\d{2}$/,
                    `/consumed/${new Date().toISOString().slice(0, 10)}`
                )
            }

            const url = request.nextUrl.clone()
            url.pathname = lastPath
            return NextResponse.redirect(url)
        }
    }

    // PWA scope locale: if NEXT_LOCALE cookie differs from request locale, redirect
    const preferredLocale = request.cookies.get('NEXT_LOCALE')?.value
    if (
        preferredLocale &&
        preferredLocale !== locale &&
        !pathname.startsWith('/api') &&
        !pathname.startsWith('/_next') &&
        !pathname.includes('.')
    ) {
        const url = request.nextUrl.clone()
        url.locale = preferredLocale
        return NextResponse.redirect(url)
    }

    // Redirect blog-only locales away from non-blog pages
    if (locale && BLOG_ONLY_LOCALES.includes(locale)) {
        if (
            !pathname.startsWith('/blog') &&
            !pathname.startsWith('/api') &&
            !pathname.startsWith('/_next') &&
            !pathname.includes('.')
        ) {
            const url = request.nextUrl.clone()
            url.locale = 'en'
            return NextResponse.redirect(url)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
