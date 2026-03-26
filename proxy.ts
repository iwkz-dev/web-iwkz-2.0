import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const savedLocale = request.cookies.get('NEXT_LOCALE')?.value;
  const locale = routing.locales.includes(
    savedLocale as (typeof routing.locales)[number]
  )
    ? savedLocale
    : routing.defaultLocale;

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

  return handleI18nRouting(request);
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
