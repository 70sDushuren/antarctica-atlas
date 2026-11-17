import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { atlasDbRepository } from '@/lib/db';
import type { AuthenticatedUser } from '@/lib/types';

export const SESSION_COOKIE_NAME = 'atlas_session_v2';
const SESSION_TTL_DAYS = 30;

export function hashPasswordScrypt(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

export function verifyPasswordScrypt(password: string, storedHash: string): boolean {
  const parts = storedHash.split(':');
  if (parts.length !== 3 || parts[0] !== 'scrypt') return false;
  const [, salt, expectedHex] = parts;
  const derived = crypto.scryptSync(password, salt, 64, { N: 16384, r: 8, p: 1 });
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  if (expectedBuf.length !== derived.length) return false;
  return crypto.timingSafeEqual(expectedBuf, derived);
}

export function hashSessionToken(rawToken: string): string {
  const secret =
    process.env.AUTH_SECRET || 'antarctica-atlas-dev-only-replace-in-production-32bytes';
  return crypto
    .createHmac('sha256', secret)
    .update(rawToken)
    .digest('hex');
}

export function generateRawSessionToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

export function getAvailableOAuthProviders(): { github: boolean; google: boolean } {
  return {
    github: Boolean(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET),
    google: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET)
  };
}

export async function issueSessionCookie(params: {
  userId: string;
  ipSubnet: string | null;
  userAgent: string | null;
}): Promise<void> {
  const rawToken = generateRawSessionToken();
  const tokenHash = hashSessionToken(rawToken);
  const expiresAt = new Date(Date.now() + SESSION_TTL_DAYS * 86_400_000);

  await atlasDbRepository.createSession({
    userId: params.userId,
    tokenHash,
    ipSubnet: params.ipSubnet,
    userAgent: params.userAgent,
    expiresAt
  });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, rawToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt
  });
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  const existing = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (existing) {
    await atlasDbRepository.deleteSessionByTokenHash(hashSessionToken(existing));
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function getCurrentAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!rawToken) return null;
  return atlasDbRepository.findUserBySessionTokenHash(hashSessionToken(rawToken));
}

// Simple in-memory sliding-window rate limiter for auth & public evaluation endpoints
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(
  bucketKey: string,
  maxRequests: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const entry = rateBuckets.get(bucketKey);
  if (!entry || entry.resetAt <= now) {
    rateBuckets.set(bucketKey, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= maxRequests) {
    return false;
  }
  entry.count += 1;
  return true;
}
