import { SUBGLACIAL_TRANSECT_PRESETS } from '../data/geology-and-gazetteer.ts';
import { EXPEDITION_CORRIDORS } from '../data/heritage-and-corridors.ts';
import { POLAR_STATIONS } from '../data/stations.ts';
import type {
  AntarcticRegionId,
  AtlasTabId,
  AtlasUrlState,
  BottomDockMode,
  MapViewMode,
  UnitSystem
} from './types.ts';

export const LAST_VIEW_SESSION_STORAGE_KEY = 'antarctica_atlas_last_view_state_v2';

const VALID_TABS: readonly AtlasTabId[] = ['overview', 'weather', 'geology', 'planner'];
const VALID_REGIONS: readonly (AntarcticRegionId | 'all')[] = [
  'all',
  'antarctic-peninsula',
  'west-antarctica',
  'east-antarctica',
  'ross-sea-sector',
  'weddell-sea-sector',
  'south-pole-plateau'
];
const VALID_DOCKS: readonly BottomDockMode[] = [
  'closed',
  'subglacial-transect',
  'hiking-profile'
];

export const DEFAULT_ATLAS_URL_STATE: AtlasUrlState = {
  mode: '3d',
  units: 'nautical',
  tab: 'overview',
  region: 'all',
  inspect: null,
  dock: 'closed',
  corridor:
    EXPEDITION_CORRIDORS.find((c) => c.isDefaultPinned)?.id ?? 'peninsula-weddell',
  station: 'great-wall',
  peel: 25,
  centerLat: -62.2163,
  centerLon: -58.9622,
  zoom: 3,
  transect: SUBGLACIAL_TRANSECT_PRESETS[0].id
};

export function normalizeLongitudeDeg(lonDeg: number): number {
  if (!Number.isFinite(lonDeg)) return DEFAULT_ATLAS_URL_STATE.centerLon;
  const wrapped = ((((lonDeg + 180) % 360) + 360) % 360) - 180;
  return wrapped === -180 && lonDeg > 0 ? 180 : Math.round(wrapped * 10000) / 10000;
}

export function clampPolarGlobeLatDeg(latDeg: number): number {
  if (!Number.isFinite(latDeg)) return DEFAULT_ATLAS_URL_STATE.centerLat;
  return Math.round(Math.max(-90, Math.min(-25, latDeg)) * 10000) / 10000;
}

export function parseAtlasUrlState(
  params: URLSearchParams | Readonly<URLSearchParams> | null
): AtlasUrlState {
  if (!params) {
    return { ...DEFAULT_ATLAS_URL_STATE };
  }

  const rawMode = params.get('mode');
  const mode: MapViewMode =
    rawMode === '2d' || rawMode === '3d' ? rawMode : DEFAULT_ATLAS_URL_STATE.mode;

  const rawUnits = params.get('units');
  const units: UnitSystem =
    rawUnits === 'metric' || rawUnits === 'nautical' || rawUnits === 'imperial'
      ? rawUnits
      : DEFAULT_ATLAS_URL_STATE.units;

  const rawTab = params.get('tab');
  const tab: AtlasTabId = VALID_TABS.includes(rawTab as AtlasTabId)
    ? (rawTab as AtlasTabId)
    : DEFAULT_ATLAS_URL_STATE.tab;

  const rawRegion = params.get('region');
  const region: AntarcticRegionId | 'all' = VALID_REGIONS.includes(
    rawRegion as AntarcticRegionId | 'all'
  )
    ? (rawRegion as AntarcticRegionId | 'all')
    : DEFAULT_ATLAS_URL_STATE.region;

  const rawInspect = params.get('inspect');
  const inspect =
    rawInspect && /^[a-z0-9_-]+:[a-zA-Z0-9_-]+$/.test(rawInspect) ? rawInspect : null;

  const rawDock = params.get('dock');
  const dock: BottomDockMode = VALID_DOCKS.includes(rawDock as BottomDockMode)
    ? (rawDock as BottomDockMode)
    : DEFAULT_ATLAS_URL_STATE.dock;

  const rawCorridor = params.get('corridor');
  const corridor = EXPEDITION_CORRIDORS.some((c) => c.id === rawCorridor)
    ? (rawCorridor as string)
    : DEFAULT_ATLAS_URL_STATE.corridor;

  const rawStation = params.get('station');
  const matchedStation = POLAR_STATIONS.find((s) => s.id === rawStation);
  const station = matchedStation ? matchedStation.id : DEFAULT_ATLAS_URL_STATE.station;

  const rawPeel = Number(params.get('peel'));
  const peel =
    Number.isFinite(rawPeel) && params.has('peel')
      ? Math.max(0, Math.min(100, Math.round(rawPeel)))
      : DEFAULT_ATLAS_URL_STATE.peel;

  const rawLat = Number(params.get('lat'));
  const centerLat =
    Number.isFinite(rawLat) && params.has('lat')
      ? Math.max(-90, Math.min(0, rawLat))
      : (matchedStation?.lat ?? DEFAULT_ATLAS_URL_STATE.centerLat);

  const rawLon = Number(params.get('lon'));
  const centerLon =
    Number.isFinite(rawLon) && params.has('lon')
      ? normalizeLongitudeDeg(rawLon)
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

  return {
    mode,
    units,
    tab,
    region,
    inspect,
    dock,
    corridor,
    station,
    peel,
    centerLat,
    centerLon,
    zoom,
    transect
  };
}

export function serializeAtlasUrlState(state: AtlasUrlState): string {
  const sp = new URLSearchParams();
  sp.set('mode', state.mode);
  sp.set('units', state.units);
  sp.set('tab', state.tab);
  if (state.region !== 'all') {
    sp.set('region', state.region);
  }
  if (state.inspect) {
    sp.set('inspect', state.inspect);
  }
  if (state.dock !== 'closed') {
    sp.set('dock', state.dock);
  }
  sp.set('corridor', state.corridor);
  sp.set('station', state.station);
  sp.set('peel', String(state.peel));
  sp.set('lat', state.centerLat.toFixed(4));
  sp.set('lon', normalizeLongitudeDeg(state.centerLon).toFixed(4));
  sp.set('zoom', String(state.zoom));
  sp.set('transect', state.transect);
  return sp.toString();
}

export function resolveInitialAtlasState(
  routerSearchParams: URLSearchParams | Readonly<URLSearchParams> | null,
  browserSearch?: string,
  sessionSnapshotQuery?: string | null
): AtlasUrlState {
  const cleanBrowserSearch = (browserSearch || '').replace(/^\?/, '').trim();
  if (cleanBrowserSearch.length > 0) {
    return parseAtlasUrlState(new URLSearchParams(cleanBrowserSearch));
  }

  if (routerSearchParams && routerSearchParams.toString().length > 0) {
    return parseAtlasUrlState(routerSearchParams);
  }

  if (sessionSnapshotQuery && sessionSnapshotQuery.trim().length > 0) {
    return parseAtlasUrlState(new URLSearchParams(sessionSnapshotQuery));
  }

  return { ...DEFAULT_ATLAS_URL_STATE };
}

export function safeReplaceUrlQuery(pathname: string, query: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const nextUrl = query ? `${pathname}?${query}` : pathname;
    if (`${window.location.pathname}${window.location.search}` === nextUrl) {
      return true;
    }
    window.history.replaceState(window.history.state, '', nextUrl);
    return true;
  } catch {
    return false;
  }
}
