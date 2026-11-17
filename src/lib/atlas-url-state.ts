'use client';

import { useCallback, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SUBGLACIAL_TRANSECT_PRESETS } from '@/data/geology-and-gazetteer';
import { EXPEDITION_CORRIDORS } from '@/data/heritage-and-corridors';
import { POLAR_STATIONS } from '@/data/stations';
import type { AtlasUrlState, MapViewMode, UnitSystem } from './types';

export const DEFAULT_ATLAS_URL_STATE: AtlasUrlState = {
  mode: '3d',
  units: 'nautical',
  corridor:
    EXPEDITION_CORRIDORS.find((c) => c.isDefaultPinned)?.id ?? 'peninsula-weddell',
  station: 'great-wall',
  peel: 25,
  centerLat: -62.2163,
  centerLon: -58.9622,
  zoom: 3,
  transect: SUBGLACIAL_TRANSECT_PRESETS[0].id
};

export function parseAtlasUrlState(
  params: URLSearchParams | Readonly<URLSearchParams> | null
): AtlasUrlState {
  if (!params) {
    return { ...DEFAULT_ATLAS_URL_STATE };
  }

  const rawMode = params.get('mode');
  const mode: MapViewMode = rawMode === '2d' || rawMode === '3d' ? rawMode : DEFAULT_ATLAS_URL_STATE.mode;

  const rawUnits = params.get('units');
  const units: UnitSystem =
    rawUnits === 'metric' || rawUnits === 'nautical' || rawUnits === 'imperial'
      ? rawUnits
      : DEFAULT_ATLAS_URL_STATE.units;

  const rawCorridor = params.get('corridor');
  const corridor = EXPEDITION_CORRIDORS.some((c) => c.id === rawCorridor)
    ? (rawCorridor as string)
    : DEFAULT_ATLAS_URL_STATE.corridor;

  const rawStation = params.get('station');
  const matchedStation = POLAR_STATIONS.find((s) => s.id === rawStation);
  const station = matchedStation ? matchedStation.id : DEFAULT_ATLAS_URL_STATE.station;

  const rawPeel = Number(params.get('peel'));
  const peel = Number.isFinite(rawPeel) && params.has('peel')
    ? Math.max(0, Math.min(100, Math.round(rawPeel)))
    : DEFAULT_ATLAS_URL_STATE.peel;

  const rawLat = Number(params.get('lat'));
  const centerLat =
    Number.isFinite(rawLat) && params.has('lat') && rawLat >= -90 && rawLat <= 0
      ? rawLat
      : (matchedStation?.lat ?? DEFAULT_ATLAS_URL_STATE.centerLat);

  const rawLon = Number(params.get('lon'));
  const centerLon =
    Number.isFinite(rawLon) && params.has('lon') && rawLon >= -180 && rawLon <= 180
      ? rawLon
      : (matchedStation?.lon ?? DEFAULT_ATLAS_URL_STATE.centerLon);

  const rawZoom = Number(params.get('zoom'));
  const zoom =
    Number.isFinite(rawZoom) && params.has('zoom') && rawZoom >= 0 && rawZoom <= 12
      ? rawZoom
      : DEFAULT_ATLAS_URL_STATE.zoom;

  const rawTransect = params.get('transect');
  const transect = SUBGLACIAL_TRANSECT_PRESETS.some((p) => p.id === rawTransect)
    ? (rawTransect as string)
    : DEFAULT_ATLAS_URL_STATE.transect;

  return { mode, units, corridor, station, peel, centerLat, centerLon, zoom, transect };
}

export function serializeAtlasUrlState(state: AtlasUrlState): string {
  const sp = new URLSearchParams();
  sp.set('mode', state.mode);
  sp.set('units', state.units);
  sp.set('corridor', state.corridor);
  sp.set('station', state.station);
  sp.set('peel', String(state.peel));
  sp.set('lat', state.centerLat.toFixed(4));
  sp.set('lon', state.centerLon.toFixed(4));
  sp.set('zoom', String(state.zoom));
  sp.set('transect', state.transect);
  return sp.toString();
}

/**
 * Stateful URL-synced hook ensuring 2D/3D mode, unit system, corridor, station,
 * ice-peel slider, and camera coordinates persist seamlessly across 6-locale switches.
 */
export function useAtlasUrlState() {
  const searchParams = useSearchParams();
  const [state, setState] = useState<AtlasUrlState>(() =>
    parseAtlasUrlState(searchParams)
  );

  const updateAtlasState = useCallback((patch: Partial<AtlasUrlState>) => {
    setState((prev) => {
      const next: AtlasUrlState = { ...prev, ...patch };
      if (typeof window !== 'undefined') {
        const query = serializeAtlasUrlState(next);
        const nextUrl = `${window.location.pathname}?${query}`;
        window.history.replaceState(window.history.state, '', nextUrl);
      }
      return next;
    });
  }, []);

  return { atlasState: state, updateAtlasState };
}
