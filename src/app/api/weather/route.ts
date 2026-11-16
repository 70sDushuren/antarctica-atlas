import { NextResponse } from 'next/server';
import { POLAR_STATIONS } from '@/data/stations';
import { classifyKatabaticTier, computeWindChillC } from '@/lib/polar-math';
import type { DailyStationForecast, StationWeatherTelemetry } from '@/lib/types';

export const revalidate = 1800; // 30-minute server cache

interface StationClimateBaseline {
  temperature2mC: number;
  windSpeed10mKmh: number;
  windGusts10mKmh: number;
  windDirectionDeg: number;
  surfacePressureHpa: number;
  snowfallCm: number;
}

const FALLBACK_TELEMETRY: Record<string, StationClimateBaseline> = {
  'amundsen-scott': { temperature2mC: -31.4, windSpeed10mKmh: 22.0, windGusts10mKmh: 34.0, windDirectionDeg: 38, surfacePressureHpa: 682.5, snowfallCm: 0.0 },
  'great-wall': { temperature2mC: -1.2, windSpeed10mKmh: 31.5, windGusts10mKmh: 52.0, windDirectionDeg: 285, surfacePressureHpa: 989.2, snowfallCm: 0.4 },
  zhongshan: { temperature2mC: -6.5, windSpeed10mKmh: 29.0, windGusts10mKmh: 46.0, windDirectionDeg: 95, surfacePressureHpa: 985.8, snowfallCm: 0.1 },
  qinling: { temperature2mC: -9.8, windSpeed10mKmh: 48.0, windGusts10mKmh: 76.5, windDirectionDeg: 260, surfacePressureHpa: 983.0, snowfallCm: 0.0 },
  kunlun: { temperature2mC: -44.2, windSpeed10mKmh: 16.0, windGusts10mKmh: 25.5, windDirectionDeg: 140, surfacePressureHpa: 579.4, snowfallCm: 0.0 },
  mcmurdo: { temperature2mC: -8.3, windSpeed10mKmh: 24.5, windGusts10mKmh: 39.0, windDirectionDeg: 112, surfacePressureHpa: 987.4, snowfallCm: 0.0 },
  palmer: { temperature2mC: -0.6, windSpeed10mKmh: 26.0, windGusts10mKmh: 44.0, windDirectionDeg: 310, surfacePressureHpa: 988.6, snowfallCm: 0.6 },
  rothera: { temperature2mC: -3.1, windSpeed10mKmh: 30.0, windGusts10mKmh: 54.0, windDirectionDeg: 25, surfacePressureHpa: 986.9, snowfallCm: 0.3 },
  'halley-vi': { temperature2mC: -12.8, windSpeed10mKmh: 33.0, windGusts10mKmh: 58.0, windDirectionDeg: 78, surfacePressureHpa: 984.2, snowfallCm: 0.2 },
  esperanza: { temperature2mC: -2.4, windSpeed10mKmh: 36.0, windGusts10mKmh: 68.0, windDirectionDeg: 245, surfacePressureHpa: 986.1, snowfallCm: 0.2 },
  marambio: { temperature2mC: -4.9, windSpeed10mKmh: 38.5, windGusts10mKmh: 71.0, windDirectionDeg: 235, surfacePressureHpa: 964.5, snowfallCm: 0.1 },
  'presidente-frei': { temperature2mC: -1.4, windSpeed10mKmh: 32.0, windGusts10mKmh: 53.5, windDirectionDeg: 290, surfacePressureHpa: 989.0, snowfallCm: 0.4 },
  'comandante-ferraz': { temperature2mC: -0.8, windSpeed10mKmh: 28.0, windGusts10mKmh: 47.0, windDirectionDeg: 292, surfacePressureHpa: 990.0, snowfallCm: 0.3 },
  vostok: { temperature2mC: -42.6, windSpeed10mKmh: 18.5, windGusts10mKmh: 29.0, windDirectionDeg: 215, surfacePressureHpa: 626.8, snowfallCm: 0.0 },
  concordia: { temperature2mC: -38.9, windSpeed10mKmh: 15.0, windGusts10mKmh: 24.0, windDirectionDeg: 195, surfacePressureHpa: 648.1, snowfallCm: 0.0 },
  'dumont-durville': { temperature2mC: -7.4, windSpeed10mKmh: 56.0, windGusts10mKmh: 94.0, windDirectionDeg: 150, surfacePressureHpa: 981.6, snowfallCm: 0.2 },
  syowa: { temperature2mC: -6.9, windSpeed10mKmh: 27.5, windGusts10mKmh: 45.0, windDirectionDeg: 55, surfacePressureHpa: 986.3, snowfallCm: 0.3 },
  'neumayer-iii': { temperature2mC: -8.7, windSpeed10mKmh: 34.0, windGusts10mKmh: 61.0, windDirectionDeg: 88, surfacePressureHpa: 984.9, snowfallCm: 0.5 }
};

function buildSyntheticDailyForecast(base: StationClimateBaseline, seedOffset: number): DailyStationForecast[] {
  const today = new Date();
  const days: DailyStationForecast[] = [];
  for (let d = 0; d < 7; d++) {
    const dt = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate() + d));
    const dateStr = dt.toISOString().slice(0, 10);
    const wave = Math.sin((d + seedOffset) * 1.15);
    const tempMaxC = Math.round((base.temperature2mC + 2.2 + wave * 1.8) * 10) / 10;
    const tempMinC = Math.round((base.temperature2mC - 3.4 + wave * 1.6) * 10) / 10;
    const gustMaxKmh = Math.max(
      12,
      Math.round((base.windGusts10mKmh + Math.cos((d + seedOffset) * 0.9) * 14) * 10) / 10
    );
    const windChillMinC = computeWindChillC(tempMinC, gustMaxKmh * 0.68);
    const snowfallCm = Math.max(0, Math.round((base.snowfallCm + (wave > 0.3 ? wave * 1.2 : 0)) * 10) / 10);
    days.push({ date: dateStr, tempMaxC, tempMinC, windChillMinC, gustMaxKmh, snowfallCm });
  }
  return days;
}

function buildFallbackPayload(): StationWeatherTelemetry[] {
  const nowIso = new Date().toISOString();
  return POLAR_STATIONS.map((station, idx) => {
    const base = FALLBACK_TELEMETRY[station.id] ?? FALLBACK_TELEMETRY['great-wall'];
    return {
      stationId: station.id,
      lat: station.lat,
      lon: station.lon,
      ...base,
      windChillC: computeWindChillC(base.temperature2mC, base.windSpeed10mKmh),
      katabaticTier: classifyKatabaticTier(base.windGusts10mKmh),
      dailyForecast: buildSyntheticDailyForecast(base, idx),
      updatedAtIso: nowIso,
      isFallback: true
    };
  });
}

export async function GET() {
  try {
    const lats = POLAR_STATIONS.map((s) => s.lat).join(',');
    const lons = POLAR_STATIONS.map((s) => s.lon).join(',');
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current=temperature_2m,surface_pressure,wind_speed_10m,wind_gusts_10m,wind_direction_10m,snowfall&daily=temperature_2m_max,temperature_2m_min,wind_gusts_10m_max,snowfall_sum&forecast_days=7&wind_speed_unit=kmh&timezone=UTC`;

    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      throw new Error(`Open-Meteo responded with ${res.status}`);
    }

    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : [raw];
    const nowIso = new Date().toISOString();

    const stations: StationWeatherTelemetry[] = POLAR_STATIONS.map((station, idx) => {
      const item = list[idx];
      const cur = item?.current;
      const daily = item?.daily;
      const base = FALLBACK_TELEMETRY[station.id] ?? FALLBACK_TELEMETRY['great-wall'];

      const temp = typeof cur?.temperature_2m === 'number' ? cur.temperature_2m : base.temperature2mC;
      const wind = typeof cur?.wind_speed_10m === 'number' ? cur.wind_speed_10m : base.windSpeed10mKmh;
      const gust = typeof cur?.wind_gusts_10m === 'number' ? cur.wind_gusts_10m : base.windGusts10mKmh;

      const dailyForecast: DailyStationForecast[] =
        Array.isArray(daily?.time) && daily.time.length > 0
          ? daily.time.map((dateStr: string, dIdx: number) => {
              const tMax = daily.temperature_2m_max?.[dIdx] ?? temp + 2;
              const tMin = daily.temperature_2m_min?.[dIdx] ?? temp - 3;
              const gMax = daily.wind_gusts_10m_max?.[dIdx] ?? gust;
              return {
                date: dateStr,
                tempMaxC: Math.round(tMax * 10) / 10,
                tempMinC: Math.round(tMin * 10) / 10,
                windChillMinC: computeWindChillC(tMin, gMax * 0.68),
                gustMaxKmh: Math.round(gMax * 10) / 10,
                snowfallCm: Math.round((daily.snowfall_sum?.[dIdx] ?? 0) * 10) / 10
              };
            })
          : buildSyntheticDailyForecast(base, idx);

      return {
        stationId: station.id,
        lat: station.lat,
        lon: station.lon,
        temperature2mC: temp,
        windChillC: computeWindChillC(temp, wind),
        windSpeed10mKmh: wind,
        windGusts10mKmh: gust,
        windDirectionDeg: cur?.wind_direction_10m ?? base.windDirectionDeg,
        surfacePressureHpa: cur?.surface_pressure ?? base.surfacePressureHpa,
        snowfallCm: cur?.snowfall ?? base.snowfallCm,
        katabaticTier: classifyKatabaticTier(gust),
        dailyForecast,
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
