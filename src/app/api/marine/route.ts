import { NextResponse } from 'next/server';
import { classifyDrakeSeaState } from '@/lib/polar-math';
import type { LocalizedText, MarineCorridorTelemetry } from '@/lib/types';

export const revalidate = 1800;

interface MarineSamplingNode {
  id: string;
  label: LocalizedText;
  lat: number;
  lon: number;
  fallbackWaveM: number;
  fallbackPeriodS: number;
  fallbackSstC: number;
  fallbackDailyWavesM: number[];
}

const MARINE_SAMPLING_POINTS: MarineSamplingNode[] = [
  {
    id: 'drake-north',
    label: {
      en: 'Northern Drake Passage (Cape Horn South)',
      'zh-CN': '德雷克海峡北段（合恩角以南）',
      'zh-TW': '德雷克海峽北段（合恩角以南）',
      'yue-Hant': '德雷克海峽北段（合恩角南邊出山口）',
      pt: 'Norte da Passagem de Drake (Sul do Cabo Horn)',
      es: 'Norte del Pasaje de Drake (Sur del Cabo de Hornos)'
    },
    lat: -56.8,
    lon: -66.5,
    fallbackWaveM: 3.6,
    fallbackPeriodS: 10.4,
    fallbackSstC: 4.8,
    fallbackDailyWavesM: [3.6, 4.1, 4.9, 3.8, 2.9, 3.4, 4.2]
  },
  {
    id: 'drake-convergence',
    label: {
      en: 'Central Drake / Antarctic Convergence',
      'zh-CN': '德雷克海峡中线 / 南极辐合带',
      'zh-TW': '德雷克海峽中線 / 南極輻合帶',
      'yue-Hant': '德雷克海峽中線 / 南極冷暖水交界帶',
      pt: 'Centro de Drake / Convergência Antártica',
      es: 'Centro de Drake / Convergencia Antártica'
    },
    lat: -58.8,
    lon: -64.0,
    fallbackWaveM: 4.2,
    fallbackPeriodS: 11.2,
    fallbackSstC: 1.9,
    fallbackDailyWavesM: [4.2, 4.8, 5.7, 4.4, 3.2, 3.7, 4.5]
  },
  {
    id: 'bransfield-strait',
    label: {
      en: 'Bransfield Strait (South Shetland – Peninsula)',
      'zh-CN': '布兰斯菲尔德海峡（南设得兰—半岛西岸）',
      'zh-TW': '布蘭斯菲爾德海峽（南設得蘭—半島西岸）',
      'yue-Hant': '布蘭斯菲爾德海峽（喬治王島去半島內水道）',
      pt: 'Estreito de Bransfield (Shetland do Sul – Península)',
      es: 'Estrecho de Bransfield (Shetland del Sur – Península)'
    },
    lat: -62.8,
    lon: -59.2,
    fallbackWaveM: 1.8,
    fallbackPeriodS: 7.5,
    fallbackSstC: -0.4,
    fallbackDailyWavesM: [1.8, 2.1, 2.6, 1.9, 1.4, 1.6, 2.0]
  },
  {
    id: 'weddell-entrance',
    label: {
      en: 'Northwestern Weddell Sea (Antarctic Sound / Paulet)',
      'zh-CN': '威德尔海西北门户（南极海峡 / 保莱特岛）',
      'zh-TW': '威德爾海西北門戶（南極海峽 / 保萊特島）',
      'yue-Hant': '威德爾海西北入口（南極海峽同保萊特島冰山區）',
      pt: 'Noroeste do Mar de Weddell (Ilha Paulet)',
      es: 'Noroeste del Mar de Weddell (Isla Paulet)'
    },
    lat: -63.7,
    lon: -55.2,
    fallbackWaveM: 1.4,
    fallbackPeriodS: 6.8,
    fallbackSstC: -1.3,
    fallbackDailyWavesM: [1.4, 1.6, 1.9, 1.5, 1.1, 1.3, 1.5]
  },
  {
    id: 'ross-ice-front',
    label: {
      en: 'Ross Sea 180° Meridian Crossing',
      'zh-CN': '罗斯海 180° 经线公海航段',
      'zh-TW': '羅斯海 180° 經線公海航段',
      'yue-Hant': '羅斯海跨越 180 度經線外海航段',
      pt: 'Mar de Ross (Cruzamento do Meridiano 180°)',
      es: 'Mar de Ross (Cruce del Meridiano 180°)'
    },
    lat: -73.5,
    lon: 179.5,
    fallbackWaveM: 2.7,
    fallbackPeriodS: 8.9,
    fallbackSstC: -1.5,
    fallbackDailyWavesM: [2.7, 3.1, 2.8, 2.3, 2.5, 3.4, 2.9]
  },
  {
    id: 'prydz-bay',
    label: {
      en: 'East Antarctica Prydz Bay Approach',
      'zh-CN': '东南极普里兹湾外海航道',
      'zh-TW': '東南極普里茲灣外海航道',
      'yue-Hant': '東南極中山站普里茲灣外海航道',
      pt: 'Aproximação da Baía Prydz (Antártida Oriental)',
      es: 'Aproximación a Bahía Prydz (Antártida Oriental)'
    },
    lat: -66.5,
    lon: 75.5,
    fallbackWaveM: 3.1,
    fallbackPeriodS: 9.6,
    fallbackSstC: -1.1,
    fallbackDailyWavesM: [3.1, 3.5, 4.0, 2.9, 2.6, 3.0, 3.3]
  }
];

export async function GET() {
  const nowIso = new Date().toISOString();
  try {
    const lats = MARINE_SAMPLING_POINTS.map((p) => p.lat).join(',');
    const lons = MARINE_SAMPLING_POINTS.map((p) => p.lon).join(',');
    const url = `https://marine-api.open-meteo.com/v1/marine?latitude=${lats}&longitude=${lons}&current=wave_height,wave_direction,wave_period,sea_surface_temperature&daily=wave_height_max&forecast_days=7&timezone=UTC`;

    const res = await fetch(url, { next: { revalidate: 1800 } });
    if (!res.ok) {
      throw new Error(`Marine API status ${res.status}`);
    }
    const raw = await res.json();
    const list = Array.isArray(raw) ? raw : [raw];

    const points: MarineCorridorTelemetry[] = MARINE_SAMPLING_POINTS.map((pt, idx) => {
      const item = list[idx];
      const cur = item?.current;
      const waveM = typeof cur?.wave_height === 'number' ? cur.wave_height : pt.fallbackWaveM;
      const state = classifyDrakeSeaState(waveM);
      const dailyWaveMaxM: number[] =
        Array.isArray(item?.daily?.wave_height_max) && item.daily.wave_height_max.length > 0
          ? item.daily.wave_height_max.map((v: number | null, i: number) =>
              typeof v === 'number' ? Math.round(v * 10) / 10 : pt.fallbackDailyWavesM[i] ?? waveM
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
        dailyWaveMaxM: pt.fallbackDailyWavesM,
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
