/**
 * Module 1/2 Spatial Canvas Contract (`src/components/atlas-canvas`)
 * Phase 1 Delivery Target:
 * - Seamless 3D Polar Globe (CesiumJS / WebGL ECEF) <-> 2D Native EPSG:3031 (Leaflet + Proj4Leaflet)
 * - NASA Earthdata GIBS EPSG:3031 WMTS imagery streaming
 * - Synchronized camera state via `useAtlasUrlState`
 */

import type { SupportedLocale } from '@/i18n/routing';
import type { AtlasUrlState } from '@/lib/types';

export interface DualModeAtlasCanvasProps {
  locale: SupportedLocale;
  state: AtlasUrlState;
  onCameraChange?: (patch: Partial<Pick<AtlasUrlState, 'centerLat' | 'centerLon' | 'zoom'>>) => void;
  onSelectStation?: (stationId: string) => void;
}
