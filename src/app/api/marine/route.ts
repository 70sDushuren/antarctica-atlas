import { NextResponse } from 'next/server';
import { classifyDrakeSeaState } from '@/lib/polar-math';
import type { MarineCorridorTelemetry } from '@/lib/types';

export const revalidate = 1800;

const MARINE_SAMPLING_POINTS = [
  { id: 'drake-north', label: 'Northern Drake Passage (Cape Horn South)', lat: -56.8, lon: -66.5, fallbackWaveM: 3.6, fallbackPeriodS: 10.4, fallbackSstC: 4.8 },
  { id: 'drake-convergence', label: 'Central Drake / Antarctic Convergence', lat: -58.8, lon: -64.0, fallbackWaveM: 4.2, fallbackPeriodS: 11.2, fallbackSstC: 1.9 },
  { id: 'bransfield-strait', label: 'Bransfield Strait (Peninsula West)', lat: -62.8, lon: -59.2, fallbackWaveM: 1.8, fallbackPeriodS: 7.5, fallbackSstC: -0.4 },
  { id: 'weddell-entrance', label: 'Northwestern Weddell Sea (Paulet Approach)', lat: -63.7, lon: -55.2, fallbackWaveM: 1.4, fallbackPeriodS: 6.8, fallbackSstC: -1.3 }
] as const;

export async function GET() {
  const nowIso = new Date().toISOString();
  try {
    const lats = MARINE_SAMPLING_POINTS.map((p) => p.lat).join(',');
    const lons = MARINE_SAMPLING_POINTS.map((p) => p.lon).join(',');
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lats}&longitude=${lons}&current=wave_height,wave_direction,wave_period,sea_surface_temperature&timezone=UTC`;

    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      throw new Error(`Marine API status ${res.status}`);
    }
    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : [raw];

    const points: MarineCorridorTelemetry[] = MARINE_SAMPLING_POINTS.map((pt, idx) => {
      const cur = list[idx]?.current;
      const waveM = typeof cur?.wave_height === 'number' ? cur.wave_height : pt.fallbackWaveM;
      const state = classifyDrakeSeaState(waveM);
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
        updatedAtIso: cur?.time ?? nowIso,
        isFallback: false
      };
    });

    return NextResponse.json(
      { source: 'https://open-meteo.com/en/docs/marine-weather-api', points },
      { headers: { 'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate=3600' } }
    );
  } catch {
    const points: MarineCorridorTelemetry[] = MARINE_SAMPLING_POINTS.map((pt) => {
      const state = classifyDrakeSeaState(pt.fallbackWaveM);
      return {
        pointId: pt.id,
        label: pt.label,
        lat: pt.lat,
        lon: pt.lon,
        waveHeightM: pt.fallbackWaveM,
        wavePeriodS: pt.fallbackPeriodS,
        waveDirectionDeg: 268,
        seaSurfaceTempC: pt.fallbackSstC,
        drakeTier: state.tier,
        drakeTierCode: state.code,
        updatedAtIso: nowIso,
        isFallback: true
      };
    });
    return NextResponse.json(
      { source: 'https://open-meteo.com/en/docs/marine-weather-api', points },
      { headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=1800' } }
    );
  }
}
