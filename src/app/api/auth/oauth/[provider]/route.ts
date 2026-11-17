import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || req.nextUrl.origin;
  const locale = req.nextUrl.searchParams.get('locale') || 'en';
  const state = `${crypto.randomBytes(16).toString('hex')}:${locale}`;

  const cookieStore = await cookies();
  cookieStore.set('atlas_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 600
  });

  if (provider === 'github' && process.env.GITHUB_CLIENT_ID) {
    const authUrl = new URL('https://github.com/login/oauth/authorize');
    authUrl.searchParams.set('client_id', process.env.GITHUB_CLIENT_ID);
    authUrl.searchParams.set(
      'redirect_uri',
      `${siteOrigin}/api/auth/callback/github`
    );
    authUrl.searchParams.set('scope', 'read:user user:email');
    authUrl.searchParams.set('state', state);
    return NextResponse.redirect(authUrl);
  }

  if (provider === 'google' && process.env.GOOGLE_CLIENT_ID) {
    const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    authUrl.searchParams.set('client_id', process.env.GOOGLE_CLIENT_ID);
    authUrl.searchParams.set(
      'redirect_uri',
      `${siteOrigin}/api/auth/callback/google`
    );
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid email profile');
    authUrl.searchParams.set('state', state);
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.redirect(`${siteOrigin}/${locale}?auth=provider_unavailable`);
}
