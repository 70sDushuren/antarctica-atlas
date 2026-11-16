import { NextResponse } from 'next/server';
import { POLAR_STATIONS } from '@/data/stations';
import { classifyKatabaticTier, computeWindChillC } from '@/lib/polar-math';
import type { StationWeatherTelemetry } from '@/lib/types';

export const revalidate = 1800; // 30-minute server cache

const FALLBACK_TELEMETRY: Record<
  string,
  Omit<StationWeatherTelemetry, 'stationId' | 'lat' | 'lon' | 'windChillC' | 'katabaticTier' | 'updatedAtIso' | 'isFallback'>
> = {
  'amundsen-scott': { temperature2mC: -31.4, windSpeed10mKmh: 22.0, windGusts10mKmh: 34.0, windDirectionDeg: 38, surfacePressureHpa: 682.5, snowfallCm: 0.0 },
  'great-wall': { temperature2mC: -1.2, windSpeed10mKmh: 31.5, windGusts10mKmh: 52.0, windDirectionDeg: 285, surfacePressureHpa: 989.2, snowfallCm: 0.4 },
  qinling: { temperature2mC: -9.8, windSpeed10mKmh: 48.0, windGusts10mKmh: 76.5, windDirectionDeg: 260, surfacePressureHpa: 983.0, snowfallCm: 0.0 },
  zhongshan: { temperature2mC: -6.5, windSpeed10mKmh: 29.0, windGusts10mKmh: 46.0, windDirectionDeg: 95, surfacePressureHpa: 985.8, snowfallCm: 0.1 },
  mcmurdo: { temperature2mC: -8.3, windSpeed10mKmh: 24.5, windGusts10mKmh: 39.0, windDirectionDeg: 112, surfacePressureHpa: 987.4, snowfallCm: 0.0 },
  esperanza: { temperature2mC: -2.4, windSpeed10mKmh: 36.0, windGusts10mKmh: 68.0, windDirectionDeg: 245, surfacePressureHpa: 986.1, snowfallCm: 0.2 },
  'comandante-ferraz': { temperature2mC: -0.8, windSpeed10mKmh: 28.0, windGusts10mKmh: 47.0, windDirectionDeg: 292, surfacePressureHpa: 990.0, snowfallCm: 0.3 },
  vostok: { temperature2mC: -42.6, windSpeed10mKmh: 18.5, windGusts10mKmh: 29.0, windDirectionDeg: 215, surfacePressureHpa: 626.8, snowfallCm: 0.0 }
};

function buildFallbackPayload(): StationWeatherTelemetry[] {
  const nowIso = new Date().toISOString();
  return POLAR_STATIONS.map((station) => {
    const base = FALLBACK_TELEMETRY[station.id] ?? FALLBACK_TELEMETRY['great-wall'];
    return {
      stationId: station.id,
      lat: station.lat,
      lon: station.lon,
      ...base,
      windChillC: computeWindChillC(base.temperature2mC, base.windSpeed10mKmh),
      katabaticTier: classifyKatabaticTier(base.windGusts10mKmh),
      updatedAtIso: nowIso,
      isFallback: true
    };
  });
}

export async function GET() {
  try {
    const lats = POLAR_STATIONS.map((s) => s.lat).join(',');
    const lons = POLAR_STATIONS.map((s) => s.lon).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,surface_pressure,wind_speed_10m,wind_gusts_10m,wind_direction_10m,snowfall&wind_speed_unit=kmh&timezone=UTC`;

    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      throw new Error(`Open-Meteo responded with ${res.status}`);
    }

    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : [raw];
    const nowIso = new Date().toISOString();

    const stations: StationWeatherTelemetry[] = POLAR_STATIONS.map((station, idx) => {
      const cur = list[idx]?.current;
      const temp = typeof cur?.temperature_2m === 'number' ? cur.temperature_2m : -5.0;
      const wind = typeof cur?.wind_speed_10m === 'number' ? cur.wind_speed_10m : 25.0;
      const gust = typeof cur?.wind_gusts_10m === 'number' ? cur.wind_gusts_10m : 40.0;

      return {
        stationId: station.id,
        lat: station.lat,
        lon: station.lon,
        temperature2mC: temp,
        windChillC: computeWindChillC(temp, wind),
        windSpeed10mKmh: wind,
        windGusts10mKmh: gust,
        windDirectionDeg: cur?.wind_direction_10m ?? 270,
        surfacePressureHpa: cur?.surface_pressure ?? 985.0,
        snowfallCm: cur?.snowfall ?? 0,
        katabaticTier: classifyKatabaticTier(gust),
        updatedAtIso: cur?.time ?? nowIso,
        isFallback: false
      };
    });

    return NextResponse.json(
      { source: 'https://open-meteo.com/en/docs', stations },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600'
        }
      }
    );
  } catch {
    return NextResponse.json(
      {
        source: 'https://open-meteo.com/en/docs',
        stations: buildFallbackPayload()
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800'
        }
      }
    );
  }
}
