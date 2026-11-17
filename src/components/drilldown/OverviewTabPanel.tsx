'use client';

import { useMemo, useState } from 'react';
import {
  ChevronRight,
  Compass,
  Landmark,
  MapPin,
  Snowflake,
  Wind
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PolarGazetteerSearch } from '@/components/geology-lab';
import { HeritageChronicleSection } from '@/components/heritage-chronicle';
import type { SupportedLocale } from '@/i18n/routing';
import type {
  AntarcticRegionId,
  ChronicleAct,
  GazetteerEntry,
  HistoricExpeditionTrack,
  HistoricMonument,
  HistoricTrackRenderLayer,
  PolarLandingHotspot,
  PolarStation,
  StationWeatherTelemetry,
  UnitSystem
} from '@/lib/types';
import {
  formatPolarTemperature,
  formatPolarWindSpeed
} from '@/lib/units-and-format';

const SECTOR_CONFIGS: Array<{
  id: AntarcticRegionId;
  centerLat: number;
  centerLon: number;
  zoom: number;
}> = [
  { id: 'antarctic-peninsula', centerLat: -63.8, centerLon: -61.2, zoom: 4 },
  { id: 'weddell-sea-sector', centerLat: -68.5, centerLon: -52.0, zoom: 3 },
  { id: 'ross-sea-sector', centerLat: -76.8, centerLon: 170.0, zoom: 3 },
  { id: 'west-antarctica', centerLat: -79.2, centerLon: -92.0, zoom: 3 },
  { id: 'east-antarctica', centerLat: -70.5, centerLon: 76.0, zoom: 3 },
  { id: 'south-pole-plateau', centerLat: -87.5, centerLon: 25.0, zoom: 3 }
];

type L2SubCategory = 'stations' | 'landings' | 'heritage' | 'gazetteer';

export interface OverviewTabPanelProps {
  locale: SupportedLocale;
  units: UnitSystem;
  activeRegion: AntarcticRegionId | 'all';
  stations: PolarStation[];
  weatherList: StationWeatherTelemetry[];
  landingHotspots: PolarLandingHotspot[];
  monuments: HistoricMonument[];
  chronicleActs: ChronicleAct[];
  historicTracks: HistoricExpeditionTrack[];
  gazetteerEntries: GazetteerEntry[];
  onSelectSector: (
    sector: AntarcticRegionId | 'all',
    camera?: { lat: number; lon: number; zoom: number }
  ) => void;
  onInspectEntity: (inspectKey: string, lat: number, lon: number) => void;
  onFocusCoordinates: (lat: number, lon: number, zoom?: number) => void;
  onTrackLayersChange: (layers: HistoricTrackRenderLayer[]) => void;
}

export function OverviewTabPanel({
  locale,
  units,
  activeRegion,
  stations,
  weatherList,
  landingHotspots,
  monuments,
  chronicleActs,
  historicTracks,
  gazetteerEntries,
  onSelectSector,
  onInspectEntity,
  onFocusCoordinates,
  onTrackLayersChange
}: OverviewTabPanelProps) {
  const tDrill = useTranslations('drilldown');
  const [subCat, setSubCat] = useState<L2SubCategory>('stations');

  const weatherByStation = useMemo(() => {
    const m: Record<string, StationWeatherTelemetry> = {};
    for (const w of weatherList) m[w.stationId] = w;
    return m;
  }, [weatherList]);

  const continentalExtremes = useMemo(() => {
    let coldest: { st: PolarStation; tempC: number } | null = null;
    let windiest: { st: PolarStation; gustKmh: number } | null = null;

    for (const st of stations) {
      const w = weatherByStation[st.id];
      if (!w) continue;
      if (!coldest || w.temperature2mC < coldest.tempC) {
        coldest = { st, tempC: w.temperature2mC };
      }
      if (!windiest || w.windGusts10mKmh > windiest.gustKmh) {
        windiest = { st, gustKmh: w.windGusts10mKmh };
      }
    }
    return { coldest, windiest };
  }, [stations, weatherByStation]);

  // L1 Continental Sector Grid
  if (activeRegion === 'all') {
    return (
      <div className="space-y-3.5">
        <div>
          <h2 className="text-sm font-bold text-sky-300">{tDrill('l1Title')}</h2>
          <p className="mt-1 text-xs leading-relaxed text-slate-300">
            {tDrill('l1Subtitle')}
          </p>
        </div>

        {/* Continental Live Extremes Banner */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              if (continentalExtremes.coldest) {
                const s = continentalExtremes.coldest.st;
                onInspectEntity(`station:${s.id}`, s.lat, s.lon);
              }
            }}
            className="rounded-xl border border-sky-400/25 bg-slate-950/65 p-2.5 text-left hover:border-sky-400/60 transition min-w-0"
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Snowflake className="h-3 w-3 text-sky-400 shrink-0" />
              <span className="truncate">{tDrill('coldestNode')}</span>
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-sky-200">
              {continentalExtremes.coldest
                ? formatPolarTemperature(
                    continentalExtremes.coldest.tempC,
                    units,
                    locale
                  )
                : '—'}
            </div>
            <div className="truncate text-[11px] text-slate-300">
              {continentalExtremes.coldest?.st.name[locale] ?? ''}
            </div>
          </button>

          <button
            type="button"
            onClick={() => {
              if (continentalExtremes.windiest) {
                const s = continentalExtremes.windiest.st;
                onInspectEntity(`station:${s.id}`, s.lat, s.lon);
              }
            }}
            className="rounded-xl border border-amber-400/25 bg-slate-950/65 p-2.5 text-left hover:border-amber-400/60 transition min-w-0"
          >
            <div className="flex items-center gap-1 text-[10px] text-slate-400">
              <Wind className="h-3 w-3 text-amber-400 shrink-0" />
              <span className="truncate">{tDrill('windiestNode')}</span>
            </div>
            <div className="mt-1 font-mono text-sm font-bold text-amber-200">
              {continentalExtremes.windiest
                ? formatPolarWindSpeed(
                    continentalExtremes.windiest.gustKmh,
                    units,
                    locale
                  )
                : '—'}
            </div>
            <div className="truncate text-[11px] text-slate-300">
              {continentalExtremes.windiest?.st.name[locale] ?? ''}
            </div>
          </button>
        </div>

        {/* 6 Sector Drill-Down Cards */}
        <div className="space-y-2">
          {SECTOR_CONFIGS.map((sec) => {
            const secStations = stations.filter((s) => s.region === sec.id);
            const secLandings = landingHotspots.filter((l) => l.region === sec.id);
            let minT = Infinity;
            let maxG = 0;
            for (const s of secStations) {
              const w = weatherByStation[s.id];
              if (w) {
                if (w.temperature2mC < minT) minT = w.temperature2mC;
                if (w.windGusts10mKmh > maxG) maxG = w.windGusts10mKmh;
              }
            }

            return (
              <button
                key={sec.id}
                type="button"
                onClick={() =>
                  onSelectSector(sec.id, {
                    lat: sec.centerLat,
                    lon: sec.centerLon,
                    zoom: sec.zoom
                  })
                }
                className="w-full rounded-xl border border-slate-700/65 bg-slate-950/55 hover:border-sky-400/65 p-3 text-left space-y-1.5 transition group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white group-hover:text-sky-300 transition">
                    {tDrill(`sector_${sec.id}`)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-sky-300 shrink-0" />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[11px]">
                  <span className="rounded-md bg-sky-500/15 px-2 py-0.5 text-sky-200">
                    {tDrill('stationsBadge', { count: secStations.length })}
                  </span>
                  {secLandings.length > 0 && (
                    <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-emerald-200">
                      {tDrill('hotspotsBadge', { count: secLandings.length })}
                    </span>
                  )}
                  {Number.isFinite(minT) && (
                    <span className="font-mono text-slate-300">
                      {formatPolarTemperature(minT, units, locale)} ·{' '}
                      {formatPolarWindSpeed(maxG, units, locale)}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Quick-Access Exploration Heritage & Gazetteer Shortcuts */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
          <button
            type="button"
            onClick={() => {
              setSubCat('heritage');
              onSelectSector('ross-sea-sector', {
                lat: -77.85,
                lon: 166.67,
                zoom: 3
              });
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-amber-400/30 bg-amber-500/10 px-2.5 py-2 text-xs font-medium text-amber-200 hover:border-amber-400/70"
          >
            <Landmark className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{tDrill('subTabHeritage')}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setSubCat('gazetteer');
              onSelectSector('antarctic-peninsula', {
                lat: -63.8,
                lon: -61.2,
                zoom: 3
              });
            }}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-sky-400/30 bg-sky-500/10 px-2.5 py-2 text-xs font-medium text-sky-200 hover:border-sky-400/70"
          >
            <Compass className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{tDrill('subTabGazetteer')}</span>
          </button>
        </div>
      </div>
    );
  }

  // L2 Sector Filtered View
  const filteredStations = stations.filter((s) => s.region === activeRegion);
  const filteredLandings = landingHotspots.filter((l) => l.region === activeRegion);

  return (
    <div className="space-y-3">
      {/* Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
        <div className="min-w-0 text-xs">
          <span className="text-slate-400">{tDrill('breadcrumbRoot')} / </span>
          <span className="font-semibold text-sky-300">
            {tDrill(`sector_${activeRegion}`)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelectSector('all')}
          className="rounded-lg border border-sky-400/30 bg-slate-900 px-2.5 py-1 text-[11px] font-medium text-sky-200 hover:border-sky-400"
        >
          {tDrill('backToAllSectors')}
        </button>
      </div>

      {/* L2 Sub-Category Pills */}
      <div className="grid grid-cols-2 gap-1.5 text-xs">
        {(
          [
            ['stations', `${tDrill('subTabStations')} (${filteredStations.length})`],
            ['landings', `${tDrill('subTabLandings')} (${filteredLandings.length})`],
            ['heritage', tDrill('subTabHeritage')],
            ['gazetteer', tDrill('subTabGazetteer')]
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setSubCat(id)}
            className={`min-w-0 truncate rounded-xl border px-2.5 py-1.5 text-[11px] font-medium transition ${
              subCat === id
                ? 'border-sky-400 bg-sky-400 text-slate-950 font-semibold'
                : 'border-slate-700/80 bg-slate-950/60 text-slate-300 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {subCat === 'stations' && (
        <div className="space-y-2">
          {filteredStations.map((st) => {
            const w = weatherByStation[st.id];
            return (
              <button
                key={st.id}
                type="button"
                onClick={() => onInspectEntity(`station:${st.id}`, st.lat, st.lon)}
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/55 hover:border-sky-400/65 p-3 text-left space-y-1 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-sky-200">
                    {st.name[locale]} ({st.code})
                  </span>
                  {w && (
                    <span className="font-mono text-xs text-amber-200 shrink-0">
                      {formatPolarTemperature(w.temperature2mC, units, locale)}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  {st.summary[locale]}
                </p>
              </button>
            );
          })}
        </div>
      )}

      {subCat === 'landings' && (
        <div className="space-y-2">
          {(filteredLandings.length > 0 ? filteredLandings : landingHotspots).map(
            (site) => (
              <button
                key={site.id}
                type="button"
                onClick={() =>
                  onInspectEntity(`landing:${site.id}`, site.lat, site.lon)
                }
                className="w-full rounded-xl border border-slate-700/60 bg-slate-950/55 hover:border-emerald-400/65 p-3 text-left space-y-1 transition"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200 min-w-0">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{site.name[locale]}</span>
                  </span>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    +{site.typicalElevationGainM}m · {site.typicalMaxSlopeDeg}°
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 line-clamp-2">
                  {site.summary[locale]}
                </p>
              </button>
            )
          )}
        </div>
      )}

      {subCat === 'heritage' && (
        <HeritageChronicleSection
          locale={locale}
          acts={chronicleActs}
          tracks={historicTracks}
          monuments={monuments}
          onFocusCoordinates={onFocusCoordinates}
          onTrackLayersChange={onTrackLayersChange}
        />
      )}

      {subCat === 'gazetteer' && (
        <PolarGazetteerSearch
          locale={locale}
          entries={gazetteerEntries}
          onFocusCoordinates={onFocusCoordinates}
        />
      )}
    </div>
  );
}
