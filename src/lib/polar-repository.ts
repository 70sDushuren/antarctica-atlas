/**
 * Repository Data Access Layer (Option A Serverless Edge Baseline -> V2.0 Extensible)
 * Decouples UI & spatial modules from raw HTTP endpoints and static JSON files so V2.0
 * BigQuery / Vertex AI backends can be mounted without refactoring map or i18n components.
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
  SCIENTIFIC_DATA_SOURCES
} from '@/data/heritage-and-corridors';
import { POLAR_STATIONS } from '@/data/stations';
import type {
  ExpeditionCorridor,
  GazetteerEntry,
  HistoricMonument,
  MarineCorridorTelemetry,
  PolarGeologicalSite,
  PolarMacroRegion,
  PolarOutlineDataPack,
  PolarStation,
  SeaIceSummaryPayload,
  StationWeatherTelemetry,
  SubglacialBedmapGrid,
  SubglacialTransectPreset
} from './types';

export interface PolarRepository {
  getStations(): PolarStation[];
  getStationById(id: string): PolarStation | undefined;
  getExpeditionCorridors(): ExpeditionCorridor[];
  getDefaultCorridor(): ExpeditionCorridor;
  getHistoricMonuments(): HistoricMonument[];
  getGeologicalSites(): PolarGeologicalSite[];
  getMacroRegions(): PolarMacroRegion[];
  getGazetteerEntries(): GazetteerEntry[];
  getTransectPresets(): SubglacialTransectPreset[];
  getScientificSources(): typeof SCIENTIFIC_DATA_SOURCES;
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
    const res = await fetch('/geo-data/antarctica-outline-epsg3031.json', { signal });
    if (!res.ok) {
      throw new Error(`Failed to load EPSG:3031 polar outline pack (${res.status})`);
    }
    return (await res.json()) as PolarOutlineDataPack;
  },

  async fetchSubglacialBedmapGrid(signal?: AbortSignal) {
    const res = await fetch('/geo-data/subglacial-bedmap-grid.json', { signal });
    if (!res.ok) {
      throw new Error(`Failed to load Bedmap3 subglacial grid (${res.status})`);
    }
    return (await res.json()) as SubglacialBedmapGrid;
  }
};
