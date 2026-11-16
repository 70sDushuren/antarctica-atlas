/**
 * Module 2 Subglacial Geology & Cryosphere Cross-Section Lab Contract (`src/components/geology-lab`)
 * Phase 2 Delivery Target:
 * - Bedmap3 Ice-Peel opacity & threshold controller
 * - Interactive 2-point planar EPSG:3031 cross-section profiler (`sampleSubglacialTransect` + ECharts)
 * - SCAR GeoMAP bedrock outcrops, Gondwana fossil sites, and Erebus/Deception volcanic features
 */

import type { SupportedLocale } from '@/i18n/routing';
import type { SubglacialBedmapGrid, TransectSamplePoint, UnitSystem } from '@/lib/types';

export interface SubglacialProfilerProps {
  locale: SupportedLocale;
  units: UnitSystem;
  grid: SubglacialBedmapGrid;
  transectSamples: TransectSamplePoint[];
}
