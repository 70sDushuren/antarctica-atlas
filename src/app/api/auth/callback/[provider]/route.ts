import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/routing';
import { issueSessionCookie } from '@/lib/auth/server';
import { atlasDbRepository } from '@/lib/db';
import { maskClientIpSubnet } from '@/lib/telemetry/privacy';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ provider: string }> }
) {
  const { provider } = await context.params;
  const siteOrigin =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || req.nextUrl.origin;

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state') || '';
  const cookieStore = await cookies();
  const expectedState = cookieStore.get('atlas_oauth_state')?.value;
  cookieStore.delete('atlas_oauth_state');

  const rawLocale = state.split(':')[1] || 'en';
  const locale: SupportedLocale = SUPPORTED_LOCALES.includes(rawLocale as SupportedLocale)
    ? (rawLocale as SupportedLocale)
    : 'en';

  if (!code || !expectedState || state !== expectedState) {
    return NextResponse.redirect(`${siteOrigin}/${locale}?auth=oauth_state_invalid`);
  }

  try {
    const ipSubnet = maskClientIpSubnet(
      req.headers.get('cf-connecting-ip') || req.headers.get('x-forwarded-for')
    );
    const userAgent = req.headers.get('user-agent');

    if (
      provider === 'github' &&
      process.env.GITHUB_CLIENT_ID &&
      process.env.GITHUB_CLIENT_SECRET
    ) {
      const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
          redirect_uri: `${siteOrigin}/api/auth/callback/github`
        })
      });
      const tokenJson = (await tokenRes.json()) as { access_token?: string };
      if (!tokenJson.access_token) {
        throw new Error('Missing GitHub token');
      }

      const profileRes = await fetch('https://api.github.com/user', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` }
      });
      const profile = (await profileRes.json()) as {
        id: number;
        login: string;
        name?: string;
        email?: string;
      };

      let email = profile.email;
      if (!email) {
        const emailsRes = await fetch('https://api.github.com/user/emails', {
          headers: { Authorization: `Bearer ${tokenJson.access_token}` }
        });
        const emails = (await emailsRes.json()) as Array<{
          email: string;
          primary: boolean;
          verified: boolean;
        }>;
        email =
          emails.find((e) => e.primary && e.verified)?.email ||
          emails[0]?.email ||
          `${profile.login}@users.noreply.github.com`;
      }

      const user = await atlasDbRepository.upsertOAuthUser({
        provider: 'github',
        providerAccountId: String(profile.id),
        email,
        displayName: profile.name || profile.login,
        locale
      });
      await issueSessionCookie({ userId: user.id, ipSubnet, userAgent });
      return NextResponse.redirect(`${siteOrigin}/${locale}`);
    }

    if (
      provider === 'google' &&
      process.env.GOOGLE_CLIENT_ID &&
      process.env.GOOGLE_CLIENT_SECRET
    ) {
      const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: `${siteOrigin}/api/auth/callback/google`,
          grant_type: 'authorization_code'
        })
      });
      const tokenJson = (await tokenRes.json()) as { access_token?: string };
      if (!tokenJson.access_token) {
        throw new Error('Missing Google token');
      }

      const profileRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokenJson.access_token}` }
      });
      const profile = (await profileRes.json()) as {
        id: string;
        email: string;
        name?: string;
      };

      const user = await atlasDbRepository.upsertOAuthUser({
        provider: 'google',
        providerAccountId: String(profile.id),
        email: profile.email,
        displayName: profile.name || profile.email.split('@')[0],
        locale
      });
      await issueSessionCookie({ userId: user.id, ipSubnet, userAgent });
      return NextResponse.redirect(`${siteOrigin}/${locale}`);
    }

    return NextResponse.redirect(`${siteOrigin}/${locale}?auth=provider_unavailable`);
  } catch {
    return NextResponse.redirect(`${siteOrigin}/${locale}?auth=oauth_failed`);
  }
}
