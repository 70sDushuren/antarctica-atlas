import type { NextFetchEvent, NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing, SUPPORTED_LOCALES } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  const response = intlMiddleware(req);

  // Non-blocking HTTP page access logging to PostgreSQL `http_access_logs`
  if (req.method === 'GET' && !req.headers.get('x-atlas-internal')) {
    const pathname = req.nextUrl.pathname;
    const seg = pathname.split('/').filter(Boolean)[0] ?? 'en';
    const locale = SUPPORTED_LOCALES.includes(seg as (typeof SUPPORTED_LOCALES)[number])
      ? seg
      : 'en';
    const queryTab = req.nextUrl.searchParams.get('tab');

    const payload = {
      routePath: pathname,
      queryTab,
      locale,
      forwardedFor:
        req.headers.get('cf-connecting-ip') ||
        req.headers.get('x-forwarded-for') ||
        req.headers.get('x-real-ip') ||
        null,
      countryCode:
        req.headers.get('cf-ipcountry') ||
        req.headers.get('x-vercel-ip-country') ||
        null,
      userAgent: req.headers.get('user-agent'),
      referer: req.headers.get('referer'),
      statusCode: response.status || 200
    };

    const internalSecret =
      process.env.AUTH_SECRET || 'antarctica-atlas-dev-only-replace-in-production-32bytes';
    const logUrl = new URL('/api/telemetry/log', req.url);

    event.waitUntil(
      fetch(logUrl, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-atlas-internal': internalSecret.slice(0, 24)
        },
        body: JSON.stringify(payload)
      }).catch(() => {})
    );
  }

  return response;
}

export const config = {
  matcher: [
    '/',
    '/(en|zh-CN|zh-TW|yue-Hant|pt|es)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ]
};
