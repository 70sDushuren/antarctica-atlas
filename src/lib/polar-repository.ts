/**
 * Repository Data Access & Client SWR Baseline Cache Layer (V2.0)
 * - Serves full previous valid time-window snapshot from `localStorage` (or embedded baseline)
 *   synchronously on frame 0 so 2D/3D canvas & HUD render with zero network blocking.
 * - Enforces a 15-minute client sync quota window and performs background revalidation
 *   asynchronously during browser idle time (`requestIdleCallback`).
 */

import {
  POLAR_GEOLOGICAL_SITES,
  POLAR_MACRO_REGIONS,
  SCAR_CGA_GAZETTEER,
  SUBGLACIAL_TRANSECT_PRESETS
} from '@/data/geology-and-gazetteer';
import {
  EXPEDITION_CORRIDORS,
  FEATURED_HISTORIC_MONUMENTS,
  HERITAGE_CHRONICLE_ACTS,
  HISTORIC_EXPEDITION_TRACKS,
  SCIENTIFIC_DATA_SOURCES
} from '@/data/heritage-and-corridors';
import { POLAR_LANDING_HOTSPOTS } from '@/data/polar-landing-gazetteer';
import { POLAR_STATIONS } from '@/data/stations';
import {
  CLIENT_SYNC_FRESH_WINDOW_MS,
  CLIENT_TELEMETRY_LKG_KEY,
  persistTelemetrySnapshot,
  readCachedOrBaselineTelemetry,
  type ClientTelemetrySnapshot
} from './telemetry-client-swr.ts';
import type {
  ChronicleAct,
  ExpeditionCorridor,
  GazetteerEntry,
  HistoricExpeditionTrack,
  HistoricMonument,
  MarineCorridorTelemetry,
  PolarGeologicalSite,
  PolarLandingHotspot,
  PolarMacroRegion,
  PolarOutlineDataPack,
  PolarStation,
  SeaIceSummaryPayload,
  StationWeatherTelemetry,
  SubglacialBedmapGrid,
  SubglacialTransectPreset
} from './types.ts';

export {
  CLIENT_SYNC_FRESH_WINDOW_MS,
  CLIENT_TELEMETRY_LKG_KEY,
  persistTelemetrySnapshot,
  readCachedOrBaselineTelemetry,
  type ClientTelemetrySnapshot
};

let inMemoryGeoCache: {
  outlinePack?: PolarOutlineDataPack;
  bedmapGrid?: SubglacialBedmapGrid;
} = {};

export interface PolarRepository {
  getStations(): PolarStation[];
  getStationById(id: string): PolarStation | undefined;
  getLandingHotspots(): PolarLandingHotspot[];
  getExpeditionCorridors(): ExpeditionCorridor[];
  getDefaultCorridor(): ExpeditionCorridor;
  getHistoricMonuments(): HistoricMonument[];
  getChronicleActs(): ChronicleAct[];
  getHistoricTracks(): HistoricExpeditionTrack[];
  getGeologicalSites(): PolarGeologicalSite[];
  getMacroRegions(): PolarMacroRegion[];
  getGazetteerEntries(): GazetteerEntry[];
  getTransectPresets(): SubglacialTransectPreset[];
  getScientificSources(): typeof SCIENTIFIC_DATA_SOURCES;
  getInitialTelemetrySnapshot(): {
    snapshot: ClientTelemetrySnapshot;
    needsBackgroundSync: boolean;
  };
  syncTelemetryInBackground(options?: {
    force?: boolean;
    signal?: AbortSignal;
    currentSnapshot?: ClientTelemetrySnapshot;
  }): Promise<ClientTelemetrySnapshot>;
  fetchStationWeather(signal?: AbortSignal): Promise<StationWeatherTelemetry[]>;
  fetchMarineTelemetry(signal?: AbortSignal): Promise<MarineCorridorTelemetry[]>;
  fetchSeaIceSummary(signal?: AbortSignal): Promise<SeaIceSummaryPayload>;
  fetchPolarOutlinePack(signal?: AbortSignal): Promise<PolarOutlineDataPack>;
  fetchSubglacialBedmapGrid(signal?: AbortSignal): Promise<SubglacialBedmapGrid>;
}

export const polarRepository: PolarRepository = {
  getStations() {
    return POLAR_STATIONS;
  },

  getStationById(id: string) {
    return POLAR_STATIONS.find((s) => s.id === id);
  },

  getLandingHotspots() {
    return POLAR_LANDING_HOTSPOTS;
  },

  getExpeditionCorridors() {
    return EXPEDITION_CORRIDORS;
  },

  getDefaultCorridor() {
    return (
      EXPEDITION_CORRIDORS.find((c) => c.isDefaultPinned) ?? EXPEDITION_CORRIDORS[0]
    );
  },

  getHistoricMonuments() {
    return FEATURED_HISTORIC_MONUMENTS;
  },

  getChronicleActs() {
    return HERITAGE_CHRONICLE_ACTS;
  },

  getHistoricTracks() {
    return HISTORIC_EXPEDITION_TRACKS;
  },

  getGeologicalSites() {
    return POLAR_GEOLOGICAL_SITES;
  },

  getMacroRegions() {
    return POLAR_MACRO_REGIONS;
  },

  getGazetteerEntries() {
    return SCAR_CGA_GAZETTEER;
  },

  getTransectPresets() {
    return SUBGLACIAL_TRANSECT_PRESETS;
  },

  getScientificSources() {
    return SCIENTIFIC_DATA_SOURCES;
  },

  getInitialTelemetrySnapshot() {
    return readCachedOrBaselineTelemetry();
  },

  async syncTelemetryInBackground(options = {}) {
    const initial = readCachedOrBaselineTelemetry();
    const base = options.currentSnapshot ?? initial.snapshot;

    if (!options.force && !initial.needsBackgroundSync) {
      return base;
    }

    // Yield to main UI thread / idle callback first so 3D/2D canvas frames never stutter
    await new Promise<void>((resolve) => {
      if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
        (
          window as Window & {
            requestIdleCallback: (cb: () => void, opts?: { timeout: number }) => number;
          }
        ).requestIdleCallback(() => resolve(), { timeout: 600 });
      } else {
        setTimeout(resolve, 120);
      }
    });

    if (options.signal?.aborted) {
      return base;
    }

    const [weatherRes, marineRes, iceRes] = await Promise.allSettled([
      polarRepository.fetchStationWeather(options.signal),
      polarRepository.fetchMarineTelemetry(options.signal),
      polarRepository.fetchSeaIceSummary(options.signal)
    ]);

    const merged: ClientTelemetrySnapshot = {
      weatherList:
        weatherRes.status === 'fulfilled' && weatherRes.value.length > 0
          ? weatherRes.value
          : base.weatherList,
      marineList:
        marineRes.status === 'fulfilled' && marineRes.value.length > 0
          ? marineRes.value
          : base.marineList,
      seaIce: iceRes.status === 'fulfilled' ? iceRes.value : base.seaIce,
      syncedAtMs: Date.now(),
      source: 'live-async-sync'
    };

    persistTelemetrySnapshot(merged);
    return merged;
  },

  async fetchStationWeather(signal?: AbortSignal) {
    const res = await fetch('/api/weather', { signal });
    if (!res.ok) {
      throw new Error(`Weather telemetry request failed (${res.status})`);
    }
    const data = (await res.json()) as { stations: StationWeatherTelemetry[] };
    return data.stations;
  },

  async fetchMarineTelemetry(signal?: AbortSignal) {
    const res = await fetch('/api/marine', { signal });
    if (!res.ok) {
      throw new Error(`Marine telemetry request failed (${res.status})`);
    }
    const data = (await res.json()) as { points: MarineCorridorTelemetry[] };
    return data.points;
  },

  async fetchSeaIceSummary(signal?: AbortSignal) {
    const res = await fetch('/api/sea-ice', { signal });
    if (!res.ok) {
      throw new Error(`Sea-ice summary request failed (${res.status})`);
    }
    return (await res.json()) as SeaIceSummaryPayload;
  },

  async fetchPolarOutlinePack(signal?: AbortSignal) {
    if (inMemoryGeoCache.outlinePack) {
      return inMemoryGeoCache.outlinePack;
    }
    const res = await fetch('/geo-data/antarctica-outline-epsg3031.json', { signal });
    if (!res.ok) {
      throw new Error(`Failed to load EPSG:3031 polar outline pack (${res.status})`);
    }
    const data = (await res.json()) as PolarOutlineDataPack;
    inMemoryGeoCache = { ...inMemoryGeoCache, outlinePack: data };
    return data;
  },

  async fetchSubglacialBedmapGrid(signal?: AbortSignal) {
    if (inMemoryGeoCache.bedmapGrid) {
      return inMemoryGeoCache.bedmapGrid;
    }
    const res = await fetch('/geo-data/subglacial-bedmap-grid.json', { signal });
    if (!res.ok) {
      throw new Error(`Failed to load Bedmap3 subglacial grid (${res.status})`);
    }
    const data = (await res.json()) as SubglacialBedmapGrid;
    inMemoryGeoCache = { ...inMemoryGeoCache, bedmapGrid: data };
    return data;
  }
};
