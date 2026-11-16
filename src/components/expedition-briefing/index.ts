/**
 * Module 5 Expedition Corridor Multi-Dimensional Briefing Contract (`src/components/expedition-briefing`)
 * Phase 3 Delivery Target:
 * - Default Pinned Corridor #1: Ushuaia -> Drake Passage -> South Shetland Is. -> Antarctic Peninsula -> Weddell Sea
 * - Switchable Corridors #2 (Ross Sea Heritage Huts) & #3 (Punta Arenas -> Union Glacier -> 90°S)
 * - Aggregated 7-day weather/swell window, polar daylight duration, geology highlights & IAATO guidelines
 */

import type { SupportedLocale } from '@/i18n/routing';
import type { ExpeditionCorridor, MarineCorridorTelemetry, UnitSystem } from '@/lib/types';

export interface ExpeditionBriefingProps {
  locale: SupportedLocale;
  units: UnitSystem;
  corridor: ExpeditionCorridor;
  marineTelemetry: MarineCorridorTelemetry[];
  onCorridorChange: (corridorId: string) => void;
}
