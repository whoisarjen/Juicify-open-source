import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const BLOG_ONLY_LOCALES = ['es', 'de', 'pt', 'fr', 'ko', 'ar', 'tr', 'ja', 'it']

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const locale = request.nextUrl.locale

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
