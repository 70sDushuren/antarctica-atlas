import { NextResponse } from 'next/server';
import { POLAR_STATIONS } from '@/data/stations';
import { buildOpenMeteoUrl } from '@/lib/open-meteo-endpoint';
import { classifyKatabaticTier, computeWindChillC } from '@/lib/polar-math';
import { getOrAsyncRefreshServerTelemetry } from '@/lib/server-telemetry-cache';
import {
  buildBaselineStationWeather,
  buildSyntheticDailyForecast,
  STATION_CLIMATE_BASELINES
} from '@/lib/telemetry-baseline';
import type { DailyStationForecast, StationWeatherTelemetry } from '@/lib/types';

const WEATHER_FRESH_TTL_MS = 30 * 60_000; // 30-minute valid sync window

async function fetchLiveStationWeatherFromOpenMeteo(): Promise<
  StationWeatherTelemetry[]
> {
  const lats = POLAR_STATIONS.map((s) => s.lat).join(',');
  const lons = POLAR_STATIONS.map((s) => s.lon).join(',');
  const url = buildOpenMeteoUrl(
    'forecast',
    `latitude=${lats}&longitude=${lons}&current=temperature_2m,surface_pressure,wind_speed_10m,wind_gusts_10m,wind_direction_10m,snowfall&daily=temperature_2m_max,temperature_2m_min,wind_gusts_10m_max,snowfall_sum&forecast_days=7&wind_speed_unit=kmh&timezone=UTC`
  );

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Open-Meteo responded with ${res.status}`);
  }

  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : [raw];
  const nowIso = new Date().toISOString();

  return POLAR_STATIONS.map((station, idx) => {
    const item = list[idx];
    const cur = item?.current;
    const daily = item?.daily;
    const base =
      STATION_CLIMATE_BASELINES[station.id] ?? STATION_CLIMATE_BASELINES['great-wall'];

    const temp =
      typeof cur?.temperature_2m === 'number' ? cur.temperature_2m : base.temperature2mC;
    const wind =
      typeof cur?.wind_speed_10m === 'number' ? cur.wind_speed_10m : base.windSpeed10mKmh;
    const gust =
      typeof cur?.wind_gusts_10m === 'number' ? cur.wind_gusts_10m : base.windGusts10mKmh;

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
}

export async function GET() {
  const result = await getOrAsyncRefreshServerTelemetry({
    key: 'stations-weather-v2',
    freshTtlMs: WEATHER_FRESH_TTL_MS,
    buildBaseline: () => buildBaselineStationWeather(),
    fetchLive: fetchLiveStationWeatherFromOpenMeteo
  });

  return NextResponse.json(
    {
      source: 'https://open-meteo.com/en/docs',
      cacheState: result.cacheState,
      updatedAtIso: result.updatedAtIso,
      stations: result.data
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600'
      }
    }
  );
}
