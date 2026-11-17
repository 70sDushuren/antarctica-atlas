'use client';

import { useMemo } from 'react';
import { Anchor, ExternalLink, Landmark, Mountain, Sun, Wind } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import { computePolarSolarState } from '@/lib/polar-math';
import type {
  ExpeditionCorridor,
  HistoricMonument,
  MarineCorridorTelemetry,
  PolarGeologicalSite,
  PolarStation,
  StationWeatherTelemetry,
  UnitSystem
} from '@/lib/types';
import {
  formatLocalizedNumber,
  formatPolarLength,
  formatPolarTemperature,
  formatPolarWindSpeed
} from '@/lib/units-and-format';

export interface ExpeditionCorridorBriefingProps {
  locale: SupportedLocale;
  units: UnitSystem;
  corridors: ExpeditionCorridor[];
  activeCorridor: ExpeditionCorridor;
  stations: PolarStation[];
  weatherList: StationWeatherTelemetry[];
  marineList: MarineCorridorTelemetry[];
  geologicalSites: PolarGeologicalSite[];
  monuments: HistoricMonument[];
  onSelectCorridor: (corridorId: string) => void;
  onFocusCoordinates: (lat: number, lon: number, zoom?: number) => void;
}

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const r = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return 2 * r * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export function ExpeditionCorridorBriefing({
  locale,
  units,
  corridors,
  activeCorridor,
  stations,
  weatherList,
  marineList,
  geologicalSites,
  monuments,
  onSelectCorridor,
  onFocusCoordinates
}: ExpeditionCorridorBriefingProps) {
  const tCor = useTranslations('corridor');
  const tTel = useTranslations('telemetry');

  const weatherByStation = useMemo(() => {
    const m: Record<string, StationWeatherTelemetry> = {};
    for (const w of weatherList) m[w.stationId] = w;
    return m;
  }, [weatherList]);

  // Cross-module corridor synthesis
  const briefing = useMemo(() => {
    let peakWaveM = 0;
    let totalDaylightH = 0;

    const enrichedWaypoints = activeCorridor.waypoints.map((wp) => {
      const solar = computePolarSolarState(wp.lat);
      totalDaylightH += solar.daylightHours;

      // Nearest station within 950 km
      let nearestStation: PolarStation | undefined;
      let minStDist = Infinity;
      for (const st of stations) {
        const d = haversineKm(wp.lat, wp.lon, st.lat, st.lon);
        if (d < minStDist) {
          minStDist = d;
          nearestStation = st;
        }
      }

      // Nearest marine buoy within 950 km
      let nearestBuoy: MarineCorridorTelemetry | undefined;
      let minBuoyDist = Infinity;
      for (const mb of marineList) {
        const d = haversineKm(wp.lat, wp.lon, mb.lat, mb.lon);
        if (d < minBuoyDist) {
          minBuoyDist = d;
          nearestBuoy = mb;
        }
      }
      if (nearestBuoy && minBuoyDist < 950 && nearestBuoy.waveHeightM > peakWaveM) {
        peakWaveM = nearestBuoy.waveHeightM;
      }

      // Linked geology within 650 km
      const linkedGeo = geologicalSites.find(
        (g) => haversineKm(wp.lat, wp.lon, g.lat, g.lon) <= 650
      );

      // Linked HSM within 550 km
      const linkedHsm = monuments.find(
        (h) => haversineKm(wp.lat, wp.lon, h.lat, h.lon) <= 550
      );

      return {
        wp,
        solar,
        nearestStation: minStDist <= 1200 ? nearestStation : undefined,
        stationWeather: nearestStation ? weatherByStation[nearestStation.id] : undefined,
        nearestBuoy: minBuoyDist <= 950 ? nearestBuoy : undefined,
        linkedGeo,
        linkedHsm
      };
    });

    const meanDaylightH =
      activeCorridor.waypoints.length > 0
        ? Math.round((totalDaylightH / activeCorridor.waypoints.length) * 10) / 10
        : 20;

    return {
      peakWaveM,
      meanDaylightH,
      enrichedWaypoints
    };
  }, [
    activeCorridor,
    stations,
    weatherByStation,
    marineList,
    geologicalSites,
    monuments
  ]);

  return (
    <div className="cryo-card rounded-2xl p-4 space-y-3.5">
      {/* Header & IAATO Reference */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <Anchor className="h-4 w-4 text-sky-400 shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              {tCor('pinnedLabel')}
            </span>
          </div>
          <h2 className="mt-0.5 text-sm font-bold text-white">
            {tCor('briefingTitle')}
          </h2>
        </div>

        <a
          href={activeCorridor.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
        >
          <span>IAATO Guidelines</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <p className="text-xs text-slate-300">{tCor('briefingSubtitle')}</p>

      {/* Corridor Selector */}
      <label className="block text-xs text-slate-400">
        {tCor('selectRoute')}
        <select
          value={activeCorridor.id}
          onChange={(e) => onSelectCorridor(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-sky-400/35 bg-slate-900/95 px-3 py-2 text-xs font-medium text-white focus:outline-none focus:ring-2 focus:ring-sky-400"
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

      {/* 4 Corridor Summary KPIs */}
      <div className="grid grid-cols-2 gap-2 text-xs font-mono">
        <div className="rounded-xl bg-slate-950/60 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tCor('distanceLabel')}
          </span>
          <span className="text-sm font-semibold text-sky-300">
            {formatLocalizedNumber(activeCorridor.distanceNauticalMiles, locale, 0)} nm
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/60 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tCor('durationLabel')}
          </span>
          <span className="text-sm font-semibold text-emerald-300">
            {activeCorridor.durationDays} d
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/60 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tCor('peakSwellLabel')}
          </span>
          <span className="text-sm font-semibold text-amber-300">
            {briefing.peakWaveM > 0
              ? formatPolarLength(briefing.peakWaveM, units, locale, 1)
              : '— (Inland Air)'}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/60 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tCor('meanDaylightLabel')}
          </span>
          <span className="text-sm font-semibold text-amber-200">
            {formatLocalizedNumber(briefing.meanDaylightH, locale, 1)} h/d
          </span>
        </div>
      </div>

      {/* Multi-Dimensional Segment Waypoint Cards */}
      <ol className="space-y-2.5 border-t border-slate-700/60 pt-3">
        {briefing.enrichedWaypoints.map((item, idx) => (
          <li key={item.wp.id}>
            <div
              onClick={() => onFocusCoordinates(item.wp.lat, item.wp.lon, 4)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onFocusCoordinates(item.wp.lat, item.wp.lon, 4);
                }
              }}
              className="cursor-pointer rounded-xl border border-slate-700/55 bg-slate-950/50 hover:border-sky-400/55 p-3 text-xs space-y-2 transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-semibold text-sky-200">
                <span>
                  {idx + 1}. {item.wp.name[locale]}
                </span>
                <span className="font-mono text-[11px] text-slate-400">
                  {item.wp.lat.toFixed(2)}°, {item.wp.lon.toFixed(2)}°
                </span>
              </div>

              <p className="text-[11px] leading-relaxed text-slate-300">
                {item.wp.highlight[locale]}
              </p>

              {/* Cross-Module Linked Telemetry Pills */}
              <div className="flex flex-wrap gap-1.5 pt-0.5 text-[10px]">
                <span className="inline-flex items-center gap-1 rounded-md border border-amber-400/25 bg-amber-500/10 px-2 py-0.5 text-amber-200">
                  <Sun className="h-3 w-3" />
                  <span>
                    {item.solar.regime === 'polar-day'
                      ? tTel('polarDay')
                      : item.solar.regime === 'polar-night'
                        ? tTel('polarNight')
                        : `${item.solar.daylightHours}h`}
                  </span>
                </span>

                {item.stationWeather && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-sky-400/25 bg-sky-500/10 px-2 py-0.5 font-mono text-sky-200">
                    <Wind className="h-3 w-3" />
                    <span>
                      {formatPolarTemperature(
                        item.stationWeather.temperature2mC,
                        units,
                        locale
                      )}{' '}
                      ·{' '}
                      {formatPolarWindSpeed(
                        item.stationWeather.windGusts10mKmh,
                        units,
                        locale
                      )}
                    </span>
                  </span>
                )}

                {item.nearestBuoy && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-indigo-400/30 bg-indigo-500/10 px-2 py-0.5 font-mono text-indigo-200">
                    <span>
                      Hs {formatPolarLength(item.nearestBuoy.waveHeightM, units, locale, 1)}
                    </span>
                  </span>
                )}

                {item.linkedGeo && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-fuchsia-400/30 bg-fuchsia-500/10 px-2 py-0.5 text-fuchsia-200">
                    <Mountain className="h-3 w-3 shrink-0" />
                    <span className="truncate max-w-[180px]">
                      {item.linkedGeo.name[locale]}
                    </span>
                  </span>
                )}

                {item.linkedHsm && (
                  <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-500/10 px-2 py-0.5 text-emerald-200">
                    <Landmark className="h-3 w-3 shrink-0" />
                    <span>{item.linkedHsm.hsmCode}</span>
                  </span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <p className="text-[11px] text-slate-400">{tCor('safetyNotice')}</p>
    </div>
  );
}
