/**
 * Module 4 Exploration History & ATCM Heritage Chronicle Contract (`src/components/heritage-chronicle`)
 * Phase 3 Delivery Target:
 * - 4-Act Scrollytelling Chronicle (1773–Present) with camera fly-to synchronization
 * - Amundsen vs. Scott 1911–1912 South Pole race & Shackleton Endurance (HSM-93) track playback
 * - Protected Antarctic Treaty Historic Sites & Monuments (HSM) explorer
 */

import type { SupportedLocale } from '@/i18n/routing';
import type { HistoricMonument } from '@/lib/types';

export interface HeritageChronicleProps {
  locale: SupportedLocale;
  monuments: HistoricMonument[];
  onFocusCoordinates?: (lat: number, lon: number) => void;
}
