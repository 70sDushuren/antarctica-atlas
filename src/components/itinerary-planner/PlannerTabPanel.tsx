'use client';

import { useRef, useState } from 'react';
import {
  Activity,
  Backpack,
  Check,
  Copy,
  Crosshair,
  Download,
  FileText,
  Lightbulb,
  MapPin,
  Printer,
  Save,
  Sparkles,
  Trash2,
  Upload
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ExpeditionCorridorBriefing } from '@/components/expedition-briefing';
import { PolarLiabilityBanner } from '@/components/legal/PolarLiabilityBanner';
import type { SupportedLocale } from '@/i18n/routing';
import {
  exportWaypointsToGpx,
  matchPolarPlaceByName,
  parseCsvToWaypoints,
  parseFreeTextItinerary,
  parseGeoJsonToWaypoints,
  parseGpxToWaypoints,
  parseKmlToWaypoints
} from '@/lib/itinerary/importers';
import type {
  AuthenticatedUser,
  ExpeditionCorridor,
  HistoricMonument,
  ItineraryActivityType,
  ItineraryEvaluationResult,
  ItineraryImportSourceType,
  MarineCorridorTelemetry,
  PolarGeologicalSite,
  PolarHikingDifficultyTier,
  PolarStation,
  SavedUserItinerary,
  StationWeatherTelemetry,
  UnitSystem,
  UserItineraryWaypoint
} from '@/lib/types';
import {
  formatPolarLength,
  formatPolarTemperature,
  formatPolarWindSpeed
} from '@/lib/units-and-format';

const TIER_BADGE_CLASSES: Record<PolarHikingDifficultyTier, string> = {
  1: 'border-emerald-400/50 bg-emerald-500/20 text-emerald-200',
  2: 'border-sky-400/50 bg-sky-500/20 text-sky-200',
  3: 'border-amber-400/50 bg-amber-500/20 text-amber-200',
  4: 'border-orange-400/60 bg-orange-500/20 text-orange-200',
  5: 'border-rose-400/70 bg-rose-500/25 text-rose-100'
};

const SAMPLE_FREE_TEXT_BY_LOCALE: Record<SupportedLocale, string> = {
  en: 'Day 1: Embark at Ushuaia\nDay 2: Cross Drake Passage\nDay 4: Continental landing & snow ridge hike at Neko Harbour\nDay 5: Zodiac landing at Port Lockroy and climb Paradise Bay ridge\nDay 6: Hike Whalers Bay & Neptune’s Window on Deception Island',
  'zh-CN':
    '第1天：乌斯怀亚港口登船出发\n第2天：穿越德雷克海峡\n第4天：尼科港冲锋舟登陆与雪坡山脊徒步\n第5天：探访洛克罗伊港企鹅邮局与天堂湾冰川雪脊攀登\n第6天：驶入欺骗岛破火山口，捕鲸湾与海神之窗火山脊徒步',
  'zh-TW':
    '第1天：烏斯懷亞港口登船出發\n第2天：穿越德雷克海峽\n第4天：尼科港衝鋒舟登陸與雪坡山脊徒步\n第5天：探訪洛克羅伊港與天堂灣雪脊攀登\n第6天：欺騙島捕鯨灣與海神之窗火山脊徒步',
  'yue-Hant':
    '第1日：烏斯懷亞碼頭上船出發\n第2日：過德雷克海峽\n第4日：尼科港坐衝鋒舟搶灘同雪坡行山\n第5日：去洛克羅伊港企鵝郵局同天堂灣行上雪脊睇景\n第6日：入欺騙島捕鯨灣行上海神之窗火山脊',
  pt: 'Dia 1: Embarque em Ushuaia\nDia 2: Travessia da Passagem de Drake\nDia 4: Desembarque e trilha na neve em Porto Neko\nDia 5: Visita a Porto Lockroy e subida na Baía Paraíso\nDia 6: Trilha na Ilha Decepção até a Janela de Netuno',
  es: 'Día 1: Embarque en Ushuaia\nDía 2: Cruce del Pasaje de Drake\nDía 4: Desembarco y caminata en nieve en Puerto Neko\nDía 5: Puerto Lockroy y ascenso en Bahía Paraíso\nDía 6: Caminata en Isla Decepción hacia la Ventana de Neptuno'
};

export interface PlannerTabPanelProps {
  locale: SupportedLocale;
  units: UnitSystem;
  user: AuthenticatedUser | null;
  // Official corridors props
  corridors: ExpeditionCorridor[];
  activeCorridor: ExpeditionCorridor;
  stations: PolarStation[];
  weatherList: StationWeatherTelemetry[];
  marineList: MarineCorridorTelemetry[];
  geologicalSites: PolarGeologicalSite[];
  monuments: HistoricMonument[];
  onSelectCorridor: (corridorId: string) => void;
  // Custom route state lifted to AtlasShell for map sync & bottom dock
  planTitle: string;
  onChangePlanTitle: (title: string) => void;
  startDate: string;
  onChangeStartDate: (date: string) => void;
  simulateLiveNow: boolean;
  onChangeSimulateLiveNow: (val: boolean) => void;
  sourceType: ItineraryImportSourceType;
  onChangeSourceType: (src: ItineraryImportSourceType) => void;
  waypoints: UserItineraryWaypoint[];
  onChangeWaypoints: (wps: UserItineraryWaypoint[]) => void;
  evaluation: ItineraryEvaluationResult | null;
  onChangeEvaluation: (ev: ItineraryEvaluationResult | null) => void;
  isPickingWaypoints: boolean;
  onTogglePickWaypoints: () => void;
  onOpenHikingDock: () => void;
  onOpenAuthSheet: () => void;
  onFocusCoordinates: (lat: number, lon: number, zoom?: number) => void;
  onInspectEntity: (inspectKey: string, lat: number, lon: number) => void;
  onPlanSaved: (saved: SavedUserItinerary) => void;
  onTrackPlannerEvent: (
    eventName: string,
    props?: Record<string, string | number | boolean | null>
  ) => void;
}

export function PlannerTabPanel({
  locale,
  units,
  user,
  corridors,
  activeCorridor,
  stations,
  weatherList,
  marineList,
  geologicalSites,
  monuments,
  onSelectCorridor,
  planTitle,
  onChangePlanTitle,
  startDate,
  onChangeStartDate,
  simulateLiveNow,
  onChangeSimulateLiveNow,
  sourceType,
  onChangeSourceType,
  waypoints,
  onChangeWaypoints,
  evaluation,
  onChangeEvaluation,
  isPickingWaypoints,
  onTogglePickWaypoints,
  onOpenHikingDock,
  onOpenAuthSheet,
  onFocusCoordinates,
  onInspectEntity,
  onPlanSaved,
  onTrackPlannerEvent
}: PlannerTabPanelProps) {
  const tPlan = useTranslations('planner');
  const tAdv = useTranslations('advisor');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [subMode, setSubMode] = useState<'custom' | 'corridors'>('custom');
  const [showTextImporter, setShowTextImporter] = useState(false);
  const [freeText, setFreeText] = useState('');
  const [quickPlaceQuery, setQuickPlaceQuery] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isPublicShare, setIsPublicShare] = useState(true);
  const [lastShareUrl, setLastShareUrl] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  async function runEvaluation(targetWaypoints = waypoints, sim = simulateLiveNow) {
    if (targetWaypoints.length === 0) return;
    setEvaluating(true);
    try {
      const res = await fetch('/api/advisor/evaluate', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          waypoints: targetWaypoints,
          simulateLiveNow: sim
        })
      });
      if (!res.ok) return;
      const data = (await res.json()) as { evaluation: ItineraryEvaluationResult };
      onChangeEvaluation(data.evaluation);
      onTrackPlannerEvent('advisor_evaluate', {
        sourceType,
        waypointCount: targetWaypoints.length,
        overallDifficulty: data.evaluation.overallDifficultyTier
      });
    } finally {
      setEvaluating(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const lowerName = file.name.toLowerCase();

    let parsed: UserItineraryWaypoint[] = [];
    let detectedSource: ItineraryImportSourceType = 'gpx';

    try {
      if (lowerName.endsWith('.gpx')) {
        parsed = parseGpxToWaypoints(text);
        detectedSource = 'gpx';
      } else if (lowerName.endsWith('.geojson') || lowerName.endsWith('.json')) {
        parsed = parseGeoJsonToWaypoints(text);
        detectedSource = 'geojson';
      } else if (lowerName.endsWith('.kml')) {
        parsed = parseKmlToWaypoints(text);
        detectedSource = 'kml';
      } else {
        parsed = parseCsvToWaypoints(text);
        detectedSource = 'csv';
      }
    } catch {
      parsed = [];
    }

    if (parsed.length > 0) {
      if (!planTitle.trim()) {
        onChangePlanTitle(file.name.replace(/\.[^.]+$/, ''));
      }
      onChangeSourceType(detectedSource);
      onChangeWaypoints(parsed);
      onFocusCoordinates(parsed[0].lat, parsed[0].lon, 4);
      onTrackPlannerEvent('itinerary_import', {
        sourceType: detectedSource,
        waypointCount: parsed.length
      });
      await runEvaluation(parsed, simulateLiveNow);
    }
    e.target.value = '';
  }

  function handleCloneCorridor() {
    const cloned: UserItineraryWaypoint[] = activeCorridor.waypoints.map((wp, idx) => ({
      id: `preset-${wp.id}-${idx}`,
      dayNumber: idx * 2 + 1,
      plannedDate: startDate || undefined,
      name: wp.name[locale],
      lat: wp.lat,
      lon: wp.lon,
      activityType:
        wp.category === 'landing' || wp.category === 'heritage'
          ? 'zodiac-landing'
          : wp.category === 'station'
            ? 'hiking'
            : 'cruise'
    }));
    onChangePlanTitle(activeCorridor.name[locale]);
    onChangeSourceType('preset');
    onChangeWaypoints(cloned);
    onTrackPlannerEvent('itinerary_import', {
      sourceType: 'preset',
      waypointCount: cloned.length
    });
    void runEvaluation(cloned, simulateLiveNow);
  }

  function handleParseFreeText() {
    const matched = parseFreeTextItinerary(freeText, startDate || undefined);
    if (matched.length > 0) {
      onChangeSourceType('text');
      onChangeWaypoints(matched);
      setShowTextImporter(false);
      onFocusCoordinates(matched[0].lat, matched[0].lon, 3);
      onTrackPlannerEvent('itinerary_import', {
        sourceType: 'text',
        waypointCount: matched.length
      });
      void runEvaluation(matched, simulateLiveNow);
    }
  }

  function handleQuickAddPlace(e: React.FormEvent) {
    e.preventDefault();
    const matched = matchPolarPlaceByName(quickPlaceQuery);
    if (!matched) return;
    const next: UserItineraryWaypoint[] = [
      ...waypoints,
      {
        id: `manual-${Date.now()}`,
        dayNumber: waypoints.length + 1,
        plannedDate: startDate || undefined,
        name: matched.canonicalName,
        lat: matched.lat,
        lon: matched.lon,
        elevationM: matched.elevationM,
        activityType: matched.defaultActivity,
        matchedGazetteerId: matched.id
      }
    ];
    setQuickPlaceQuery('');
    onChangeWaypoints(next);
    onFocusCoordinates(matched.lat, matched.lon, 4);
  }

  function handleExportGpx() {
    if (waypoints.length === 0 || typeof window === 'undefined') return;
    const gpx = exportWaypointsToGpx(planTitle || 'Antarctica Plan', waypoints);
    const blob = new Blob([gpx], { type: 'application/gpx+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(planTitle || 'antarctica-route')
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5_-]+/g, '-')}.gpx`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleSaveToCloud() {
    if (!user) {
      onOpenAuthSheet();
      return;
    }
    if (waypoints.length === 0) return;

    setSaving(true);
    try {
      const res = await fetch('/api/itineraries', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          title: planTitle.trim() || `${activeCorridor.name[locale]} (Custom)`,
          notes: '',
          isPublic: isPublicShare,
          sourceType,
          startDate: startDate || null,
          endDate: null,
          waypoints,
          advisory: evaluation
        })
      });
      if (!res.ok) return;
      const data = (await res.json()) as { itinerary: SavedUserItinerary };
      onPlanSaved(data.itinerary);
      onTrackPlannerEvent('itinerary_save', {
        sourceType,
        overallDifficulty: data.itinerary.overallDifficulty
      });
      if (data.itinerary.isPublic && typeof window !== 'undefined') {
        const url = `${window.location.origin}/${locale}/plan/${data.itinerary.shareSlug}`;
        setLastShareUrl(url);
        onTrackPlannerEvent('itinerary_share', { sourceType });
      } else {
        setLastShareUrl(null);
      }
    } finally {
      setSaving(false);
    }
  }

  function renderTierLabel(tier: PolarHikingDifficultyTier): string {
    return tAdv(`tier${tier}Label`);
  }

  return (
    <div className="space-y-3.5">
      {/* Sub-Mode Switch: Custom Route Advisor vs Official Corridors */}
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-sky-400/25 bg-slate-950/65 p-1 text-xs">
        <button
          type="button"
          onClick={() => setSubMode('custom')}
          className={`min-w-0 truncate rounded-lg px-2.5 py-1.5 font-semibold transition ${
            subMode === 'custom'
              ? 'bg-sky-400 text-slate-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {tPlan('modeCustom')}
        </button>
        <button
          type="button"
          onClick={() => setSubMode('corridors')}
          className={`min-w-0 truncate rounded-lg px-2.5 py-1.5 font-semibold transition ${
            subMode === 'corridors'
              ? 'bg-sky-400 text-slate-950'
              : 'text-slate-300 hover:text-white'
          }`}
        >
          {tPlan('modeCorridors')}
        </button>
      </div>

      {subMode === 'corridors' ? (
        <ExpeditionCorridorBriefing
          locale={locale}
          units={units}
          corridors={corridors}
          activeCorridor={activeCorridor}
          stations={stations}
          weatherList={weatherList}
          marineList={marineList}
          geologicalSites={geologicalSites}
          monuments={monuments}
          onSelectCorridor={onSelectCorridor}
          onFocusCoordinates={onFocusCoordinates}
        />
      ) : (
        <div className="space-y-3.5">
          {/* Plan Title & Timing Controls */}
          <div className="rounded-xl border border-slate-700/70 bg-slate-950/55 p-3 space-y-2.5 text-xs">
            <label className="block space-y-1 text-slate-300">
              <span className="font-medium">{tPlan('planTitleLabel')}</span>
              <input
                type="text"
                value={planTitle}
                onChange={(e) => onChangePlanTitle(e.target.value)}
                placeholder={tPlan('planTitlePlaceholder')}
                className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white focus:border-sky-400 focus:outline-none"
              />
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 items-end">
              <label className="block space-y-1 text-slate-300">
                <span>{tPlan('startDateLabel')}</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => onChangeStartDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-white focus:border-sky-400 focus:outline-none"
                />
              </label>

              <label className="flex items-center gap-2 rounded-lg border border-slate-700/80 bg-slate-900/70 px-2.5 py-2 text-[11px] text-slate-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={simulateLiveNow}
                  onChange={(e) => onChangeSimulateLiveNow(e.target.checked)}
                  className="accent-sky-400"
                />
                <span className="min-w-0 leading-tight">
                  {tPlan('simulateLiveToggle')}
                </span>
              </label>
            </div>
          </div>

          {/* 3-in-1 Zero-Key Import Bar */}
          <div className="rounded-xl border border-sky-400/25 bg-slate-950/55 p-3 space-y-2.5 text-xs">
            <div className="font-semibold text-sky-300">
              {tPlan('importChannelsTitle')}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".gpx,.geojson,.json,.kml,.csv,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div className="grid grid-cols-2 gap-1.5">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-sky-400/40 bg-sky-500/15 px-2.5 py-2 text-[11px] font-medium text-sky-200 hover:bg-sky-500/25 min-w-0"
              >
                <Upload className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{tPlan('uploadFileBtn')}</span>
              </button>

              <button
                type="button"
                onClick={handleCloneCorridor}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-emerald-400/35 bg-emerald-500/15 px-2.5 py-2 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/25 min-w-0"
              >
                <Sparkles className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{tPlan('clonePresetBtn')}</span>
              </button>

              <button
                type="button"
                onClick={onTogglePickWaypoints}
                className={`inline-flex items-center justify-center gap-1.5 rounded-xl border px-2.5 py-2 text-[11px] font-medium transition min-w-0 ${
                  isPickingWaypoints
                    ? 'border-fuchsia-400 bg-fuchsia-500/25 text-fuchsia-100'
                    : 'border-slate-700 bg-slate-900 text-slate-200 hover:border-sky-400/50'
                }`}
              >
                <Crosshair className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {isPickingWaypoints
                    ? tPlan('mapPickActive')
                    : tPlan('mapPickOff')}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setShowTextImporter((v) => !v)}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/35 bg-amber-500/15 px-2.5 py-2 text-[11px] font-medium text-amber-200 hover:bg-amber-500/25 min-w-0"
              >
                <FileText className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{tPlan('pasteTextToggle')}</span>
              </button>
            </div>

            <p className="text-[10px] text-slate-400">{tPlan('uploadHint')}</p>

            {showTextImporter && (
              <div className="space-y-2 border-t border-slate-800 pt-2.5">
                <textarea
                  rows={4}
                  value={freeText}
                  onChange={(e) => setFreeText(e.target.value)}
                  placeholder={tPlan('pasteTextPlaceholder')}
                  className="w-full rounded-lg border border-slate-700 bg-slate-900 p-2 text-xs text-white focus:border-sky-400 focus:outline-none"
                />
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setFreeText(SAMPLE_FREE_TEXT_BY_LOCALE[locale])}
                    className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:text-white"
                  >
                    {tPlan('sampleTextBtn')}
                  </button>
                  <button
                    type="button"
                    onClick={handleParseFreeText}
                    className="rounded-lg bg-amber-400 px-3 py-1 text-[11px] font-bold text-slate-950 hover:bg-amber-300"
                  >
                    {tPlan('parseTextBtn')}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Gazetteer Place Search & Waypoint Editor */}
          <div className="rounded-xl border border-slate-700/70 bg-slate-950/55 p-3 space-y-2.5 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="font-semibold text-white">
                {tPlan('waypointsHeader', { count: waypoints.length })}
              </span>
              {waypoints.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    onChangeWaypoints([]);
                    onChangeEvaluation(null);
                  }}
                  className="text-[11px] text-rose-300 hover:underline"
                >
                  {tPlan('clearAllBtn')}
                </button>
              )}
            </div>

            <form onSubmit={handleQuickAddPlace} className="flex gap-1.5">
              <input
                type="text"
                value={quickPlaceQuery}
                onChange={(e) => setQuickPlaceQuery(e.target.value)}
                placeholder={tPlan('addPlacePlaceholder')}
                className="min-w-0 flex-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-xs text-white focus:border-sky-400 focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-lg border border-sky-400/40 bg-sky-500/20 px-3 py-1.5 text-xs font-semibold text-sky-200 hover:bg-sky-500/30 shrink-0"
              >
                {tPlan('addPlaceBtn')}
              </button>
            </form>

            {waypoints.length > 0 && (
              <ol className="space-y-1.5 max-h-[210px] overflow-y-auto pr-1">
                {waypoints.map((wp, idx) => (
                  <li
                    key={wp.id}
                    className="flex flex-wrap items-center justify-between gap-1.5 rounded-lg border border-slate-800 bg-slate-900/75 px-2.5 py-1.5"
                  >
                    <button
                      type="button"
                      onClick={() => onFocusCoordinates(wp.lat, wp.lon, 4)}
                      className="min-w-0 flex-1 text-left font-medium text-sky-200 hover:underline truncate"
                    >
                      {idx + 1}. {wp.name}
                    </button>

                    <select
                      value={wp.activityType}
                      onChange={(e) => {
                        const next = [...waypoints];
                        next[idx] = {
                          ...wp,
                          activityType: e.target.value as ItineraryActivityType
                        };
                        onChangeWaypoints(next);
                      }}
                      className="rounded border border-slate-700 bg-slate-950 px-1.5 py-0.5 text-[10px] text-slate-200"
                    >
                      {(
                        [
                          'cruise',
                          'zodiac-landing',
                          'hiking',
                          'camping',
                          'flight'
                        ] as const
                      ).map((act) => (
                        <option key={act} value={act}>
                          {tPlan(`act_${act}`)}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => {
                        const next = waypoints.filter((_, i) => i !== idx);
                        onChangeWaypoints(next);
                      }}
                      className="text-slate-400 hover:text-rose-300 p-0.5"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </li>
                ))}
              </ol>
            )}

            <button
              type="button"
              disabled={waypoints.length === 0 || evaluating}
              onClick={() => runEvaluation(waypoints, simulateLiveNow)}
              className="w-full rounded-xl bg-sky-400 py-2 text-xs font-bold text-slate-950 hover:bg-sky-300 disabled:opacity-45 transition"
            >
              {evaluating ? tPlan('evaluatingBtn') : tPlan('evaluateBtn')}
            </button>
          </div>

          {/* Multi-Dimensional Evaluation & Polar Hiking Advisory Output */}
          {evaluation && (
            <div className="space-y-3 rounded-2xl border border-sky-400/35 bg-slate-950/65 p-3.5 text-xs">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-bold text-white">
                  {tAdv('summaryTitle')}
                </h3>
                <span
                  className={`rounded-full border px-2.5 py-0.5 text-[11px] font-bold ${
                    TIER_BADGE_CLASSES[evaluation.overallDifficultyTier]
                  }`}
                >
                  {renderTierLabel(evaluation.overallDifficultyTier)}
                </span>
              </div>

              {/* KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs">
                <div className="rounded-xl bg-slate-900/80 p-2">
                  <span className="block font-sans text-[10px] text-slate-400">
                    {tAdv('totalDistance')}
                  </span>
                  <span className="font-semibold text-sky-300">
                    {evaluation.totalDistanceKm} km
                  </span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-2">
                  <span className="block font-sans text-[10px] text-slate-400">
                    {tAdv('totalElevGain')}
                  </span>
                  <span className="font-semibold text-emerald-300">
                    +{formatPolarLength(evaluation.totalElevationGainM, units, locale, 0)}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-2">
                  <span className="block font-sans text-[10px] text-slate-400">
                    {tAdv('minWindChill')}
                  </span>
                  <span className="font-semibold text-amber-200">
                    {formatPolarTemperature(evaluation.minWindChillC, units, locale)}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-2">
                  <span className="block font-sans text-[10px] text-slate-400">
                    {tAdv('maxGust')}
                  </span>
                  <span className="font-semibold text-orange-300">
                    {formatPolarWindSpeed(evaluation.maxGustKmh, units, locale)}
                  </span>
                </div>
                <div className="rounded-xl bg-slate-900/80 p-2">
                  <span className="block font-sans text-[10px] text-slate-400">
                    {tAdv('peakWave')}
                  </span>
                  <span className="font-semibold text-indigo-200">
                    {evaluation.peakWaveM > 0
                      ? formatPolarLength(evaluation.peakWaveM, units, locale, 1)
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Action Toolbar: Open Bottom Profile Chart, Export GPX, Print, Save & Share */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={onOpenHikingDock}
                  className="inline-flex items-center gap-1 rounded-lg border border-emerald-400/40 bg-emerald-500/15 px-2.5 py-1.5 text-[11px] font-medium text-emerald-200 hover:bg-emerald-500/25"
                >
                  <Activity className="h-3.5 w-3.5" />
                  <span>{tPlan('openProfileDockBtn')}</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportGpx}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-200 hover:border-sky-400"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{tPlan('exportGpxBtn')}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== 'undefined') window.print();
                  }}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1.5 text-[11px] text-slate-200 hover:border-sky-400"
                >
                  <Printer className="h-3.5 w-3.5" />
                  <span>{tPlan('printReportBtn')}</span>
                </button>
              </div>

              {/* Cloud Save & Public Share Section */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-2.5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="inline-flex items-center gap-1.5 text-[11px] text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isPublicShare}
                      onChange={(e) => setIsPublicShare(e.target.checked)}
                      className="accent-sky-400"
                    />
                    <span>{tPlan('publicShareToggle')}</span>
                  </label>

                  <button
                    type="button"
                    disabled={saving}
                    onClick={handleSaveToCloud}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-400 px-3 py-1.5 text-[11px] font-bold text-slate-950 hover:bg-sky-300"
                  >
                    <Save className="h-3.5 w-3.5" />
                    <span>{tPlan('saveCloudBtn')}</span>
                  </button>
                </div>

                {!user && (
                  <p className="text-[10px] text-slate-400">
                    {tPlan('guestSaveHint')}
                  </p>
                )}

                {lastShareUrl && (
                  <div className="flex items-center justify-between gap-2 rounded-lg border border-emerald-400/35 bg-emerald-500/10 px-2.5 py-1.5 text-[11px] text-emerald-200">
                    <span className="truncate font-mono">{lastShareUrl}</span>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(lastShareUrl).catch(() => {});
                        setCopiedShare(true);
                        setTimeout(() => setCopiedShare(false), 2000);
                      }}
                      className="inline-flex items-center gap-1 shrink-0 font-semibold text-white"
                    >
                      {copiedShare ? (
                        <Check className="h-3.5 w-3.5 text-emerald-300" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Recommended Gear Checklist */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 font-semibold text-sky-300">
                  <Backpack className="h-3.5 w-3.5" />
                  <span>{tAdv('gearTitle')}</span>
                </div>
                <ul className="space-y-1 text-[11px] text-slate-200">
                  {evaluation.recommendedGearKeys.slice(0, 7).map((gk) => (
                    <li
                      key={gk}
                      className="rounded-lg border border-slate-800 bg-slate-900/60 px-2.5 py-1.5"
                    >
                      ✓ {tAdv(`gear_${gk}`)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Polar Travel Hacks */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center gap-1.5 font-semibold text-amber-300">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{tAdv('hacksTitle')}</span>
                </div>
                <ul className="space-y-1.5 text-[11px] leading-relaxed text-amber-100/95">
                  {evaluation.topPolarHackKeys.slice(0, 5).map((hk) => (
                    <li
                      key={hk}
                      className="rounded-lg border border-amber-400/25 bg-amber-500/10 px-2.5 py-2"
                    >
                      {tAdv(`hack_${hk}`)}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Segment-by-Segment Rating & PostGIS Nearby Anchors */}
              <div className="space-y-2 border-t border-slate-800 pt-2.5">
                {evaluation.segments.map((seg) => (
                  <div
                    key={seg.waypointId}
                    onClick={() => onFocusCoordinates(seg.lat, seg.lon, 4)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') onFocusCoordinates(seg.lat, seg.lon, 4);
                    }}
                    className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/75 hover:border-sky-400/50 p-2.5 space-y-1.5 transition"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-1.5">
                      <span className="font-semibold text-white">
                        {seg.segmentIndex + 1}. {seg.title}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 text-[10px] font-bold ${
                          TIER_BADGE_CLASSES[seg.hikingDifficultyTier]
                        }`}
                      >
                        T{seg.hikingDifficultyTier}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-slate-300">
                      <span>{seg.plannedDate}</span>
                      <span>
                        {seg.weatherSourceMode === 'live-forecast'
                          ? tAdv('sourceLive')
                          : tAdv('sourceClimatology')}
                      </span>
                      <span>
                        WC {formatPolarTemperature(seg.expectedWindChillC, units, locale)}
                      </span>
                      <span>
                        {tAdv('slopeLabel')} {seg.maxSlopeDeg}°
                      </span>
                    </div>

                    {seg.nearbyAnchors.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1 pt-0.5 text-[10px]">
                        <span className="text-slate-400">{tAdv('nearbyTitle')}:</span>
                        {seg.nearbyAnchors.map((anc) => (
                          <button
                            key={anc.id}
                            type="button"
                            onClick={(ev) => {
                              ev.stopPropagation();
                              onInspectEntity(anc.id, anc.lat, anc.lon);
                            }}
                            className="inline-flex items-center gap-0.5 rounded border border-sky-400/30 bg-sky-500/10 px-1.5 py-0.5 text-sky-200 hover:border-sky-400"
                          >
                            <MapPin className="h-2.5 w-2.5" />
                            <span>
                              {anc.name[locale]} ({anc.distanceKm}km)
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mandatory Polar Safety & Liability Disclaimer */}
          <PolarLiabilityBanner locale={locale} />
        </div>
      )}
    </div>
  );
}
