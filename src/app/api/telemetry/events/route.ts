import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getCurrentAuthenticatedUser } from '@/lib/auth/server';
import { atlasDbRepository } from '@/lib/db';
import { anonymizeVisitorHash } from '@/lib/telemetry/privacy';
import type { TelemetryEventInput } from '@/lib/types';

const ALLOWED_CATEGORIES = new Set([
  'navigation',
  'drilldown',
  'canvas',
  'planner',
  'auth'
]);

export async function POST(req: NextRequest) {
  const rawIp =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip');

  if (!checkRateLimit(`telemetry:${rawIp || 'anon'}`, 60, 60_000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  try {
    const rawText = await req.text();
    if (!rawText || rawText.length > 32_768) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const parsed = JSON.parse(rawText) as { events?: TelemetryEventInput[] };
    const rawEvents = Array.isArray(parsed.events) ? parsed.events : [];
    const validEvents = rawEvents.filter(
      (ev) =>
        ev &&
        typeof ev.sessionKey === 'string' &&
        typeof ev.eventName === 'string' &&
        ALLOWED_CATEGORIES.has(ev.eventCategory)
    );

    if (validEvents.length === 0) {
      return NextResponse.json({ ok: true, count: 0 });
    }

    const user = await getCurrentAuthenticatedUser().catch(() => null);
    const visitorHash = anonymizeVisitorHash(rawIp, req.headers.get('user-agent'));

    await atlasDbRepository.insertBehaviorEvents(validEvents, {
      visitorHash,
      userId: user?.id ?? null
    });

    return NextResponse.json({ ok: true, count: validEvents.length });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
