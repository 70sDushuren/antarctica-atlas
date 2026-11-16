import { NextResponse } from 'next/server';
import { SUPPORTED_LOCALES } from '@/i18n/routing';

export async function GET() {
  return NextResponse.json(
    {
      status: 'ok',
      service: 'antarctica-atlas',
      version: '0.1.0',
      architecture: 'option-a-serverless-edge',
      projection: 'EPSG:3031',
      supportedLocales: SUPPORTED_LOCALES,
      cacheRevalidationSeconds: {
        weather: 1800,
        marine: 1800,
        seaIce: 21600
      }
    },
    {
      headers: {
        'Cache-Control': 'no-store'
      }
    }
  );
}
