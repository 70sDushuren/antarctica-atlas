import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  matcher: ['/', '/(en|zh-CN|zh-TW|yue-Hant|pt|es)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};
