import { POLAR_STATIONS } from '../data/stations.ts';
import {
  classifyDrakeSeaState,
  classifyKatabaticTier,
  computeWindChillC
} from './polar-math.ts';
import type {
  DailyStationForecast,
  LocalizedText,
  MarineCorridorTelemetry,
  SeaIceSummaryPayload,
  StationWeatherTelemetry
} from './types.ts';

export interface StationClimateBaseline {
  temperature2mC: number;
  windSpeed10mKmh: number;
  windGusts10mKmh: number;
  windDirectionDeg: number;
  surfacePressureHpa: number;
  snowfallCm: number;
}

export const STATION_CLIMATE_BASELINES: Record<string, StationClimateBaseline> = {
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

export function buildSyntheticDailyForecast(
  base: StationClimateBaseline,
  seedOffset: number,
  refDate: Date = new Date()
): DailyStationForecast[] {
  const days: DailyStationForecast[] = [];
  for (let d = 0; d < 7; d++) {
    const dt = new Date(
      Date.UTC(refDate.getUTCFullYear(), refDate.getUTCMonth(), refDate.getUTCDate() + d)
    );
    const dateStr = dt.toISOString().slice(0, 10);
    const wave = Math.sin((d + seedOffset) * 1.15);
    const tempMaxC = Math.round((base.temperature2mC + 2.2 + wave * 1.8) * 10) / 10;
    const tempMinC = Math.round((base.temperature2mC - 3.4 + wave * 1.6) * 10) / 10;
    const gustMaxKmh = Math.max(
      12,
      Math.round((base.windGusts10mKmh + Math.cos((d + seedOffset) * 0.9) * 14) * 10) / 10
    );
    const windChillMinC = computeWindChillC(tempMinC, gustMaxKmh * 0.68);
    const snowfallCm = Math.max(
      0,
      Math.round((base.snowfallCm + (wave > 0.3 ? wave * 1.2 : 0)) * 10) / 10
    );
    days.push({ date: dateStr, tempMaxC, tempMinC, windChillMinC, gustMaxKmh, snowfallCm });
  }
  return days;
}

export function buildBaselineStationWeather(
  refDate: Date = new Date()
): StationWeatherTelemetry[] {
  const nowIso = refDate.toISOString();
  return POLAR_STATIONS.map((station, idx) => {
    const base =
      STATION_CLIMATE_BASELINES[station.id] ?? STATION_CLIMATE_BASELINES['great-wall'];
    return {
      stationId: station.id,
      lat: station.lat,
      lon: station.lon,
      ...base,
      windChillC: computeWindChillC(base.temperature2mC, base.windSpeed10mKmh),
      katabaticTier: classifyKatabaticTier(base.windGusts10mKmh),
      dailyForecast: buildSyntheticDailyForecast(base, idx, refDate),
      updatedAtIso: nowIso,
      isFallback: true
    };
  });
}

export interface MarineSamplingNodeSpec {
  id: string;
  label: LocalizedText;
  lat: number;
  lon: number;
  fallbackWaveM: number;
  fallbackPeriodS: number;
  fallbackSstC: number;
  fallbackDailyWavesM: number[];
}

export const MARINE_SAMPLING_NODES: MarineSamplingNodeSpec[] = [
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

export function buildBaselineMarineTelemetry(
  refDate: Date = new Date()
): MarineCorridorTelemetry[] {
  const nowIso = refDate.toISOString();
  return MARINE_SAMPLING_NODES.map((pt) => {
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
}

export const BASELINE_SEA_ICE_SUMMARY: SeaIceSummaryPayload = {
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
      'zh-CN':
        '别林斯高晋海与阿蒙森海海冰密集度偏低；南极半岛北部季节性浮冰正处于春季消退期，而威德尔海腹地仍维持高密集度多年冰。',
      'zh-TW':
        '別林斯高晉海與阿蒙森海海冰密集度偏低；南極半島北部季節性浮冰正處於春季消退期，而威德爾海腹地仍維持高密集度多年冰。',
      'yue-Hant':
        '別林斯高晉海同阿蒙森海一帶嘅海冰比往年少咗一截；南極半島北邊啲浮冰開始融緊方便行船，但威德爾海入面仲係塞滿厚實多年浮冰。',
      pt: 'Concentração de gelo marinho abaixo da média nos mares de Bellingshausen e Amundsen; recuo sazonal em curso no norte da Península Antártica enquanto o gelo compacto persiste no Mar de Weddell.',
      es: 'Concentración de hielo marino inferior a la media en los mares de Bellingshausen y Amundsen; retroceso estacional en el norte de la Península mientras persiste hielo denso en el Mar de Weddell.'
    }
  },
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
