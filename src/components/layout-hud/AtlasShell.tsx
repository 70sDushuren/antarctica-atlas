'use client';

import { Suspense, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DualModeAtlasCanvas } from '@/components/atlas-canvas';
import {
  GeologySitesAndRegionsPanel,
  PolarGazetteerSearch,
  SubglacialCrossSectionLab,
  type TransectDrawStep
} from '@/components/geology-lab';
import {
  DrakeSeaStateCard,
  SeaIceAnomalyCard,
  StationWeatherPanel
} from '@/components/weather-hud';
import type { SupportedLocale } from '@/i18n/routing';
import {
  DEFAULT_ATLAS_URL_STATE,
  useAtlasUrlState
} from '@/lib/atlas-url-state';
import { polarRepository } from '@/lib/polar-repository';
import type {
  MarineCorridorTelemetry,
  PolarOutlineDataPack,
  SeaIceSummaryPayload,
  StationWeatherTelemetry,
  SubglacialBedmapGrid,
  SubglacialLayerMode,
  ThemeMode,
  UnitSystem
} from '@/lib/types';
import { LanguageSwitcher } from './LanguageSwitcher';

const UNIT_CYCLE: UnitSystem[] = ['nautical', 'metric', 'imperial'];

function AtlasShellContent({ locale }: { locale: SupportedLocale }) {
  const tBrand = useTranslations('brand');
  const tNav = useTranslations('nav');
  const tGeo = useTranslations('geology');
  const tCor = useTranslations('corridor');
  const tFoot = useTranslations('footer');

  const { atlasState, updateAtlasState } = useAtlasUrlState();
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [subglacialLayerMode, setSubglacialLayerMode] =
    useState<SubglacialLayerMode>('bedrock');
  const [outlinePack, setOutlinePack] = useState<PolarOutlineDataPack | null>(null);
  const [bedmapGrid, setBedmapGrid] = useState<SubglacialBedmapGrid | null>(null);
  const [weatherList, setWeatherList] = useState<StationWeatherTelemetry[]>([]);
  const [marineList, setMarineList] = useState<MarineCorridorTelemetry[]>([]);
  const [seaIce, setSeaIce] = useState<SeaIceSummaryPayload | null>(null);

  const transectPresets = polarRepository.getTransectPresets();
  const activePreset =
    transectPresets.find((p) => p.id === atlasState.transect) ?? transectPresets[0];

  const [drawStep, setDrawStep] = useState<TransectDrawStep>('idle');
  const [customEndpoints, setCustomEndpoints] = useState<{
    pointA: { lat: number; lon: number };
    pointB: { lat: number; lon: number };
  } | null>(null);
  const [draftPointA, setDraftPointA] = useState<{ lat: number; lon: number } | null>(
    null
  );

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
    polarRepository
      .fetchStationWeather(controller.signal)
      .then(setWeatherList)
      .catch(() => {});
    polarRepository
      .fetchMarineTelemetry(controller.signal)
      .then(setMarineList)
      .catch(() => {});
    polarRepository
      .fetchSeaIceSummary(controller.signal)
      .then(setSeaIce)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const corridors = polarRepository.getExpeditionCorridors();
  const stations = polarRepository.getStations();
  const monuments = polarRepository.getHistoricMonuments();
  const geologicalSites = polarRepository.getGeologicalSites();
  const macroRegions = polarRepository.getMacroRegions();
  const gazetteerEntries = polarRepository.getGazetteerEntries();
  const scientificSources = polarRepository.getScientificSources();

  const activeCorridor =
    corridors.find((c) => c.id === atlasState.corridor) ??
    polarRepository.getDefaultCorridor();

  const effectiveTransectEndpoints = useMemo(() => {
    if (customEndpoints) return customEndpoints;
    return {
      pointA: { lat: activePreset.pointA.lat, lon: activePreset.pointA.lon },
      pointB: { lat: activePreset.pointB.lat, lon: activePreset.pointB.lon }
    };
  }, [customEndpoints, activePreset]);

  function handleMapClickForTransect(lat: number, lon: number) {
    const rounded = {
      lat: Math.round(lat * 100) / 100,
      lon: Math.round(lon * 100) / 100
    };
    if (drawStep === 'pick-a') {
      setDraftPointA(rounded);
      setDrawStep('pick-b');
    } else if (drawStep === 'pick-b') {
      const start = draftPointA ?? effectiveTransectEndpoints.pointA;
      setCustomEndpoints({ pointA: start, pointB: rounded });
      setDraftPointA(null);
      setDrawStep('idle');
    }
  }

  function toggleTheme() {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    if (typeof document !== 'undefined') {
      document.documentElement.dataset.theme = next;
    }
  }

  function cycleUnits() {
    const idx = UNIT_CYCLE.indexOf(atlasState.units);
    const nextUnits = UNIT_CYCLE[(idx + 1) % UNIT_CYCLE.length];
    updateAtlasState({ units: nextUnits });
  }

  const unitLabel =
    atlasState.units === 'metric'
      ? tNav('unitsMetric')
      : atlasState.units === 'imperial'
        ? tNav('unitsImperial')
        : tNav('unitsNautical');

  return (
    <div className="min-h-screen flex flex-col justify-between p-4 md:p-6 gap-5">
      {/* Top Cryo-Glass Navigation & 6-Locale Switcher */}
      <header className="cryo-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sky-400">
              {tBrand('title')}
            </h1>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
              {tBrand('treatyBadge')}
            </span>
          </div>
          <p className="mt-1 text-xs md:text-sm text-slate-300">{tBrand('subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* 3D Globe <-> 2D EPSG:3031 Dual-Mode Switch */}
          <div className="inline-flex rounded-xl border border-sky-400/25 bg-slate-950/50 p-1">
            <button
              type="button"
              onClick={() => updateAtlasState({ mode: '3d' })}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                atlasState.mode === '3d'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tNav('mode3d')}
            </button>
            <button
              type="button"
              onClick={() => updateAtlasState({ mode: '2d' })}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                atlasState.mode === '2d'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tNav('mode2d')}
            </button>
          </div>

          <button
            type="button"
            onClick={cycleUnits}
            className="rounded-xl border border-sky-400/25 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-400/60"
          >
            {unitLabel}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-sky-400/25 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-400/60"
          >
            {theme === 'dark' ? tNav('themeDark') : tNav('themeLight')}
          </button>

          <LanguageSwitcher currentLocale={locale} />
        </div>
      </header>

      {/* Main Spatial Canvas & Telemetry HUD Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Column: Pinned Expedition Corridor, Bedmap3 Peel/Layer Controls & Drake Sea-State */}
        <section className="lg:col-span-4 flex flex-col gap-4">
          {/* Bedmap3 Ice-Peel Slider & Subglacial Layer Switcher */}
          <div className="cryo-card rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-sky-300">
                {tGeo('icePeelTitle')}
              </h2>
              <span className="font-mono text-xs text-amber-300">
                {atlasState.peel}% Peel
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={100}
              value={atlasState.peel}
              onChange={(e) => updateAtlasState({ peel: Number(e.target.value) })}
              className="w-full accent-sky-400"
            />

            <div className="grid grid-cols-3 gap-1 rounded-xl border border-sky-400/20 bg-slate-950/50 p-1">
              {(
                [
                  ['bedrock', tGeo('layerModeBedrock')],
                  ['thickness', tGeo('layerModeThickness')],
                  ['surface', tGeo('layerModeSurface')]
                ] as const
              ).map(([modeId, modeLabel]) => (
                <button
                  key={modeId}
                  type="button"
                  onClick={() => {
                    setSubglacialLayerMode(modeId);
                    if (atlasState.peel < 20) updateAtlasState({ peel: 55 });
                  }}
                  className={`min-w-0 rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                    subglacialLayerMode === modeId
                      ? 'bg-sky-400 text-slate-950'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {modeLabel}
                </button>
              ))}
            </div>

            <p className="text-xs text-slate-300">{tGeo('icePeelHint')}</p>
          </div>

          {/* Default Pinned Expedition Corridor */}
          <div className="cryo-card rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
                {tCor('pinnedLabel')}
              </span>
              <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-xs text-sky-300">
                {tCor('waypointsCount', { count: activeCorridor.waypoints.length })} ·{' '}
                {activeCorridor.durationDays}d
              </span>
            </div>

            <label className="block text-xs text-slate-400">
              {tCor('selectRoute')}
              <select
                value={activeCorridor.id}
                onChange={(e) => {
                  const nextCorridor = corridors.find((c) => c.id === e.target.value);
                  const midWp =
                    nextCorridor?.waypoints[
                      Math.floor((nextCorridor.waypoints.length || 1) / 2)
                    ];
                  updateAtlasState({
                    corridor: e.target.value,
                    centerLat: midWp?.lat ?? atlasState.centerLat,
                    centerLon: midWp?.lon ?? atlasState.centerLon
                  });
                }}
                className="mt-1.5 w-full rounded-xl border border-sky-400/30 bg-slate-900/90 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
              >
                {corridors.map((corridor) => (
                  <option key={corridor.id} value={corridor.id}>
                    {corridor.name[locale]}
                  </option>
                ))}
              </select>
            </label>

            <p className="text-xs leading-relaxed text-slate-300">
              {activeCorridor.summary[locale]}
            </p>

            <ol className="space-y-2 border-t border-slate-700/60 pt-3">
              {activeCorridor.waypoints.map((wp, idx) => (
                <li key={wp.id}>
                  <button
                    type="button"
                    onClick={() =>
                      updateAtlasState({ centerLat: wp.lat, centerLon: wp.lon, zoom: 4 })
                    }
                    className="w-full text-left rounded-xl border border-slate-700/50 bg-slate-900/45 hover:border-sky-400/50 p-2.5 text-xs transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1 font-semibold text-sky-200">
                      <span>
                        {idx + 1}. {wp.name[locale]}
                      </span>
                      <span className="font-mono text-[11px] text-slate-400">
                        {wp.lat.toFixed(2)}°, {wp.lon.toFixed(2)}°
                      </span>
                    </div>
                    <p className="mt-1 text-slate-300">{wp.highlight[locale]}</p>
                  </button>
                </li>
              ))}
            </ol>

            <p className="text-[11px] text-slate-400">{tCor('safetyNotice')}</p>
          </div>

          {/* 5-Tier Drake Passage & Southern Ocean Sea-State Gauge */}
          <DrakeSeaStateCard
            locale={locale}
            units={atlasState.units}
            marineList={marineList}
            onFocusBuoy={(lat, lon) =>
              updateAtlasState({ centerLat: lat, centerLon: lon, zoom: 3 })
            }
          />

          {/* Featured Protected Historic Sites & Monuments (HSM) */}
          <div className="cryo-card rounded-2xl p-4 space-y-2.5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              {tNav('heritage')} · ATCM HSM
            </h3>
            <div className="space-y-2">
              {monuments.map((hsm) => (
                <div
                  key={hsm.id}
                  onClick={() =>
                    updateAtlasState({
                      centerLat: hsm.lat,
                      centerLon: hsm.lon,
                      zoom: 4
                    })
                  }
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      updateAtlasState({
                        centerLat: hsm.lat,
                        centerLon: hsm.lon,
                        zoom: 4
                      });
                    }
                  }}
                  className="cursor-pointer rounded-xl border border-slate-700/60 bg-slate-900/55 hover:border-amber-400/50 p-2.5 text-xs transition"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1 font-semibold text-amber-200">
                    <span>{hsm.title[locale]}</span>
                    <a
                      href={hsm.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[11px] text-amber-300 underline"
                    >
                      {hsm.hsmCode} ({hsm.year})
                    </a>
                  </div>
                  <p className="mt-1 text-slate-300">{hsm.summary[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Right/Center Column: Dual-Mode Spatial Canvas + Cross-Section Lab + Weather + Geology + Gazetteer */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <DualModeAtlasCanvas
            locale={locale}
            atlasState={atlasState}
            subglacialLayerMode={subglacialLayerMode}
            outlinePack={outlinePack}
            bedmapGrid={bedmapGrid}
            stations={stations}
            weatherList={weatherList}
            monuments={monuments}
            geologicalSites={geologicalSites}
            activeCorridor={activeCorridor}
            transectEndpoints={effectiveTransectEndpoints}
            isPickingTransect={drawStep !== 'idle'}
            onMapClickCoordinate={handleMapClickForTransect}
            onUpdateState={updateAtlasState}
          />

          {/* Phase 2 Interactive Bedmap3 Two-Point Subglacial Cross-Section Profiler */}
          <SubglacialCrossSectionLab
            locale={locale}
            units={atlasState.units}
            bedmapGrid={bedmapGrid}
            presets={transectPresets}
            selectedPresetId={activePreset.id}
            transectEndpoints={effectiveTransectEndpoints}
            isCustomTransect={customEndpoints !== null}
            drawStep={drawStep}
            onSelectPreset={(preset) => {
              setCustomEndpoints(null);
              setDraftPointA(null);
              setDrawStep('idle');
              updateAtlasState({
                transect: preset.id,
                centerLat: (preset.pointA.lat + preset.pointB.lat) / 2,
                centerLon: preset.pointA.lon
              });
            }}
            onToggleDrawMode={() => {
              if (drawStep === 'idle') {
                setDrawStep('pick-a');
              } else {
                setDrawStep('idle');
                setDraftPointA(null);
              }
            }}
          />

          {/* 18-Station Forecast + NSIDC Sea-Ice Seasonal Extent */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
            <div className="xl:col-span-7">
              <StationWeatherPanel
                locale={locale}
                units={atlasState.units}
                stations={stations}
                selectedStationId={atlasState.station}
                weatherList={weatherList}
                onSelectStation={(st) =>
                  updateAtlasState({
                    station: st.id,
                    centerLat: st.lat,
                    centerLon: st.lon
                  })
                }
              />
            </div>
            <div className="xl:col-span-5">
              <SeaIceAnomalyCard locale={locale} seaIce={seaIce} />
            </div>
          </div>

          {/* Phase 2 Macro-Regions, SCAR GeoMAP Outcrops/Volcanoes/Fossils & SCAR CGA Gazetteer */}
          <GeologySitesAndRegionsPanel
            locale={locale}
            units={atlasState.units}
            sites={geologicalSites}
            macroRegions={macroRegions}
            onFocusCoordinates={(lat, lon, zoom = 4) =>
              updateAtlasState({ centerLat: lat, centerLon: lon, zoom })
            }
          />

          <PolarGazetteerSearch
            locale={locale}
            entries={gazetteerEntries}
            onFocusCoordinates={(lat, lon, zoom = 4) =>
              updateAtlasState({ centerLat: lat, centerLon: lon, zoom })
            }
          />

          <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-200">
            {tFoot('scaffoldReady')}
          </div>
        </section>
      </main>

      {/* Authoritative Scientific Source Attribution Footer */}
      <footer className="cryo-card rounded-2xl p-4 space-y-2">
        <div className="text-xs font-semibold text-slate-300">
          {tFoot('sourcesTitle')}
        </div>
        <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs">
          {scientificSources.map((src) => (
            <a
              key={src.id}
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 hover:text-sky-200 underline underline-offset-2"
            >
              {src.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}

function AtlasShellFallback() {
  const tStatus = useTranslations('status');
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="cryo-card rounded-2xl px-6 py-4 text-sm text-sky-300 font-medium">
        {tStatus('loading')} ({DEFAULT_ATLAS_URL_STATE.mode.toUpperCase()})
      </div>
    </div>
  );
}

export function AtlasShell({ locale }: { locale: SupportedLocale }) {
  return (
    <Suspense fallback={<AtlasShellFallback />}>
      <AtlasShellContent locale={locale} />
    </Suspense>
  );
}
