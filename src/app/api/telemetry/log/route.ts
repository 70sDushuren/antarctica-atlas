import { NextRequest, NextResponse } from 'next/server';
import { atlasDbRepository } from '@/lib/db';
import {
  anonymizeVisitorHash,
  extractSafeReferrerHost,
  maskClientIpSubnet,
  parseUserAgentSummary
} from '@/lib/telemetry/privacy';

export async function POST(req: NextRequest) {
  const expectedToken = (
    process.env.AUTH_SECRET ||
    'antarctica-atlas-dev-only-replace-in-production-32bytes'
  ).slice(0, 24);

  if (req.headers.get('x-atlas-internal') !== expectedToken) {
    return NextResponse.json({ error: 'FORBIDDEN' }, { status: 403 });
  }

  try {
    const body = (await req.json()) as {
      routePath?: string;
      queryTab?: string | null;
      locale?: string;
      forwardedFor?: string | null;
      countryCode?: string | null;
      userAgent?: string | null;
      referer?: string | null;
      statusCode?: number;
    };

    const uaSummary = parseUserAgentSummary(body.userAgent);
    await atlasDbRepository.insertAccessLog({
      visitorHash: anonymizeVisitorHash(body.forwardedFor, body.userAgent),
      clientSubnet: maskClientIpSubnet(body.forwardedFor),
      httpMethod: 'GET',
      routePath: body.routePath || '/',
      queryTab: body.queryTab ?? null,
      locale: body.locale || 'en',
      countryCode: body.countryCode ?? null,
      deviceType: uaSummary.deviceType,
      browserFamily: uaSummary.browserFamily,
      osFamily: uaSummary.osFamily,
      referrerHost: extractSafeReferrerHost(body.referer),
      statusCode: body.statusCode ?? 200
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 202 });
  }
}
