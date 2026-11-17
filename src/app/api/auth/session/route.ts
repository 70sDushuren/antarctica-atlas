import { NextRequest, NextResponse } from 'next/server';
import { SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/routing';
import {
  checkRateLimit,
  clearSessionCookie,
  getAvailableOAuthProviders,
  getCurrentAuthenticatedUser,
  hashPasswordScrypt,
  issueSessionCookie,
  verifyPasswordScrypt
} from '@/lib/auth/server';
import { atlasDbRepository, hasPostgresConnection } from '@/lib/db';
import { maskClientIpSubnet } from '@/lib/telemetry/privacy';
import type { MapViewMode, UnitSystem } from '@/lib/types';

export async function GET() {
  const user = await getCurrentAuthenticatedUser();
  return NextResponse.json({
    user,
    oauthProviders: getAvailableOAuthProviders(),
    storageBackend: hasPostgresConnection() ? 'postgresql-postgis' : 'local-dev-fallback'
  });
}

export async function POST(req: NextRequest) {
  const rawIp =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip');

  if (!checkRateLimit(`auth:${rawIp || 'anon'}`, 18, 60_000)) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  }

  try {
    const body = (await req.json()) as {
      action?: 'register' | 'login';
      email?: string;
      password?: string;
      displayName?: string;
      preferredLocale?: string;
      preferredUnits?: string;
      preferredMode?: string;
    };

    const email = (body.email || '').trim().toLowerCase();
    const password = body.password || '';

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'INVALID_EMAIL' }, { status: 400 });
    }
    if (password.length < 8 || password.length > 128) {
      return NextResponse.json({ error: 'INVALID_PASSWORD_LENGTH' }, { status: 400 });
    }

    const ipSubnet = maskClientIpSubnet(rawIp);
    const userAgent = req.headers.get('user-agent');

    if (body.action === 'register') {
      const existing = await atlasDbRepository.findUserByEmail(email);
      if (existing) {
        return NextResponse.json({ error: 'EMAIL_ALREADY_EXISTS' }, { status: 409 });
      }

      const displayName =
        (body.displayName || '').trim().slice(0, 80) || email.split('@')[0];
      const preferredLocale: SupportedLocale = SUPPORTED_LOCALES.includes(
        body.preferredLocale as SupportedLocale
      )
        ? (body.preferredLocale as SupportedLocale)
        : 'en';
      const preferredUnits: UnitSystem =
        body.preferredUnits === 'metric' ||
        body.preferredUnits === 'imperial' ||
        body.preferredUnits === 'nautical'
          ? body.preferredUnits
          : 'nautical';
      const preferredMode: MapViewMode = body.preferredMode === '2d' ? '2d' : '3d';

      const user = await atlasDbRepository.createUser({
        email,
        displayName,
        passwordHash: hashPasswordScrypt(password),
        preferredLocale,
        preferredUnits,
        preferredMode
      });

      await issueSessionCookie({ userId: user.id, ipSubnet, userAgent });
      return NextResponse.json({ user }, { status: 201 });
    }

    // Login flow
    const found = await atlasDbRepository.findUserByEmail(email);
    if (!found || !found.passwordHash) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    const valid = verifyPasswordScrypt(password, found.passwordHash);
    if (!valid) {
      return NextResponse.json({ error: 'INVALID_CREDENTIALS' }, { status: 401 });
    }

    await issueSessionCookie({ userId: found.user.id, ipSubnet, userAgent });
    return NextResponse.json({ user: found.user });
  } catch {
    return NextResponse.json({ error: 'AUTH_SERVER_ERROR' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }

  try {
    const body = (await req.json()) as {
      displayName?: string;
      preferredLocale?: SupportedLocale;
      preferredUnits?: UnitSystem;
      preferredMode?: MapViewMode;
      bookmarkedIds?: string[];
    };

    const updated = await atlasDbRepository.updateUserPreferences(user.id, {
      displayName: body.displayName?.slice(0, 80),
      preferredLocale:
        body.preferredLocale && SUPPORTED_LOCALES.includes(body.preferredLocale)
          ? body.preferredLocale
          : undefined,
      preferredUnits:
        body.preferredUnits === 'metric' ||
        body.preferredUnits === 'nautical' ||
        body.preferredUnits === 'imperial'
          ? body.preferredUnits
          : undefined,
      preferredMode:
        body.preferredMode === '2d' || body.preferredMode === '3d'
          ? body.preferredMode
          : undefined,
      bookmarkedIds: Array.isArray(body.bookmarkedIds)
        ? body.bookmarkedIds.slice(0, 100).map(String)
        : undefined
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: 'UPDATE_FAILED' }, { status: 500 });
  }
}

export async function DELETE() {
  await clearSessionCookie();
  return NextResponse.json({ ok: true });
}
