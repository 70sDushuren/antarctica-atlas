import type { SupportedLocale } from '@/i18n/routing';

export type LocalizedText = Record<SupportedLocale, string>;

export type MapViewMode = '3d' | '2d';
export type UnitSystem = 'metric' | 'nautical' | 'imperial';
export type ThemeMode = 'dark' | 'light';
export type PolarBaseLayer = 'gibs-bluemarble' | 'gibs-modis' | 'cryo-vector';

export type AntarcticRegionId =
  | 'antarctic-peninsula'
  | 'west-antarctica'
  | 'east-antarctica'
  | 'ross-sea-sector'
  | 'weddell-sea-sector'
  | 'south-pole-plateau';

export interface PolarStation {
  id: string;
  code: string;
  name: LocalizedText;
  countryCode: string;
  countryName: LocalizedText;
  region: AntarcticRegionId;
  lat: number;
  lon: number;
  elevationM: number;
  seasonality: 'year-round' | 'summer-only';
  establishedYear: number;
  maxCapacity: number;
  summary: LocalizedText;
  sourceUrl: string;
}

export interface HistoricMonument {
  id: string;
  hsmCode: string;
  title: LocalizedText;
  era: 'early-sightings' | 'heroic-age' | 'treaty-igy' | 'modern-stewardship';
  year: number;
  lat: number;
  lon: number;
  proposingParties: string;
  summary: LocalizedText;
  sourceUrl: string;
}

export interface CorridorWaypoint {
  id: string;
  name: LocalizedText;
  lat: number;
  lon: number;
  category: 'gateway' | 'passage' | 'landing' | 'station' | 'heritage';
  highlight: LocalizedText;
}

export interface ExpeditionCorridor {
  id: string;
  isDefaultPinned?: boolean;
  name: LocalizedText;
  durationDays: string;
  distanceNauticalMiles: number;
  summary: LocalizedText;
  waypoints: CorridorWaypoint[];
  sourceUrl: string;
}

export interface DailyStationForecast {
  date: string;
  tempMaxC: number;
  tempMinC: number;
  windChillMinC: number;
  gustMaxKmh: number;
  snowfallCm: number;
}

export interface StationWeatherTelemetry {
  stationId: string;
  lat: number;
  lon: number;
  temperature2mC: number;
  windChillC: number;
  windSpeed10mKmh: number;
  windGusts10mKmh: number;
  windDirectionDeg: number;
  surfacePressureHpa: number;
  snowfallCm: number;
  katabaticTier: 'nominal' | 'watch' | 'severe';
  dailyForecast: DailyStationForecast[];
  updatedAtIso: string;
  isFallback: boolean;
}

export interface MarineCorridorTelemetry {
  pointId: string;
  label: LocalizedText;
  lat: number;
  lon: number;
  waveHeightM: number;
  wavePeriodS: number;
  waveDirectionDeg: number;
  seaSurfaceTempC: number;
  drakeTier: 1 | 2 | 3 | 4 | 5;
  drakeTierCode:
    | 'DRAKE_LAKE'
    | 'GENTLE_SWELL'
    | 'CLASSIC_ROLL'
    | 'DRAKE_SHAKE'
    | 'EXTREME_TEMPEST';
  dailyWaveMaxM: number[];
  updatedAtIso: string;
  isFallback: boolean;
}

export interface MonthlySeaIcePoint {
  monthIndex: number; // 1..12
  median1981To2010Mkm2: number;
  p10Mkm2: number;
  p90Mkm2: number;
  currentYearMkm2: number;
}

export interface SeaIceSummaryPayload {
  source: string;
  secondarySource: string;
  projection: 'EPSG:3031';
  australSpringBaseline: {
    referenceMonth: string;
    extentMillionKm2: number;
    climatologyMedian1981To2010MillionKm2: number;
    anomalyMillionKm2: number;
    regionalNotes: LocalizedText;
  };
  seasonalCycle: MonthlySeaIcePoint[];
}

export interface ProjectedVertex {
  lat: number;
  lon: number;
  x: number;
  y: number;
}

export interface NamedPolygonRing {
  id: string;
  vertices: ProjectedVertex[];
}

export interface PolarOutlineDataPack {
  crs: 'EPSG:3031';
  attribution: {
    basAdd: string;
    epsg3031: string;
  };
  antarcticContinentRing: ProjectedVertex[];
  iceShelves: NamedPolygonRing[];
  southernGateways: Array<{
    id: string;
    coords: Array<{ lat: number; lon: number }>;
  }>;
  treatyBoundary60S: ProjectedVertex[];
  antarcticCircle66S: ProjectedVertex[];
}

export interface SubglacialBedmapGrid {
  crs: 'EPSG:3031';
  reference: string;
  gridBoundsKm: {
    min: number;
    max: number;
    step: number;
  };
  tupleFields: ['surfaceElevationM', 'bedElevationM', 'iceThicknessM'];
  rows: [number, number, number][][];
}

export interface TransectSamplePoint {
  index: number;
  distanceKm: number;
  x: number;
  y: number;
  lat: number;
  lon: number;
  surfaceElevationM: number;
  bedElevationM: number;
  iceThicknessM: number;
  isMarineBasedIceSheet: boolean;
}

export type SubglacialLayerMode = 'bedrock' | 'thickness' | 'surface';

export type GeologyFeatureCategory =
  | 'volcano'
  | 'subglacial-tectonic'
  | 'cryosphere-lake-valley'
  | 'gondwana-fossil';

export interface PolarGeologicalSite {
  id: string;
  category: GeologyFeatureCategory;
  name: LocalizedText;
  geologicAge: LocalizedText;
  lat: number;
  lon: number;
  elevationOrDepthM: number;
  rockOrFeatureType: LocalizedText;
  summary: LocalizedText;
  sourceUrl: string;
}

export interface PolarMacroRegion {
  id: 'east-antarctica' | 'west-antarctica' | 'antarctic-peninsula';
  name: LocalizedText;
  crustalAge: LocalizedText;
  meanIceThicknessM: number;
  seaLevelEquivalentM: number;
  centerLat: number;
  centerLon: number;
  summary: LocalizedText;
}

export interface GazetteerEntry {
  id: string;
  cgaFeatureType: LocalizedText;
  lat: number;
  lon: number;
  names: LocalizedText;
  etymology: LocalizedText;
  firstChartedYear: number;
  sourceUrl: string;
}

export interface SubglacialTransectPreset {
  id: string;
  name: LocalizedText;
  summary: LocalizedText;
  pointA: { lat: number; lon: number; label: LocalizedText };
  pointB: { lat: number; lon: number; label: LocalizedText };
}

export interface ChronicleEventHighlight {
  yearLabel: string;
  title: LocalizedText;
  detail: LocalizedText;
  lat: number;
  lon: number;
}

export interface ChronicleAct {
  id: 'act-1-early' | 'act-2-heroic' | 'act-3-treaty' | 'act-4-modern';
  actNumber: 1 | 2 | 3 | 4;
  yearsRange: string;
  title: LocalizedText;
  leadNarrative: LocalizedText;
  focusLat: number;
  focusLon: number;
  focusZoom: number;
  milestones: ChronicleEventHighlight[];
  sourceUrl: string;
}

export interface HistoricTrackStop {
  dateLabel: string;
  lat: number;
  lon: number;
  title: LocalizedText;
  note: LocalizedText;
}

export interface HistoricExpeditionTrack {
  id: 'amundsen-1911' | 'scott-1911' | 'shackleton-endurance-1915';
  colorHex: string;
  leader: LocalizedText;
  vesselOrBase: LocalizedText;
  years: string;
  summary: LocalizedText;
  stops: HistoricTrackStop[];
  sourceUrl: string;
}

export interface HistoricTrackRenderLayer {
  id: string;
  colorHex: string;
  points: Array<{ lat: number; lon: number }>;
  activeHead?: {
    lat: number;
    lon: number;
    label: string;
  };
}

export type AtlasTabId = 'overview' | 'weather' | 'geology' | 'planner';

export type BottomDockMode = 'closed' | 'subglacial-transect' | 'hiking-profile';

export type DrillDownEntityType =
  | 'station'
  | 'geology'
  | 'hsm'
  | 'gazetteer'
  | 'landing'
  | 'waypoint';

export interface AtlasUrlState {
  mode: MapViewMode;
  units: UnitSystem;
  tab: AtlasTabId;
  region: AntarcticRegionId | 'all';
  inspect: string | null;
  dock: BottomDockMode;
  corridor: string;
  station: string;
  peel: number;
  centerLat: number;
  centerLon: number;
  zoom: number;
  transect: string;
}

export type PolarLandingTerrainType =
  | 'pebble-ash-beach'
  | 'snow-ridge-hike'
  | 'glacier-crevasse-zone'
  | 'sheltered-cove-zodiac'
  | 'inland-blue-ice';

export interface PolarLandingHotspot {
  id: string;
  region: AntarcticRegionId;
  lat: number;
  lon: number;
  typicalElevationGainM: number;
  typicalMaxSlopeDeg: number;
  terrainType: PolarLandingTerrainType;
  aliases: string[];
  name: LocalizedText;
  summary: LocalizedText;
  highlight: LocalizedText;
  sourceUrl: string;
}

export type ItineraryImportSourceType =
  | 'gpx'
  | 'geojson'
  | 'kml'
  | 'csv'
  | 'text'
  | 'preset'
  | 'manual';

export type ItineraryActivityType =
  | 'cruise'
  | 'zodiac-landing'
  | 'hiking'
  | 'camping'
  | 'flight';

export interface UserItineraryWaypoint {
  id: string;
  dayNumber?: number;
  plannedDate?: string;
  name: string;
  lat: number;
  lon: number;
  elevationM?: number;
  activityType: ItineraryActivityType;
  plannedHours?: number;
  notes?: string;
  matchedGazetteerId?: string;
}

export type PolarHikingDifficultyTier = 1 | 2 | 3 | 4 | 5;

export interface HikingProfileSample {
  distanceKm: number;
  lat: number;
  lon: number;
  elevationM: number;
  slopeDeg: number;
  windChillC: number;
  gustKmh: number;
  difficultyTier: PolarHikingDifficultyTier;
}

export interface NearbySpatialAnchor {
  id: string;
  anchorType: 'station' | 'geology' | 'hsm' | 'landing';
  code?: string;
  distanceKm: number;
  lat: number;
  lon: number;
  name: LocalizedText;
}

export interface SegmentAdvisoryReport {
  segmentIndex: number;
  waypointId: string;
  title: string;
  lat: number;
  lon: number;
  plannedDate: string;
  activityType: ItineraryActivityType;
  legDistanceKm: number;
  elevationGainM: number;
  maxElevationM: number;
  maxSlopeDeg: number;
  surfaceType:
    | 'coastal-rock-ash'
    | 'grounded-ice-sheet'
    | 'floating-ice-shelf'
    | 'open-water';
  weatherSourceMode: 'live-forecast' | 'seasonal-climatology';
  expectedTempC: number;
  expectedWindChillC: number;
  expectedGustKmh: number;
  katabaticTier: 'nominal' | 'watch' | 'severe';
  waveHeightM?: number;
  drakeTier?: 1 | 2 | 3 | 4 | 5;
  daylightHours: number;
  solarRegime: 'polar-day' | 'polar-night' | 'diurnal';
  hikingDifficultyTier: PolarHikingDifficultyTier;
  compositeRiskScore: number;
  gearKeys: string[];
  hackKeys: string[];
  nearbyAnchors: NearbySpatialAnchor[];
}

export interface ItineraryEvaluationResult {
  evaluatedAtIso: string;
  simulateLiveNow: boolean;
  overallDifficultyTier: PolarHikingDifficultyTier;
  totalDistanceKm: number;
  totalElevationGainM: number;
  minWindChillC: number;
  maxGustKmh: number;
  peakWaveM: number;
  meanDaylightHours: number;
  recommendedGearKeys: string[];
  topPolarHackKeys: string[];
  segments: SegmentAdvisoryReport[];
  profileSamples: HikingProfileSample[];
}

export interface SavedUserItinerary {
  id: string;
  userId: string;
  title: string;
  notes: string;
  shareSlug: string;
  isPublic: boolean;
  sourceType: ItineraryImportSourceType;
  startDate: string | null;
  endDate: string | null;
  overallDifficulty: PolarHikingDifficultyTier;
  totalDistanceKm: number;
  waypoints: UserItineraryWaypoint[];
  advisory: ItineraryEvaluationResult | null;
  createdAtIso: string;
  updatedAtIso: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin';
  preferredLocale: SupportedLocale;
  preferredUnits: UnitSystem;
  preferredMode: MapViewMode;
  bookmarkedIds: string[];
  createdAtIso: string;
}

export interface TelemetryEventInput {
  sessionKey: string;
  locale: SupportedLocale;
  eventCategory: 'navigation' | 'drilldown' | 'canvas' | 'planner' | 'auth';
  eventName: string;
  activeTab?: AtlasTabId;
  drilldownLevel?: 1 | 2 | 3;
  targetType?: string;
  targetId?: string;
  dwellMs?: number;
  lat?: number;
  lon?: number;
  properties?: Record<string, string | number | boolean | null>;
}
