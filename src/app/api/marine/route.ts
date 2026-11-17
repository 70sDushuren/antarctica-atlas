import { NextResponse } from 'next/server';
import { buildOpenMeteoUrl } from '@/lib/open-meteo-endpoint';
import { classifyDrakeSeaState } from '@/lib/polar-math';
import { getOrAsyncRefreshServerTelemetry } from '@/lib/server-telemetry-cache';
import {
  buildBaselineMarineTelemetry,
  MARINE_SAMPLING_NODES
} from '@/lib/telemetry-baseline';
import type { MarineCorridorTelemetry } from '@/lib/types';

const MARINE_FRESH_TTL_MS = 30 * 60_000; // 30-minute valid sync window

async function fetchLiveMarineFromOpenMeteo(): Promise<MarineCorridorTelemetry[]> {
  const nowIso = new Date().toISOString();
  const lats = MARINE_SAMPLING_NODES.map((p) => p.lat).join(',');
  const lons = MARINE_SAMPLING_NODES.map((p) => p.lon).join(',');
  const url = buildOpenMeteoUrl(
    'marine',
    `latitude=${lats}&longitude=${lons}&current=wave_height,wave_direction,wave_period,sea_surface_temperature&daily=wave_height_max&forecast_days=7&timezone=UTC`
  );

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    throw new Error(`Marine API status ${res.status}`);
  }
  const raw = await res.json();
  const list = Array.isArray(raw) ? raw : [raw];

  return MARINE_SAMPLING_NODES.map((pt, idx) => {
    const item = list[idx];
    const cur = item?.current;
    const waveM =
      typeof cur?.wave_height === 'number' ? cur.wave_height : pt.fallbackWaveM;
    const state = classifyDrakeSeaState(waveM);
    const dailyWaveMaxM: number[] =
      Array.isArray(item?.daily?.wave_height_max) && item.daily.wave_height_max.length > 0
        ? item.daily.wave_height_max.map((v: number | null, i: number) =>
            typeof v === 'number'
              ? Math.round(v * 10) / 10
              : (pt.fallbackDailyWavesM[i] ?? waveM)
          )
        : pt.fallbackDailyWavesM;

    return {
      pointId: pt.id,
      label: pt.label,
      lat: pt.lat,
      lon: pt.lon,
      waveHeightM: waveM,
      wavePeriodS: cur?.wave_period ?? pt.fallbackPeriodS,
      waveDirectionDeg: cur?.wave_direction ?? 265,
      seaSurfaceTempC: cur?.sea_surface_temperature ?? pt.fallbackSstC,
      drakeTier: state.tier,
      drakeTierCode: state.code,
      dailyWaveMaxM,
      updatedAtIso: cur?.time ?? nowIso,
      isFallback: false
    };
  });
}

export async function GET() {
  const result = await getOrAsyncRefreshServerTelemetry({
    key: 'marine-corridors-v2',
    freshTtlMs: MARINE_FRESH_TTL_MS,
    buildBaseline: () => buildBaselineMarineTelemetry(),
    fetchLive: fetchLiveMarineFromOpenMeteo
  });

  return NextResponse.json(
    {
      source: 'https://open-meteo.com/en/docs/marine-weather-api',
      cacheState: result.cacheState,
      updatedAtIso: result.updatedAtIso,
      points: result.data
    },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=900, stale-while-revalidate=3600'
      }
    }
  );
}
