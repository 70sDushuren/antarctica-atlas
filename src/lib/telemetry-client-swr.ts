import {
  BASELINE_SEA_ICE_SUMMARY,
  buildBaselineMarineTelemetry,
  buildBaselineStationWeather
} from './telemetry-baseline.ts';
import type {
  MarineCorridorTelemetry,
  SeaIceSummaryPayload,
  StationWeatherTelemetry
} from './types.ts';

export const CLIENT_TELEMETRY_LKG_KEY = 'antarctica_atlas_telemetry_lkg_v2';
export const CLIENT_SYNC_FRESH_WINDOW_MS = 15 * 60_000; // 15-minute client rate-limit protection

export interface ClientTelemetrySnapshot {
  weatherList: StationWeatherTelemetry[];
  marineList: MarineCorridorTelemetry[];
  seaIce: SeaIceSummaryPayload;
  syncedAtMs: number;
  source: 'cached-valid-window' | 'embedded-baseline' | 'live-async-sync';
}

export function readCachedOrBaselineTelemetry(
  storage?: Pick<Storage, 'getItem'> | null,
  nowMs: number = Date.now()
): { snapshot: ClientTelemetrySnapshot; needsBackgroundSync: boolean } {
  const effectiveStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
        ? window.localStorage
        : null;

  if (effectiveStorage) {
    try {
      const raw = effectiveStorage.getItem(CLIENT_TELEMETRY_LKG_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ClientTelemetrySnapshot>;
        if (
          Array.isArray(parsed.weatherList) &&
          parsed.weatherList.length > 0 &&
          Array.isArray(parsed.marineList) &&
          parsed.marineList.length > 0 &&
          parsed.seaIce &&
          typeof parsed.syncedAtMs === 'number'
        ) {
          const isFresh = nowMs - parsed.syncedAtMs < CLIENT_SYNC_FRESH_WINDOW_MS;
          return {
            snapshot: {
              weatherList: parsed.weatherList,
              marineList: parsed.marineList,
              seaIce: parsed.seaIce,
              syncedAtMs: parsed.syncedAtMs,
              source: 'cached-valid-window'
            },
            needsBackgroundSync: !isFresh
          };
        }
      }
    } catch {
      // Ignore storage parse failure and fall back to embedded baseline
    }
  }

  return {
    snapshot: {
      weatherList: buildBaselineStationWeather(),
      marineList: buildBaselineMarineTelemetry(),
      seaIce: BASELINE_SEA_ICE_SUMMARY,
      syncedAtMs: 0,
      source: 'embedded-baseline'
    },
    needsBackgroundSync: true
  };
}

export function persistTelemetrySnapshot(
  snapshot: ClientTelemetrySnapshot,
  storage?: Pick<Storage, 'setItem'> | null
): void {
  const effectiveStorage =
    storage !== undefined
      ? storage
      : typeof window !== 'undefined'
        ? window.localStorage
        : null;
  if (!effectiveStorage) return;
  try {
    effectiveStorage.setItem(CLIENT_TELEMETRY_LKG_KEY, JSON.stringify(snapshot));
  } catch {
    // Quota safe no-op
  }
}
