'use client';

import { ChevronDown, ChevronUp, Mountain, Activity } from 'lucide-react';
import { useTranslations } from 'next-intl';
import {
  SubglacialCrossSectionLab,
  type TransectDrawStep
} from '@/components/geology-lab';
import { HikingProfileChart } from '@/components/itinerary-planner/HikingProfileChart';
import type { SupportedLocale } from '@/i18n/routing';
import type {
  BottomDockMode,
  HikingProfileSample,
  SubglacialBedmapGrid,
  SubglacialTransectPreset,
  UnitSystem
} from '@/lib/types';

export interface CollapsibleBottomChartDockProps {
  locale: SupportedLocale;
  units: UnitSystem;
  dockMode: BottomDockMode;
  onChangeDockMode: (mode: BottomDockMode) => void;
  // Subglacial cross-section props
  bedmapGrid: SubglacialBedmapGrid | null;
  presets: SubglacialTransectPreset[];
  selectedPresetId: string;
  transectEndpoints: {
    pointA: { lat: number; lon: number };
    pointB: { lat: number; lon: number };
  };
  isCustomTransect: boolean;
  drawStep: TransectDrawStep;
  onSelectPreset: (preset: SubglacialTransectPreset) => void;
  onToggleDrawMode: () => void;
  // Custom hiking profile props
  hikingSamples: HikingProfileSample[];
  onFocusCoordinates: (lat: number, lon: number, zoom?: number) => void;
}

export function CollapsibleBottomChartDock({
  locale,
  units,
  dockMode,
  onChangeDockMode,
  bedmapGrid,
  presets,
  selectedPresetId,
  transectEndpoints,
  isCustomTransect,
  drawStep,
  onSelectPreset,
  onToggleDrawMode,
  hikingSamples,
  onFocusCoordinates
}: CollapsibleBottomChartDockProps) {
  const tTabs = useTranslations('tabs');
  const isOpen = dockMode !== 'closed';

  return (
    <div className="cryo-card rounded-2xl px-3.5 py-2.5 space-y-2.5 transition-all">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() =>
              onChangeDockMode(
                dockMode === 'subglacial-transect' ? 'closed' : 'subglacial-transect'
              )
            }
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-medium transition ${
              dockMode === 'subglacial-transect'
                ? 'border-fuchsia-400/60 bg-fuchsia-500/20 text-fuchsia-200'
                : 'border-slate-700/80 bg-slate-950/50 text-slate-300 hover:border-sky-400/50 hover:text-white'
            }`}
          >
            <Mountain className="h-3.5 w-3.5 shrink-0" />
            <span>{tTabs('dockSubglacial')}</span>
          </button>

          <button
            type="button"
            disabled={hikingSamples.length === 0}
            onClick={() =>
              onChangeDockMode(
                dockMode === 'hiking-profile' ? 'closed' : 'hiking-profile'
              )
            }
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-xs font-medium transition disabled:opacity-40 ${
              dockMode === 'hiking-profile'
                ? 'border-emerald-400/60 bg-emerald-500/20 text-emerald-200'
                : 'border-slate-700/80 bg-slate-950/50 text-slate-300 hover:border-sky-400/50 hover:text-white'
            }`}
          >
            <Activity className="h-3.5 w-3.5 shrink-0" />
            <span>{tTabs('dockHiking')}</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() =>
            onChangeDockMode(isOpen ? 'closed' : 'subglacial-transect')
          }
          className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900/70 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
        >
          {isOpen ? (
            <>
              <span>{tTabs('dockCollapse')}</span>
              <ChevronDown className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              <span>{tTabs('dockExpand')}</span>
              <ChevronUp className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {dockMode === 'subglacial-transect' && (
        <div className="pt-1 border-t border-slate-800/80">
          <SubglacialCrossSectionLab
            locale={locale}
            units={units}
            bedmapGrid={bedmapGrid}
            presets={presets}
            selectedPresetId={selectedPresetId}
            transectEndpoints={transectEndpoints}
            isCustomTransect={isCustomTransect}
            drawStep={drawStep}
            onSelectPreset={onSelectPreset}
            onToggleDrawMode={onToggleDrawMode}
          />
        </div>
      )}

      {dockMode === 'hiking-profile' && hikingSamples.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80">
          <HikingProfileChart
            locale={locale}
            units={units}
            samples={hikingSamples}
            onHoverCoordinate={(lat, lon) => onFocusCoordinates(lat, lon)}
          />
        </div>
      )}
    </div>
  );
}
