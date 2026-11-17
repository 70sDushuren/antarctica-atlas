'use client';

import { useMemo, useState } from 'react';
import { BookOpen, ExternalLink, Search } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { LOCALE_METADATA, SUPPORTED_LOCALES, type SupportedLocale } from '@/i18n/routing';
import type { GazetteerEntry } from '@/lib/types';

export interface PolarGazetteerSearchProps {
  locale: SupportedLocale;
  entries: GazetteerEntry[];
  onFocusCoordinates: (lat: number, lon: number, zoom?: number) => void;
}

export function PolarGazetteerSearch({
  locale,
  entries,
  onFocusCoordinates
}: PolarGazetteerSearchProps) {
  const tGeo = useTranslations('geology');
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return entries;
    return entries.filter((entry) => {
      const inNames = SUPPORTED_LOCALES.some((loc) =>
        entry.names[loc].toLowerCase().includes(q)
      );
      const inEtymology = SUPPORTED_LOCALES.some((loc) =>
        entry.etymology[loc].toLowerCase().includes(q)
      );
      return inNames || inEtymology;
    });
  }, [entries, query]);

  return (
    <div className="cryo-card rounded-2xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-emerald-300">
            {tGeo('gazetteerTitle')}
          </h3>
        </div>
        <a
          href="https://placenames.aq/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
        >
          <span>SCAR CGA Portal</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Cross-Lingual 6-Locale Search Input */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tGeo('gazetteerSearch')}
          className="w-full rounded-xl border border-emerald-400/30 bg-slate-950/60 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-emerald-400"
        />
      </div>

      {/* Gazetteer Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onFocusCoordinates(item.lat, item.lon, 4)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onFocusCoordinates(item.lat, item.lon, 4);
              }
            }}
            className="cursor-pointer rounded-xl border border-slate-700/60 bg-slate-950/50 hover:border-emerald-400/55 p-3 space-y-2 text-xs transition"
          >
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span className="font-semibold text-emerald-200">
                {item.names[locale]}
              </span>
              <span className="rounded bg-emerald-500/15 px-1.5 py-0.5 font-mono text-[10px] text-emerald-300">
                {tGeo('chartedYear', { year: item.firstChartedYear })}
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1 text-[11px] text-slate-400">
              <span>{item.cgaFeatureType[locale]}</span>
              <span className="font-mono">
                {item.lat.toFixed(2)}°, {item.lon.toFixed(2)}°
              </span>
            </div>

            {/* Parallel Multilingual Name Badges (EN / ES / PT / 简) */}
            <div className="flex flex-wrap gap-1">
              {(['en', 'es', 'pt', 'zh-CN'] as const).map((loc) => (
                <span
                  key={loc}
                  className="rounded border border-slate-700/70 bg-slate-900/80 px-1.5 py-0.5 text-[10px] text-slate-300"
                >
                  <b className="text-sky-400">{LOCALE_METADATA[loc].badge}:</b>{' '}
                  {item.names[loc]}
                </span>
              ))}
            </div>

            <p className="text-[11px] leading-relaxed text-slate-300">
              {item.etymology[locale]}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
