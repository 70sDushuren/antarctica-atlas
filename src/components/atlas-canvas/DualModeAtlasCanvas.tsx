'use client';

import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { Compass, Layers, Sun } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import { wgs84ToEpsg3031 } from '@/lib/polar-math';
import { polarRepository } from '@/lib/polar-repository';
import type {
  AtlasUrlState,
  ExpeditionCorridor,
  HistoricMonument,
  PolarBaseLayer,
  PolarOutlineDataPack,
  PolarStation,
  StationWeatherTelemetry,
  SubglacialBedmapGrid
} from '@/lib/types';

const PolarGlobe3D = dynamic(() => import('./PolarGlobe3D'), {
  ssr: false
});

const PolarMap2DEpsg3031 = dynamic(() => import('./PolarMap2DEpsg3031'), {
  ssr: false
});

export interface DualModeAtlasCanvasProps {
  locale: SupportedLocale;
  atlasState: AtlasUrlState;
  stations: PolarStation[];
  weatherList: StationWeatherTelemetry[];
  monuments: HistoricMonument[];
  activeCorridor: ExpeditionCorridor;
  onUpdateState: (patch: Partial<AtlasUrlState>) => void;
}

export function DualModeAtlasCanvas({
  locale,
  atlasState,
  stations,
  weatherList,
  monuments,
  activeCorridor,
  onUpdateState
}: DualModeAtlasCanvasProps) {
  const tCanvas = useTranslations('canvas');
  const [outlinePack, setOutlinePack] = useState<PolarOutlineDataPack | null>(null);
  const [bedmapGrid, setBedmapGrid] = useState<SubglacialBedmapGrid | null>(null);
  const [baseLayer, setBaseLayer] = useState<PolarBaseLayer>('gibs-bluemarble');
  const [showSolarTerminator, setShowSolarTerminator] = useState<boolean>(true);
  const [cursorCoords, setCursorCoords] = useState<{
    lat: number;
    lon: number;
    xKm: number;
    yKm: number;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    polarRepository
      .fetchPolarOutlinePack(controller.signal)
      .then(setOutlinePack)
      .catch(() => {});
    polarRepository
      .fetchSubglacialBedmapGrid(controller.signal)
      .then(setBedmapGrid)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const weatherByStation = useMemo(() => {
    const map: Record<string, StationWeatherTelemetry> = {};
    for (const w of weatherList) {
      map[w.stationId] = w;
    }
    return map;
  }, [weatherList]);

  const camProjected = wgs84ToEpsg3031(atlasState.centerLat, atlasState.centerLon);

  return (
    <div className="cryo-card rounded-2xl p-3.5 flex flex-col gap-3">
      {/* Top Canvas Layer & Quick-Jump Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          {atlasState.mode === '2d' && (
            <div className="inline-flex flex-wrap items-center gap-1 rounded-xl border border-sky-400/25 bg-slate-950/60 p-1">
              <Layers className="ml-1.5 h-3.5 w-3.5 text-sky-400" />
              {(
                [
                  ['gibs-bluemarble', tCanvas('layerBlueMarble')],
                  ['gibs-modis', tCanvas('layerModis')],
                  ['cryo-vector', tCanvas('layerCryoVector')]
                ] as const
              ).map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setBaseLayer(id)}
                  className={`min-w-0 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                    baseLayer === id
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowSolarTerminator((prev) => !prev)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition ${
              showSolarTerminator
                ? 'border-amber-400/50 bg-amber-500/15 text-amber-200'
                : 'border-slate-700 bg-slate-950/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            <span>{tCanvas('solarOverlay')}</span>
          </button>
        </div>

        {/* Sector Quick-Jump Presets */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Compass className="h-3.5 w-3.5 text-sky-400 hidden sm:inline" />
          <button
            type="button"
            onClick={() =>
              onUpdateState({ centerLat: -63.2, centerLon: -60.0, zoom: 3, station: 'great-wall' })
            }
            className="rounded-lg border border-sky-400/25 bg-slate-950/50 px-2 py-1 text-[11px] text-sky-200 hover:border-sky-400/60"
          >
            {tCanvas('focusPeninsula')}
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateState({ centerLat: -90.0, centerLon: 0.0, zoom: 3, station: 'amundsen-scott' })
            }
            className="rounded-lg border border-sky-400/25 bg-slate-950/50 px-2 py-1 text-[11px] text-sky-200 hover:border-sky-400/60"
          >
            {tCanvas('focusSouthPole')}
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateState({ centerLat: -76.5, centerLon: 175.0, zoom: 3, station: 'mcmurdo' })
            }
            className="rounded-lg border border-sky-400/25 bg-slate-950/50 px-2 py-1 text-[11px] text-sky-200 hover:border-sky-400/60"
          >
            {tCanvas('focusRoss180')}
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateState({ centerLat: -80.42, centerLon: 77.12, zoom: 3, station: 'kunlun' })
            }
            className="rounded-lg border border-sky-400/25 bg-slate-950/50 px-2 py-1 text-[11px] text-sky-200 hover:border-sky-400/60"
          >
            {tCanvas('focusDomeA')}
          </button>
        </div>
      </div>

      {/* Main Spatial Canvas Viewport */}
      <div className="relative h-[430px] md:h-[470px] w-full overflow-hidden rounded-xl border border-sky-400/20">
        {atlasState.mode === '3d' ? (
          <PolarGlobe3D
            locale={locale}
            centerLat={atlasState.centerLat}
            centerLon={atlasState.centerLon}
            zoom={atlasState.zoom}
            peelPercent={atlasState.peel}
            showSolarTerminator={showSolarTerminator}
            outlinePack={outlinePack}
            bedmapGrid={bedmapGrid}
            stations={stations}
            weatherByStation={weatherByStation}
            selectedStationId={atlasState.station}
            monuments={monuments}
            activeCorridor={activeCorridor}
            onCameraChange={(patch) => onUpdateState(patch)}
            onSelectStation={(stationId) => onUpdateState({ station: stationId })}
            onCursorMove={setCursorCoords}
          />
        ) : (
          <PolarMap2DEpsg3031
            locale={locale}
            centerLat={atlasState.centerLat}
            centerLon={atlasState.centerLon}
            zoom={atlasState.zoom}
            peelPercent={atlasState.peel}
            baseLayer={baseLayer}
            showSolarTerminator={showSolarTerminator}
            outlinePack={outlinePack}
            bedmapGrid={bedmapGrid}
            stations={stations}
            weatherByStation={weatherByStation}
            selectedStationId={atlasState.station}
            monuments={monuments}
            activeCorridor={activeCorridor}
            onCameraChange={(patch) => onUpdateState(patch)}
            onSelectStation={(stationId) => onUpdateState({ station: stationId })}
            onCursorMove={setCursorCoords}
          />
        )}
      </div>

      {/* Bottom Spatial Telemetry & Projection Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-300">
        <span>
          {atlasState.mode === '3d' ? tCanvas('dragHint3d') : tCanvas('dragHint2d')}
        </span>
        <span className="font-mono text-sky-300">
          {cursorCoords
            ? `${tCanvas('cursorCoords')}: ${cursorCoords.lat.toFixed(2)}°, ${cursorCoords.lon.toFixed(2)}° · X ${cursorCoords.xKm}km Y ${cursorCoords.yKm}km`
            : `Camera: ${atlasState.centerLat.toFixed(2)}°, ${atlasState.centerLon.toFixed(2)}° · EPSG:3031 (${Math.round(camProjected.x / 1000)}km, ${Math.round(camProjected.y / 1000)}km)`}
        </span>
      </div>
    </div>
  );
}
