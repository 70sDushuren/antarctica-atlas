import { NextResponse } from 'next/server';

export const revalidate = 21600; // 6-hour revalidation

export async function GET() {
  return NextResponse.json(
    {
      source: 'https://nsidc.org/data/g02135/versions/4',
      secondarySource: 'https://osi-saf.eumetsat.int/sea-ice-index',
      projection: 'EPSG:3031',
      australSpringBaseline: {
        referenceMonth: '2026-11',
        extentMillionKm2: 14.12,
        climatologyMedian1981To2010MillionKm2: 15.85,
        anomalyMillionKm2: -1.73,
        regionalNotes:
          'Below-average sea ice concentration across Bellingshausen and Amundsen Seas; seasonal pack-ice retreat underway along northern Antarctic Peninsula while fast ice persists in inner Weddell Sea.'
      }
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400'
      }
    }
  );
}
