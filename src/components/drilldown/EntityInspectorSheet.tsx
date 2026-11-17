'use client';

import { useMemo, useState } from 'react';
import {
  ExternalLink,
  Layers,
  Plus,
  Sun,
  Wind,
  X
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import {
  computePolarSolarState,
  interpolateBedmapPoint,
  wgs84ToEpsg3031
} from '@/lib/polar-math';
import type {
  GazetteerEntry,
  HistoricMonument,
  PolarGeologicalSite,
  PolarLandingHotspot,
  PolarStation,
  StationWeatherTelemetry,
  SubglacialBedmapGrid,
  UnitSystem
} from '@/lib/types';
import {
  formatPolarLength,
  formatPolarTemperature,
  formatPolarWindSpeed
} from '@/lib/units-and-format';

export interface EntityInspectorSheetProps {
  locale: SupportedLocale;
  units: UnitSystem;
  inspectKey: string | null;
  bedmapGrid: SubglacialBedmapGrid | null;
  stations: PolarStation[];
  weatherList: StationWeatherTelemetry[];
  geologicalSites: PolarGeologicalSite[];
  monuments: HistoricMonument[];
  landingHotspots: PolarLandingHotspot[];
  gazetteerEntries: GazetteerEntry[];
  onClose: () => void;
  onAddPointToPlanner: (point: {
    name: string;
    lat: number;
    lon: number;
    elevationM?: number;
  }) => void;
}

export function EntityInspectorSheet({
  locale,
  units,
  inspectKey,
  bedmapGrid,
  stations,
  weatherList,
  geologicalSites,
  monuments,
  landingHotspots,
  gazetteerEntries,
  onClose,
  onAddPointToPlanner
}: EntityInspectorSheetProps) {
  const tDrill = useTranslations('drilldown');
  const tTel = useTranslations('telemetry');
  const tGeo = useTranslations('geology');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const entity = useMemo(() => {
    if (!inspectKey) return null;
    const [kind, rawId] = inspectKey.split(':');
    if (!kind || !rawId) return null;

    if (kind === 'station') {
      const st = stations.find((s) => s.id === rawId);
      if (!st) return null;
      return {
        badge: `${st.code} · ${st.countryName[locale]}`,
        title: st.name[locale],
        lat: st.lat,
        lon: st.lon,
        elevationM: st.elevationM,
        summary: st.summary[locale],
        highlight: null as string | null,
        sourceUrl: st.sourceUrl
      };
    }

    if (kind === 'geology') {
      const g = geologicalSites.find((s) => s.id === rawId);
      if (!g) return null;
      return {
        badge: g.rockOrFeatureType[locale],
        title: g.name[locale],
        lat: g.lat,
        lon: g.lon,
        elevationM: Math.max(0, g.elevationOrDepthM),
        summary: g.summary[locale],
        highlight: g.geologicAge[locale],
        sourceUrl: g.sourceUrl
      };
    }

    if (kind === 'hsm') {
      const m = monuments.find((h) => h.id === rawId);
      if (!m) return null;
      return {
        badge: `${m.hsmCode} · ${m.year}`,
        title: m.title[locale],
        lat: m.lat,
        lon: m.lon,
        elevationM: 15,
        summary: m.summary[locale],
        highlight: m.proposingParties,
        sourceUrl: m.sourceUrl
      };
    }

    if (kind === 'landing') {
      const l = landingHotspots.find((h) => h.id === rawId);
      if (!l) return null;
      return {
        badge: `+${l.typicalElevationGainM}m · ${l.typicalMaxSlopeDeg}°`,
        title: l.name[locale],
        lat: l.lat,
        lon: l.lon,
        elevationM: l.typicalElevationGainM,
        summary: l.summary[locale],
        highlight: l.highlight[locale],
        sourceUrl: l.sourceUrl
      };
    }

    if (kind === 'gazetteer') {
      const c = gazetteerEntries.find((e) => e.id === rawId);
      if (!c) return null;
      return {
        badge: `${c.cgaFeatureType[locale]} · ${c.firstChartedYear}`,
        title: c.names[locale],
        lat: c.lat,
        lon: c.lon,
        elevationM: 30,
        summary: c.etymology[locale],
        highlight: null,
        sourceUrl: c.sourceUrl
      };
    }

    return null;
  }, [
    inspectKey,
    locale,
    stations,
    geologicalSites,
    monuments,
    landingHotspots,
    gazetteerEntries
  ]);

  const diagnostics = useMemo(() => {
    if (!entity) return null;
    const xy = wgs84ToEpsg3031(entity.lat, entity.lon);
    const subglacial = bedmapGrid
      ? interpolateBedmapPoint(bedmapGrid, xy.x, xy.y)
      : null;
    const solar = computePolarSolarState(entity.lat);

    // Find nearest live station telemetry
    let nearestStation: PolarStation | null = null;
    let minDist = Infinity;
    for (const st of stations) {
      const sxy = wgs84ToEpsg3031(st.lat, st.lon);
      const d = Math.hypot(sxy.x - xy.x, sxy.y - xy.y);
      if (d < minDist) {
        minDist = d;
        nearestStation = st;
      }
    }
    const weather = nearestStation
      ? weatherList.find((w) => w.stationId === nearestStation?.id)
      : undefined;

    return {
      xKm: Math.round(xy.x / 1000),
      yKm: Math.round(xy.y / 1000),
      subglacial,
      solar,
      nearestStation,
      weather
    };
  }, [entity, bedmapGrid, stations, weatherList]);

  if (!entity || !diagnostics) return null;

  return (
    <div
      role="dialog"
      aria-label={tDrill('inspectTitle')}
      className="cryo-card rounded-2xl border-sky-400/50 p-4 space-y-3.5 shadow-2xl"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-800 pb-2.5">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-sky-400">
              {tDrill('inspectTitle')}
            </span>
            <span className="rounded-full border border-emerald-400/35 bg-emerald-500/15 px-2 py-0.5 text-[10px] text-emerald-200">
              {entity.badge}
            </span>
          </div>
          <h3 className="mt-1 text-sm font-bold text-white">{entity.title}</h3>
          <div className="mt-0.5 font-mono text-[11px] text-slate-400">
            {entity.lat.toFixed(3)}°, {entity.lon.toFixed(3)}° · EPSG:3031 (
            {diagnostics.xKm}km, {diagnostics.yKm}km)
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="rounded-lg border border-slate-700 bg-slate-900 p-1.5 text-slate-300 hover:text-white shrink-0"
          aria-label={tDrill('closeSheet')}
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <p className="text-xs leading-relaxed text-slate-200">{entity.summary}</p>

      {entity.highlight && (
        <div className="rounded-xl border border-amber-400/30 bg-amber-500/10 p-2.5 text-[11px] text-amber-100">
          {entity.highlight}
        </div>
      )}

      {/* Multi-Dimensional Telemetry Synthesis */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        {diagnostics.weather && (
          <div className="rounded-xl bg-slate-950/65 p-2.5 space-y-1">
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Wind className="h-3 w-3 text-sky-400" />
              <span className="truncate">{tDrill('inspectWeather')}</span>
            </div>
            <div className="font-mono font-semibold text-sky-200">
              {formatPolarTemperature(diagnostics.weather.temperature2mC, units, locale)} ·{' '}
              {formatPolarWindSpeed(diagnostics.weather.windGusts10mKmh, units, locale)}
            </div>
            <div className="font-mono text-[10px] text-slate-400">
              {tTel('windChill')}:{' '}
              {formatPolarTemperature(diagnostics.weather.windChillC, units, locale)}
            </div>
          </div>
        )}

        <div className="rounded-xl bg-slate-950/65 p-2.5 space-y-1">
          <div className="flex items-center gap-1 text-[10px] text-slate-400">
            <Sun className="h-3 w-3 text-amber-300" />
            <span className="truncate">{tDrill('inspectSolar')}</span>
          </div>
          <div className="font-semibold text-amber-200">
            {diagnostics.solar.regime === 'polar-day'
              ? tTel('polarDay')
              : diagnostics.solar.regime === 'polar-night'
                ? tTel('polarNight')
                : tTel('daylightHours', { hours: diagnostics.solar.daylightHours })}
          </div>
        </div>
      </div>

      {diagnostics.subglacial && (
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-2.5 text-xs space-y-1">
          <div className="flex items-center gap-1.5 text-[10px] text-fuchsia-300 font-semibold">
            <Layers className="h-3.5 w-3.5" />
            <span>{tDrill('inspectSubglacial')}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 font-mono text-[11px] pt-1">
            <div>
              <span className="block font-sans text-[10px] text-slate-400">
                {tGeo('layerModeSurface')}
              </span>
              <span className="text-sky-200">
                {formatPolarLength(
                  diagnostics.subglacial.surfaceElevationM,
                  units,
                  locale,
                  0
                )}
              </span>
            </div>
            <div>
              <span className="block font-sans text-[10px] text-slate-400">
                {tGeo('layerModeThickness')}
              </span>
              <span className="text-fuchsia-200">
                {formatPolarLength(
                  diagnostics.subglacial.iceThicknessM,
                  units,
                  locale,
                  0
                )}
              </span>
            </div>
            <div>
              <span className="block font-sans text-[10px] text-slate-400">
                {tGeo('layerModeBedrock')}
              </span>
              <span className="text-emerald-200">
                {formatPolarLength(
                  diagnostics.subglacial.bedElevationM,
                  units,
                  locale,
                  0
                )}
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
        <button
          type="button"
          onClick={() => {
            onAddPointToPlanner({
              name: entity.title,
              lat: entity.lat,
              lon: entity.lon,
              elevationM: entity.elevationM
            });
            setAddedFeedback(true);
            setTimeout(() => setAddedFeedback(false), 2000);
          }}
          className="inline-flex items-center gap-1.5 rounded-xl bg-sky-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-sky-300 transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{addedFeedback ? tDrill('addedToast') : tDrill('addToPlanBtn')}</span>
        </button>

        <a
          href={entity.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
        >
          <span>{tDrill('openSourceLink')}</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
}
