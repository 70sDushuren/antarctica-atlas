'use client';

import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { DualModeAtlasCanvas } from '@/components/atlas-canvas';
import { ExpeditionCorridorBriefing } from '@/components/expedition-briefing';
import {
  GeologySitesAndRegionsPanel,
  PolarGazetteerSearch,
  SubglacialCrossSectionLab,
  type TransectDrawStep
} from '@/components/geology-lab';
import { HeritageChronicleSection } from '@/components/heritage-chronicle';
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
  HistoricTrackRenderLayer,
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
  const [historicTrackLayers, setHistoricTrackLayers] = useState<
    HistoricTrackRenderLayer[]
  >([]);

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
  const chronicleActs = polarRepository.getChronicleActs();
  const historicTracks = polarRepository.getHistoricTracks();
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

  const handleFocusCoordinates = useCallback(
    (lat: number, lon: number, zoom = 4) => {
      updateAtlasState({ centerLat: lat, centerLon: lon, zoom });
    },
    [updateAtlasState]
  );

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
      {/* Top Cryo-Glass Navigation, Module Jump Bar & 6-Locale Switcher */}
      <header className="cryo-card rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1 className="text-xl md:text-2xl font-bold tracking-tight text-sky-400">
                {tBrand('title')}
              </h1>
              <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300">
                {tBrand('treatyBadge')}
              </span>
            </div>
            <p className="mt-1 text-xs md:text-sm text-slate-300">
              {tBrand('subtitle')}
            </p>
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
        </div>

        {/* 5 Core Functional Modules Anchor Navigation */}
        <nav
          aria-label="Atlas Modules"
          className="flex flex-wrap items-center gap-2 border-t border-sky-400/15 pt-2.5 text-xs"
        >
          {(
            [
              ['#module-corridors', tNav('corridors')],
              ['#module-weather', tNav('weather')],
              ['#module-geology', tNav('geology')],
              ['#module-stations', tNav('stations')],
              ['#module-heritage', tNav('heritage')]
            ] as const
          ).map(([href, label]) => (
            <a
              key={href}
              href={href}
              className="min-w-0 rounded-lg border border-sky-400/20 bg-slate-950/45 px-2.5 py-1 text-slate-200 hover:border-sky-400/60 hover:text-sky-300 transition"
            >
              {label}
            </a>
          ))}
        </nav>
      </header>

      {/* Main Spatial Canvas & 5-Module Holistic Workspace */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Column: Bedmap3 Peel Control, Module 5 Corridor Briefing & Drake Sea-State */}
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

          {/* Module 5: Default Pinned Expedition Corridor Multi-Dimensional Briefing */}
          <div id="module-corridors" className="scroll-mt-4">
            <ExpeditionCorridorBriefing
              locale={locale}
              units={atlasState.units}
              corridors={corridors}
              activeCorridor={activeCorridor}
              stations={stations}
              weatherList={weatherList}
              marineList={marineList}
              geologicalSites={geologicalSites}
              monuments={monuments}
              onSelectCorridor={(corridorId) => {
                const nextCorridor = corridors.find((c) => c.id === corridorId);
                const midWp =
                  nextCorridor?.waypoints[
                    Math.floor((nextCorridor.waypoints.length || 1) / 2)
                  ];
                updateAtlasState({
                  corridor: corridorId,
                  centerLat: midWp?.lat ?? atlasState.centerLat,
                  centerLon: midWp?.lon ?? atlasState.centerLon
                });
              }}
              onFocusCoordinates={handleFocusCoordinates}
            />
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
        </section>

        {/* Right/Center Column: Dual-Mode Spatial Canvas + Cross-Section + Weather + Regions/Gazetteer + Heritage */}
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
            historicTrackLayers={historicTrackLayers}
            isPickingTransect={drawStep !== 'idle'}
            onMapClickCoordinate={handleMapClickForTransect}
            onUpdateState={updateAtlasState}
          />

          {/* Module 1 & 3: 18-Station Forecast + NSIDC Sea-Ice Seasonal Extent */}
          <div id="module-weather" className="grid grid-cols-1 xl:grid-cols-12 gap-4 scroll-mt-4">
            <div id="module-stations" className="xl:col-span-7 scroll-mt-4">
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

          {/* Module 2: Interactive Bedmap3 Cross-Section Lab, Macro-Regions, SCAR GeoMAP & Gazetteer */}
          <div id="module-geology" className="space-y-4 scroll-mt-4">
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

            <GeologySitesAndRegionsPanel
              locale={locale}
              units={atlasState.units}
              sites={geologicalSites}
              macroRegions={macroRegions}
              onFocusCoordinates={handleFocusCoordinates}
            />

            <PolarGazetteerSearch
              locale={locale}
              entries={gazetteerEntries}
              onFocusCoordinates={handleFocusCoordinates}
            />
          </div>

          {/* Module 4: 4-Act Exploration Heritage Scrollytelling, Heroic Track Playback & ATCM HSMs */}
          <div id="module-heritage" className="scroll-mt-4">
            <HeritageChronicleSection
              locale={locale}
              acts={chronicleActs}
              tracks={historicTracks}
              monuments={monuments}
              onFocusCoordinates={handleFocusCoordinates}
              onTrackLayersChange={setHistoricTrackLayers}
            />
          </div>

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
