'use client';

import Link from 'next/link';
import { Suspense, useCallback, useEffect, useMemo, useState } from 'react';
import {
  CloudSnow,
  Compass,
  Layers,
  Map as MapIcon,
  RefreshCw,
  ShieldCheck,
  User
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { DualModeAtlasCanvas } from '@/components/atlas-canvas';
import { AccountAndPlansSheet } from '@/components/auth/AccountAndPlansSheet';
import { EntityInspectorSheet } from '@/components/drilldown/EntityInspectorSheet';
import { OverviewTabPanel } from '@/components/drilldown/OverviewTabPanel';
import {
  GeologySitesAndRegionsPanel,
  type TransectDrawStep
} from '@/components/geology-lab';
import { PlannerTabPanel } from '@/components/itinerary-planner/PlannerTabPanel';
import { CollapsibleBottomChartDock } from '@/components/layout-hud/CollapsibleBottomChartDock';
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
import { densifyGreatCircle } from '@/lib/polar-math';
import { polarRepository } from '@/lib/polar-repository';
import { useAtlasTelemetry } from '@/lib/telemetry/client';
import type {
  AntarcticRegionId,
  AtlasTabId,
  AuthenticatedUser,
  BottomDockMode,
  HistoricTrackRenderLayer,
  ItineraryEvaluationResult,
  ItineraryImportSourceType,
  MarineCorridorTelemetry,
  PolarHikingDifficultyTier,
  PolarOutlineDataPack,
  SavedUserItinerary,
  SeaIceSummaryPayload,
  StationWeatherTelemetry,
  SubglacialBedmapGrid,
  SubglacialLayerMode,
  ThemeMode,
  UnitSystem,
  UserItineraryWaypoint
} from '@/lib/types';
import { LanguageSwitcher } from './LanguageSwitcher';

const UNIT_CYCLE: UnitSystem[] = ['nautical', 'metric', 'imperial'];
const GUEST_DRAFT_STORAGE_KEY = 'antarctica_atlas_guest_draft_v2';

const TIER_TRACK_HEX: Record<PolarHikingDifficultyTier, string> = {
  1: '#10b981',
  2: '#38bdf8',
  3: '#f59e0b',
  4: '#f97316',
  5: '#f43f5e'
};

function AtlasShellContent({ locale }: { locale: SupportedLocale }) {
  const tBrand = useTranslations('brand');
  const tNav = useTranslations('nav');
  const tTabs = useTranslations('tabs');
  const tGeo = useTranslations('geology');
  const tLegal = useTranslations('legal');
  const tFoot = useTranslations('footer');

  const { atlasState, updateAtlasState } = useAtlasUrlState();
  const { trackEvent } = useAtlasTelemetry(locale, atlasState.tab);

  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [subglacialLayerMode, setSubglacialLayerMode] =
    useState<SubglacialLayerMode>('bedrock');
  const [outlinePack, setOutlinePack] = useState<PolarOutlineDataPack | null>(null);
  const [bedmapGrid, setBedmapGrid] = useState<SubglacialBedmapGrid | null>(null);

  // Frame-0 instant baseline/cached snapshot initialization (zero network wait)
  const initialTelemetry = useMemo(
    () => polarRepository.getInitialTelemetrySnapshot(),
    []
  );
  const [weatherList, setWeatherList] = useState<StationWeatherTelemetry[]>(
    () => initialTelemetry.snapshot.weatherList
  );
  const [marineList, setMarineList] = useState<MarineCorridorTelemetry[]>(
    () => initialTelemetry.snapshot.marineList
  );
  const [seaIce, setSeaIce] = useState<SeaIceSummaryPayload | null>(
    () => initialTelemetry.snapshot.seaIce
  );
  const [isAsyncSyncing, setIsAsyncSyncing] = useState(false);

  const [historicTrackLayers, setHistoricTrackLayers] = useState<
    HistoricTrackRenderLayer[]
  >([]);

  // Auth & Saved Cloud Itineraries state
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AuthenticatedUser | null>(null);
  const [oauthProviders, setOauthProviders] = useState<{
    github: boolean;
    google: boolean;
  }>({ github: false, google: false });
  const [savedPlans, setSavedPlans] = useState<SavedUserItinerary[]>([]);

  // Custom Route & Hiking Advisor state
  const [planTitle, setPlanTitle] = useState('');
  const [startDate, setStartDate] = useState(() =>
    new Date(Date.now() + 7 * 86_400_000).toISOString().slice(0, 10)
  );
  const [simulateLiveNow, setSimulateLiveNow] = useState(true);
  const [sourceType, setSourceType] =
    useState<ItineraryImportSourceType>('manual');
  const [customWaypoints, setCustomWaypoints] = useState<UserItineraryWaypoint[]>(
    []
  );
  const [evaluation, setEvaluation] = useState<ItineraryEvaluationResult | null>(
    null
  );
  const [isPickingWaypoints, setIsPickingWaypoints] = useState(false);

  // Subglacial 2-point transect drawing state
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

  // Initial data & auth session bootstrap
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

    // Non-blocking background SWR revalidation (respects 15-minute client quota window)
    if (initialTelemetry.needsBackgroundSync) {
      setIsAsyncSyncing(true);
      polarRepository
        .syncTelemetryInBackground({
          signal: controller.signal,
          currentSnapshot: initialTelemetry.snapshot
        })
        .then((fresh) => {
          if (!controller.signal.aborted) {
            setWeatherList(fresh.weatherList);
            setMarineList(fresh.marineList);
            setSeaIce(fresh.seaIce);
          }
        })
        .catch(() => {})
        .finally(() => {
          if (!controller.signal.aborted) setIsAsyncSyncing(false);
        });
    }

    fetch('/api/auth/session', { signal: controller.signal })
      .then((r) => (r.ok ? r.json() : null))
      .then(
        (
          data: {
            user: AuthenticatedUser | null;
            oauthProviders?: { github: boolean; google: boolean };
          } | null
        ) => {
          if (data) {
            setCurrentUser(data.user ?? null);
            if (data.oauthProviders) setOauthProviders(data.oauthProviders);
          }
        }
      )
      .catch(() => {});

    // Restore guest draft from localStorage if present
    try {
      const rawDraft = window.localStorage.getItem(GUEST_DRAFT_STORAGE_KEY);
      if (rawDraft) {
        const parsed = JSON.parse(rawDraft) as {
          title?: string;
          waypoints?: UserItineraryWaypoint[];
          evaluation?: ItineraryEvaluationResult | null;
        };
        if (Array.isArray(parsed.waypoints) && parsed.waypoints.length > 0) {
          setPlanTitle(parsed.title || '');
          setCustomWaypoints(parsed.waypoints);
          setEvaluation(parsed.evaluation ?? null);
        }
      }
    } catch {
      // Ignore storage read error
    }

    return () => controller.abort();
  }, [initialTelemetry]);

  // Load saved cloud itineraries whenever user logs in
  useEffect(() => {
    if (!currentUser) {
      setSavedPlans([]);
      return;
    }
    fetch('/api/itineraries')
      .then((r) => (r.ok ? r.json() : null))
      .then((d: { itineraries?: SavedUserItinerary[] } | null) => {
        if (d?.itineraries) setSavedPlans(d.itineraries);
      })
      .catch(() => {});
  }, [currentUser]);

  // Persist custom itinerary draft locally so guest work survives auth/locale switches
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      window.localStorage.setItem(
        GUEST_DRAFT_STORAGE_KEY,
        JSON.stringify({
          title: planTitle,
          waypoints: customWaypoints,
          evaluation
        })
      );
    } catch {
      // Ignore quota errors
    }
  }, [planTitle, customWaypoints, evaluation]);

  const corridors = polarRepository.getExpeditionCorridors();
  const stations = polarRepository.getStations();
  const landingHotspots = polarRepository.getLandingHotspots();
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

  // Combine Heroic Age historic tracks with difficulty-colored custom user route layers
  const combinedCanvasTrackLayers = useMemo(() => {
    const layers: HistoricTrackRenderLayer[] = [...historicTrackLayers];
    if (customWaypoints.length >= 2) {
      for (let i = 0; i < customWaypoints.length - 1; i++) {
        const a = customWaypoints[i];
        const b = customWaypoints[i + 1];
        const segTier =
          evaluation?.segments[i + 1]?.hikingDifficultyTier ??
          evaluation?.overallDifficultyTier ??
          2;
        const pts = densifyGreatCircle(
          { lat: a.lat, lon: a.lon },
          { lat: b.lat, lon: b.lon },
          1.0
        );
        layers.push({
          id: `custom-leg-${i}`,
          colorHex: TIER_TRACK_HEX[segTier],
          points: pts,
          activeHead:
            i === customWaypoints.length - 2
              ? { lat: b.lat, lon: b.lon, label: b.name }
              : undefined
        });
      }
    } else if (customWaypoints.length === 1) {
      const only = customWaypoints[0];
      layers.push({
        id: 'custom-single-pt',
        colorHex: '#10b981',
        points: [{ lat: only.lat, lon: only.lon }],
        activeHead: { lat: only.lat, lon: only.lon, label: only.name }
      });
    }
    return layers;
  }, [historicTrackLayers, customWaypoints, evaluation]);

  const handleFocusCoordinates = useCallback(
    (lat: number, lon: number, zoom = 4) => {
      updateAtlasState({ centerLat: lat, centerLon: lon, zoom });
    },
    [updateAtlasState]
  );

  const handleInspectEntity = useCallback(
    (inspectKey: string, lat: number, lon: number) => {
      const [targetType, targetId] = inspectKey.split(':');
      updateAtlasState({
        inspect: inspectKey,
        centerLat: lat,
        centerLon: lon
      });
      trackEvent({
        eventCategory: 'drilldown',
        eventName: 'drilldown_open',
        drilldownLevel: 3,
        targetType,
        targetId,
        lat,
        lon
      });
    },
    [updateAtlasState, trackEvent]
  );

  function handleSelectTab(nextTab: AtlasTabId) {
    const patch: Partial<typeof atlasState> = { tab: nextTab };
    if (nextTab === 'geology' && atlasState.peel < 35) {
      patch.peel = 55;
    }
    if (nextTab !== 'planner') {
      setIsPickingWaypoints(false);
    }
    updateAtlasState(patch);
  }

  function handleSelectSector(
    sector: AntarcticRegionId | 'all',
    camera?: { lat: number; lon: number; zoom: number }
  ) {
    updateAtlasState({
      region: sector,
      ...(camera
        ? { centerLat: camera.lat, centerLon: camera.lon, zoom: camera.zoom }
        : {})
    });
    trackEvent({
      eventCategory: 'drilldown',
      eventName: 'drilldown_step',
      drilldownLevel: sector === 'all' ? 1 : 2,
      targetType: 'sector',
      targetId: sector,
      lat: camera?.lat,
      lon: camera?.lon
    });
  }

  function handleMapClickCoordinate(lat: number, lon: number) {
    const rounded = {
      lat: Math.round(lat * 1000) / 1000,
      lon: Math.round(lon * 1000) / 1000
    };

    if (isPickingWaypoints) {
      const next: UserItineraryWaypoint[] = [
        ...customWaypoints,
        {
          id: `map-${Date.now()}`,
          dayNumber: customWaypoints.length + 1,
          plannedDate: startDate || undefined,
          name: `Polar Point (${rounded.lat.toFixed(2)}°, ${rounded.lon.toFixed(2)}°)`,
          lat: rounded.lat,
          lon: rounded.lon,
          activityType: rounded.lat <= -61 ? 'hiking' : 'cruise'
        }
      ];
      setSourceType('manual');
      setCustomWaypoints(next);
      trackEvent({
        eventCategory: 'planner',
        eventName: 'map_waypoint_pick',
        lat: rounded.lat,
        lon: rounded.lon
      });
      return;
    }

    if (drawStep === 'pick-a') {
      setDraftPointA(rounded);
      setDrawStep('pick-b');
    } else if (drawStep === 'pick-b') {
      const start = draftPointA ?? effectiveTransectEndpoints.pointA;
      setCustomEndpoints({ pointA: start, pointB: rounded });
      setDraftPointA(null);
      setDrawStep('idle');
      updateAtlasState({ dock: 'subglacial-transect' });
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
    <div className="min-h-screen flex flex-col justify-between p-3.5 md:p-5 gap-4">
      {/* Top Cryo-Glass Navigation, Dual-Mode Toggle, Account Drawer Trigger & 6-Locale Switcher */}
      <header className="cryo-card rounded-2xl px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg md:text-xl font-bold tracking-tight text-sky-400">
              {tBrand('title')}
            </h1>
            <span className="rounded-full border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-300">
              {tBrand('treatyBadge')}
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-300">{tBrand('subtitle')}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 3D Globe <-> 2D EPSG:3031 Switch */}
          <div className="inline-flex rounded-xl border border-sky-400/25 bg-slate-950/55 p-1">
            <button
              type="button"
              onClick={() => {
                updateAtlasState({ mode: '3d' });
                trackEvent({
                  eventCategory: 'canvas',
                  eventName: 'canvas_mode_toggle',
                  properties: { mode: '3d' }
                });
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
                atlasState.mode === '3d'
                  ? 'bg-sky-400 text-slate-950'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {tNav('mode3d')}
            </button>
            <button
              type="button"
              onClick={() => {
                updateAtlasState({ mode: '2d' });
                trackEvent({
                  eventCategory: 'canvas',
                  eventName: 'canvas_mode_toggle',
                  properties: { mode: '2d' }
                });
              }}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${
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
            className="rounded-xl border border-sky-400/25 bg-slate-950/45 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-400/60"
          >
            {unitLabel}
          </button>

          <button
            type="button"
            onClick={toggleTheme}
            className="rounded-xl border border-sky-400/25 bg-slate-950/45 px-2.5 py-1.5 text-xs font-medium text-slate-200 hover:border-sky-400/60"
          >
            {theme === 'dark' ? tNav('themeDark') : tNav('themeLight')}
          </button>

          <button
            type="button"
            disabled={isAsyncSyncing}
            onClick={() => {
              setIsAsyncSyncing(true);
              polarRepository
                .syncTelemetryInBackground({
                  force: true,
                  currentSnapshot: {
                    weatherList,
                    marineList,
                    seaIce: seaIce ?? initialTelemetry.snapshot.seaIce,
                    syncedAtMs: Date.now(),
                    source: 'cached-valid-window'
                  }
                })
                .then((fresh) => {
                  setWeatherList(fresh.weatherList);
                  setMarineList(fresh.marineList);
                  setSeaIce(fresh.seaIce);
                })
                .catch(() => {})
                .finally(() => setIsAsyncSyncing(false));
            }}
            title="Async Telemetry Sync"
            className="inline-flex items-center justify-center rounded-xl border border-sky-400/25 bg-slate-950/45 p-1.5 text-slate-200 hover:border-sky-400/60 disabled:opacity-60"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 text-sky-300 ${isAsyncSyncing ? 'animate-spin' : ''}`}
            />
          </button>

          {/* Account & Cloud Plans Drawer Trigger */}
          <button
            type="button"
            onClick={() => setIsAccountSheetOpen(true)}
            className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
              currentUser
                ? 'border-emerald-400/45 bg-emerald-500/15 text-emerald-200 hover:border-emerald-400'
                : 'border-sky-400/35 bg-sky-500/15 text-sky-200 hover:border-sky-400'
            }`}
          >
            <User className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate max-w-[130px]">
              {currentUser ? currentUser.displayName : tTabs('accountBtn')}
            </span>
            {savedPlans.length > 0 && (
              <span className="rounded-full bg-emerald-400/25 px-1.5 py-0.2 text-[10px]">
                {tTabs('myPlansBadge', { count: savedPlans.length })}
              </span>
            )}
          </button>

          <LanguageSwitcher currentLocale={locale} />
        </div>
      </header>

      {/* Main Split Viewport: Left 65% Sticky Spatial Stage + Right 35% 4-Tab Progressive Workbench */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1 items-start">
        {/* Left 65% Spatial Stage: DualModeAtlasCanvas + Collapsible Bottom Chart Dock */}
        <section className="lg:col-span-8 lg:sticky lg:top-4 flex flex-col gap-3">
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
            historicTrackLayers={combinedCanvasTrackLayers}
            isPickingTransect={drawStep !== 'idle' || isPickingWaypoints}
            onMapClickCoordinate={handleMapClickCoordinate}
            onInspectEntity={handleInspectEntity}
            onUpdateState={updateAtlasState}
          />

          <CollapsibleBottomChartDock
            locale={locale}
            units={atlasState.units}
            dockMode={atlasState.dock}
            onChangeDockMode={(mode: BottomDockMode) => updateAtlasState({ dock: mode })}
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
              setIsPickingWaypoints(false);
              if (drawStep === 'idle') {
                setDrawStep('pick-a');
              } else {
                setDrawStep('idle');
                setDraftPointA(null);
              }
            }}
            hikingSamples={evaluation?.profileSamples ?? []}
            onFocusCoordinates={handleFocusCoordinates}
          />
        </section>

        {/* Right 35% Thematic Workbench: 4 Exploration Tabs + L3 Holistic Entity Sheet */}
        <section className="lg:col-span-4 flex flex-col gap-3">
          {/* 4-Tab Bar (Resilient to long ES/PT labels via 2x2 / 4-grid wrap) */}
          <div
            role="tablist"
            aria-label="Antarctica Workspace Tabs"
            className="cryo-card rounded-2xl p-1.5 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-2 gap-1.5"
          >
            {(
              [
                ['overview', tTabs('overview'), Compass],
                ['weather', tTabs('weather'), CloudSnow],
                ['geology', tTabs('geology'), Layers],
                ['planner', tTabs('planner'), MapIcon]
              ] as const
            ).map(([tabId, label, IconComp]) => {
              const active = atlasState.tab === tabId;
              return (
                <button
                  key={tabId}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => handleSelectTab(tabId)}
                  className={`flex items-center justify-center gap-1.5 min-w-0 rounded-xl px-2.5 py-2 text-xs font-semibold transition ${
                    active
                      ? 'bg-sky-400 text-slate-950 shadow-sm'
                      : 'bg-slate-950/50 text-slate-300 hover:text-white hover:bg-slate-900/80'
                  }`}
                >
                  <IconComp className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{label}</span>
                </button>
              );
            })}
          </div>

          {/* Slide-In L3 Holistic Point Inspector Sheet (when any map marker or L2 item is inspected) */}
          {atlasState.inspect && (
            <EntityInspectorSheet
              locale={locale}
              units={atlasState.units}
              inspectKey={atlasState.inspect}
              bedmapGrid={bedmapGrid}
              stations={stations}
              weatherList={weatherList}
              geologicalSites={geologicalSites}
              monuments={monuments}
              landingHotspots={landingHotspots}
              gazetteerEntries={gazetteerEntries}
              onClose={() => updateAtlasState({ inspect: null })}
              onAddPointToPlanner={(pt) => {
                setCustomWaypoints((prev) => [
                  ...prev,
                  {
                    id: `inspected-${Date.now()}`,
                    dayNumber: prev.length + 1,
                    plannedDate: startDate || undefined,
                    name: pt.name,
                    lat: pt.lat,
                    lon: pt.lon,
                    elevationM: pt.elevationM,
                    activityType: pt.lat <= -61 ? 'hiking' : 'zodiac-landing'
                  }
                ]);
                updateAtlasState({ tab: 'planner' });
              }}
            />
          )}

          {/* Active Thematic Tab Body */}
          <div className="cryo-card rounded-2xl p-4 lg:max-h-[calc(100vh-11rem)] lg:overflow-y-auto space-y-4">
            {atlasState.tab === 'overview' && (
              <OverviewTabPanel
                locale={locale}
                units={atlasState.units}
                activeRegion={atlasState.region}
                stations={stations}
                weatherList={weatherList}
                landingHotspots={landingHotspots}
                monuments={monuments}
                chronicleActs={chronicleActs}
                historicTracks={historicTracks}
                gazetteerEntries={gazetteerEntries}
                onSelectSector={handleSelectSector}
                onInspectEntity={handleInspectEntity}
                onFocusCoordinates={handleFocusCoordinates}
                onTrackLayersChange={setHistoricTrackLayers}
              />
            )}

            {atlasState.tab === 'weather' && (
              <div className="space-y-4">
                <DrakeSeaStateCard
                  locale={locale}
                  units={atlasState.units}
                  marineList={marineList}
                  onFocusBuoy={(lat, lon) =>
                    updateAtlasState({ centerLat: lat, centerLon: lon, zoom: 3 })
                  }
                />
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
                <SeaIceAnomalyCard locale={locale} seaIce={seaIce} />
              </div>
            )}

            {atlasState.tab === 'geology' && (
              <div className="space-y-4">
                {/* Bedmap3 Ice-Peel Slider & Layer Mode */}
                <div className="rounded-xl border border-sky-400/25 bg-slate-950/55 p-3.5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h2 className="text-xs font-semibold text-sky-300">
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
                    onChange={(e) => {
                      updateAtlasState({ peel: Number(e.target.value) });
                    }}
                    onPointerUp={() => {
                      trackEvent({
                        eventCategory: 'canvas',
                        eventName: 'ice_peel_drag',
                        properties: { peel: atlasState.peel }
                      });
                    }}
                    className="w-full accent-sky-400"
                  />

                  <div className="grid grid-cols-3 gap-1 rounded-xl border border-sky-400/20 bg-slate-950/60 p-1">
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
                        className={`min-w-0 truncate rounded-lg px-2 py-1 text-[11px] font-medium transition ${
                          subglacialLayerMode === modeId
                            ? 'bg-sky-400 text-slate-950'
                            : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {modeLabel}
                      </button>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-300">{tGeo('icePeelHint')}</p>

                  <button
                    type="button"
                    onClick={() => updateAtlasState({ dock: 'subglacial-transect' })}
                    className="w-full rounded-xl border border-fuchsia-400/45 bg-fuchsia-500/15 py-2 text-xs font-semibold text-fuchsia-200 hover:bg-fuchsia-500/25 transition"
                  >
                    {tTabs('dockSubglacial')}
                  </button>
                </div>

                <GeologySitesAndRegionsPanel
                  locale={locale}
                  units={atlasState.units}
                  sites={geologicalSites}
                  macroRegions={macroRegions}
                  onFocusCoordinates={handleFocusCoordinates}
                />
              </div>
            )}

            {atlasState.tab === 'planner' && (
              <PlannerTabPanel
                locale={locale}
                units={atlasState.units}
                user={currentUser}
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
                planTitle={planTitle}
                onChangePlanTitle={setPlanTitle}
                startDate={startDate}
                onChangeStartDate={setStartDate}
                simulateLiveNow={simulateLiveNow}
                onChangeSimulateLiveNow={setSimulateLiveNow}
                sourceType={sourceType}
                onChangeSourceType={setSourceType}
                waypoints={customWaypoints}
                onChangeWaypoints={setCustomWaypoints}
                evaluation={evaluation}
                onChangeEvaluation={setEvaluation}
                isPickingWaypoints={isPickingWaypoints}
                onTogglePickWaypoints={() => {
                  setDrawStep('idle');
                  setIsPickingWaypoints((v) => !v);
                }}
                onOpenHikingDock={() => updateAtlasState({ dock: 'hiking-profile' })}
                onOpenAuthSheet={() => setIsAccountSheetOpen(true)}
                onFocusCoordinates={handleFocusCoordinates}
                onInspectEntity={handleInspectEntity}
                onPlanSaved={(saved) => {
                  setSavedPlans((prev) => [
                    saved,
                    ...prev.filter((p) => p.id !== saved.id)
                  ]);
                }}
                onTrackPlannerEvent={(eventName, properties) =>
                  trackEvent({
                    eventCategory: 'planner',
                    eventName,
                    properties
                  })
                }
              />
            )}
          </div>
        </section>
      </main>

      {/* Account Sign-In / Registration & Cloud Itineraries Drawer */}
      <AccountAndPlansSheet
        isOpen={isAccountSheetOpen}
        locale={locale}
        currentUnits={atlasState.units}
        currentMode={atlasState.mode}
        user={currentUser}
        oauthProviders={oauthProviders}
        savedPlans={savedPlans}
        onClose={() => setIsAccountSheetOpen(false)}
        onAuthSuccess={(user) => {
          setCurrentUser(user);
          trackEvent({
            eventCategory: 'auth',
            eventName: 'auth_sign_in_success'
          });
        }}
        onSignOut={async () => {
          await fetch('/api/auth/session', { method: 'DELETE' });
          setCurrentUser(null);
          setSavedPlans([]);
        }}
        onLoadSavedPlan={(plan) => {
          setPlanTitle(plan.title);
          setCustomWaypoints(plan.waypoints);
          setEvaluation(plan.advisory);
          setSourceType(plan.sourceType);
          const first = plan.waypoints[0];
          updateAtlasState({
            tab: 'planner',
            dock: plan.advisory ? 'hiking-profile' : atlasState.dock,
            ...(first ? { centerLat: first.lat, centerLon: first.lon, zoom: 4 } : {})
          });
        }}
        onDeleteSavedPlan={async (planId) => {
          const res = await fetch(`/api/itineraries/${planId}`, {
            method: 'DELETE'
          });
          if (res.ok) {
            setSavedPlans((prev) => prev.filter((p) => p.id !== planId));
          }
        }}
        onAccountDeleted={() => {
          setCurrentUser(null);
          setSavedPlans([]);
        }}
      />

      {/* Authoritative Scientific Source Attribution, Legal Disclaimer Link & License Footer */}
      <footer className="cryo-card rounded-2xl p-4 space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-xs font-semibold text-slate-300">
            {tFoot('sourcesTitle')}
          </div>
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
            <Link
              href={`/${locale}/legal`}
              className="inline-flex items-center gap-1 rounded border border-amber-400/35 bg-amber-500/10 px-2 py-0.5 font-sans text-amber-200 hover:border-amber-400"
            >
              <ShieldCheck className="h-3 w-3" />
              <span>{tLegal('privacyLink')}</span>
            </Link>
            <a
              href="https://github.com/70sDushuren/antarctica-atlas/blob/main/LICENSE"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-300 hover:border-emerald-400/60"
            >
              Code: MIT
            </a>
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-sky-400/30 bg-sky-500/10 px-2 py-0.5 text-sky-300 hover:border-sky-400/60"
            >
              Data: CC BY 4.0
            </a>
            <a
              href="https://github.com/70sDushuren/antarctica-atlas/blob/main/NOTICE.md"
              target="_blank"
              rel="noreferrer"
              className="rounded border border-slate-600 bg-slate-900/70 px-2 py-0.5 text-slate-300 hover:text-white"
            >
              NOTICE.md
            </a>
          </div>
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-800/80 pt-2 text-[11px] leading-relaxed text-slate-400">
          <span>{tFoot('licenseNotice')}</span>
          <span className="text-emerald-300 font-medium">{tFoot('scaffoldReady')}</span>
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
