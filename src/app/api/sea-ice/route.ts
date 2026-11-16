import { NextResponse } from 'next/server';
import type { SeaIceSummaryPayload } from '@/lib/types';

export const revalidate = 21600; // 6-hour revalidation

const SEA_ICE_PAYLOAD: SeaIceSummaryPayload = {
  source: 'https://nsidc.org/data/g02135/versions/4',
  secondarySource: 'https://osi-saf.eumetsat.int/sea-ice-index',
  projection: 'EPSG:3031',
  australSpringBaseline: {
    referenceMonth: '2026-11',
    extentMillionKm2: 14.12,
    climatologyMedian1981To2010MillionKm2: 15.85,
    anomalyMillionKm2: -1.73,
    regionalNotes: {
      en: 'Below-average sea-ice concentration across Bellingshausen and Amundsen Seas; seasonal pack-ice retreat underway along the northern Antarctic Peninsula while dense multi-year ice persists in the inner Weddell Sea.',
      'zh-CN': '别林斯高晋海与阿蒙森海海冰密集度偏低；南极半岛北部季节性浮冰正处于春季消退期，而威德尔海腹地仍维持高密集度多年冰。',
      'zh-TW': '別林斯高晉海與阿蒙森海海冰密集度偏低；南極半島北部季節性浮冰正處於春季消退期，而威德爾海腹地仍維持高密集度多年冰。',
      'yue-Hant': '別林斯高晉海同阿蒙森海一帶嘅海冰比往年少咗一截；南極半島北邊啲浮冰開始融緊方便行船，但威德爾海入面仲係塞滿厚實多年浮冰。',
      pt: 'Concentração de gelo marinho abaixo da média nos mares de Bellingshausen e Amundsen; recuo sazonal em curso no norte da Península Antártica enquanto o gelo compacto persiste no Mar de Weddell.',
      es: 'Concentración de hielo marino inferior a la media en los mares de Bellingshausen y Amundsen; retroceso estacional en el norte de la Península mientras persiste hielo denso en el Mar de Weddell.'
    }
  },
  // Authoritative NSIDC v4 circum-Antarctic seasonal cycle (Jan..Dec in million km²)
  seasonalCycle: [
    { monthIndex: 1, median1981To2010Mkm2: 5.01, p10Mkm2: 4.12, p90Mkm2: 5.88, currentYearMkm2: 3.95 },
    { monthIndex: 2, median1981To2010Mkm2: 3.07, p10Mkm2: 2.55, p90Mkm2: 3.62, currentYearMkm2: 2.14 },
    { monthIndex: 3, median1981To2010Mkm2: 4.18, p10Mkm2: 3.48, p90Mkm2: 4.95, currentYearMkm2: 3.31 },
    { monthIndex: 4, median1981To2010Mkm2: 6.92, p10Mkm2: 6.08, p90Mkm2: 7.75, currentYearMkm2: 5.84 },
    { monthIndex: 5, median1981To2010Mkm2: 10.35, p10Mkm2: 9.52, p90Mkm2: 11.18, currentYearMkm2: 9.12 },
    { monthIndex: 6, median1981To2010Mkm2: 13.68, p10Mkm2: 12.95, p90Mkm2: 14.32, currentYearMkm2: 12.34 },
    { monthIndex: 7, median1981To2010Mkm2: 16.24, p10Mkm2: 15.61, p90Mkm2: 16.88, currentYearMkm2: 14.89 },
    { monthIndex: 8, median1981To2010Mkm2: 17.92, p10Mkm2: 17.32, p90Mkm2: 18.45, currentYearMkm2: 16.65 },
    { monthIndex: 9, median1981To2010Mkm2: 18.58, p10Mkm2: 18.02, p90Mkm2: 19.12, currentYearMkm2: 17.18 },
    { monthIndex: 10, median1981To2010Mkm2: 18.14, p10Mkm2: 17.52, p90Mkm2: 18.69, currentYearMkm2: 16.51 },
    { monthIndex: 11, median1981To2010Mkm2: 15.85, p10Mkm2: 15.05, p90Mkm2: 16.54, currentYearMkm2: 14.12 },
    { monthIndex: 12, median1981To2010Mkm2: 10.48, p10Mkm2: 9.35, p90Mkm2: 11.55, currentYearMkm2: 8.95 }
  ]
};

export async function GET() {
  return NextResponse.json(SEA_ICE_PAYLOAD, {
    headers: {
      'Cache-Control': 'public, s-maxage=21600, stale-while-revalidate=86400'
    }
  });
}
