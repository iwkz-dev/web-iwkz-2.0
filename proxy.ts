import { NextRequest, NextResponse } from 'next/server';

const locales = ['id', 'de-DE'];
const defaultLocale = 'id';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check cookie for saved locale preference
  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;

  // Determine which locale to use
  let locale = defaultLocale;
  if (savedLocale && locales.includes(savedLocale)) {
    locale = savedLocale;
  }

  // Skip middleware for API routes, static files, and Next.js internals
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/images/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // PayPal callbacks return to root paths configured in PayPal settings.
  // Redirect them to the localized donation page and keep query params.
  if (pathname === '/success' || pathname === '/cancel') {
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}/donation`;
    url.searchParams.set(
      'paypal_status',
      pathname === '/success' ? 'success' : 'cancel'
    );
    return NextResponse.redirect(url);
  }

  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  // If pathname already has locale, continue
  if (pathnameHasLocale) {
    return NextResponse.next();
  }

  // If pathname is root or doesn't have locale, redirect to locale path

  // Redirect to locale path
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images).*)',
  ],
};
