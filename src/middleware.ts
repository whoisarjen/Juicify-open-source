import { NextRequest, NextResponse } from 'next/server'

const BLOG_ONLY_LOCALES = ['es', 'de', 'pt', 'fr', 'ko', 'ar', 'tr', 'ja', 'it']

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const locale = request.nextUrl.locale

    // Only intercept the 9 new locales (not en/pl)
    if (!locale || !BLOG_ONLY_LOCALES.includes(locale)) {
        return NextResponse.next()
    }

    // Allow blog routes for all 11 locales
    if (pathname.startsWith('/blog')) {
        return NextResponse.next()
    }

    // Allow API routes and static assets
    if (
        pathname.startsWith('/api') ||
        pathname.startsWith('/_next') ||
        pathname.includes('.')
    ) {
        return NextResponse.next()
    }

    // Redirect non-blog pages to English version
    const url = request.nextUrl.clone()
    url.locale = 'en'
    return NextResponse.redirect(url)
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
