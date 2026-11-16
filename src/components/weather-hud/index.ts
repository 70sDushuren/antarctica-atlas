/**
 * Module 1 Live Polar Weather, Katabatic Gust & Sea-Ice HUD Contract (`src/components/weather-hud`)
 * Phase 1 Delivery Target:
 * - 35+ Station live & 7-day forecast drawer (Open-Meteo ECMWF IFS)
 * - 5-Tier Drake Passage Sea-State gauge (`Drake Shake Index`)
 * - NSIDC Sea Ice Index v4 extent & 1981–2010 anomaly ECharts curve
 */

import type { SupportedLocale } from '@/i18n/routing';
import type {
  MarineCorridorTelemetry,
  SeaIceSummaryPayload,
  StationWeatherTelemetry,
  UnitSystem
} from '@/lib/types';

export interface WeatherTelemetryHudProps {
  locale: SupportedLocale;
  units: UnitSystem;
  stations: StationWeatherTelemetry[];
  marineCorridor: MarineCorridorTelemetry[];
  seaIce?: SeaIceSummaryPayload;
}
