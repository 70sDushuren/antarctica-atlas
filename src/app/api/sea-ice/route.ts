import { NextResponse } from 'next/server';
import { BASELINE_SEA_ICE_SUMMARY } from '@/lib/telemetry-baseline';

export const revalidate = 21600; // 6-hour revalidation

export async function GET() {
  return NextResponse.json(BASELINE_SEA_ICE_SUMMARY, {
    headers: {
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400'
    }
  });
}
