'use client';

import { useState } from 'react';
import { ExternalLink, Flame, Layers } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import type {
  GeologyFeatureCategory,
  PolarGeologicalSite,
  PolarMacroRegion,
  UnitSystem
} from '@/lib/types';
import { formatLocalizedNumber, formatPolarLength } from '@/lib/units-and-format';

export interface GeologySitesAndRegionsPanelProps {
  locale: SupportedLocale;
  units: UnitSystem;
  sites: PolarGeologicalSite[];
  macroRegions: PolarMacroRegion[];
  onFocusCoordinates: (lat: number, lon: number, zoom?: number) => void;
}

export function GeologySitesAndRegionsPanel({
  locale,
  units,
  sites,
  macroRegions,
  onFocusCoordinates
}: GeologySitesAndRegionsPanelProps) {
  const tGeo = useTranslations('geology');
  const [categoryFilter, setCategoryFilter] = useState<'all' | GeologyFeatureCategory>('all');

  const filteredSites =
    categoryFilter === 'all'
      ? sites
      : sites.filter((s) => s.category === categoryFilter);

  const filterButtons: Array<['all' | GeologyFeatureCategory, string]> = [
    ['all', tGeo('catAll')],
    ['volcano', tGeo('catVolcano')],
    ['subglacial-tectonic', tGeo('catTectonic')],
    ['cryosphere-lake-valley', tGeo('catLakeValley')],
    ['gondwana-fossil', tGeo('catFossil')]
  ];

  return (
    <div className="space-y-4">
      {/* 1. Three Antarctic Physiographic Provinces */}
      <div className="cryo-card rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2">
          <Layers className="h-4 w-4 text-sky-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            {tGeo('macroRegionsTitle')}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {macroRegions.map((reg) => (
            <button
              key={reg.id}
              type="button"
              onClick={() => onFocusCoordinates(reg.centerLat, reg.centerLon, 3)}
              className="text-left rounded-xl border border-sky-400/20 bg-slate-950/50 hover:border-sky-400/60 p-3 space-y-1.5 transition"
            >
              <div className="text-xs font-semibold text-sky-200">
                {reg.name[locale]}
              </div>
              <div className="text-[11px] text-amber-200/90">
                {reg.crustalAge[locale]}
              </div>
              <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-emerald-300">
                <span>
                  ~{formatPolarLength(reg.meanIceThicknessM, units, locale, 0)}
                </span>
                <span>·</span>
                <span>
                  {tGeo('sleLabel')} +{formatLocalizedNumber(reg.seaLevelEquivalentM, locale, 1)} m
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {reg.summary[locale]}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* 2. SCAR GeoMAP Outcrops, Volcanoes & Gondwana Fossils */}
      <div className="cryo-card rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-rose-200">
              {tGeo('sitesTitle')}
            </h3>
          </div>
          <a
            href="https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
          >
            <span>SCAR GeoMAP (GNS)</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-1.5">
          {filterButtons.map(([cat, label]) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategoryFilter(cat)}
              className={`min-w-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition ${
                categoryFilter === cat
                  ? 'bg-sky-400 text-slate-950'
                  : 'border border-slate-700/70 bg-slate-950/50 text-slate-300 hover:text-white'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Geological Site Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredSites.map((site) => (
            <div
              key={site.id}
              onClick={() => onFocusCoordinates(site.lat, site.lon, 4)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onFocusCoordinates(site.lat, site.lon, 4);
                }
              }}
              className="cursor-pointer rounded-xl border border-slate-700/60 bg-slate-950/50 hover:border-fuchsia-400/55 p-3 space-y-1.5 text-xs transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-1">
                <span className="font-semibold text-white">
                  {site.name[locale]}
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 font-mono text-[10px] ${
                    site.elevationOrDepthM < 0
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}
                >
                  {site.elevationOrDepthM > 0 ? '+' : ''}
                  {formatPolarLength(site.elevationOrDepthM, units, locale, 0)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-sky-300">
                <span>{site.rockOrFeatureType[locale]}</span>
                <a
                  href={site.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="font-mono text-[10px] text-slate-400 hover:text-sky-300 underline"
                >
                  {site.lat.toFixed(2)}°, {site.lon.toFixed(2)}°
                </a>
              </div>

              <div className="text-[10px] text-slate-400">
                {site.geologicAge[locale]}
              </div>

              <p className="text-[11px] leading-relaxed text-slate-300">
                {site.summary[locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
