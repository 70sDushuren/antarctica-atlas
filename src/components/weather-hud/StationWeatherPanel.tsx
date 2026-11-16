'use client';

import { useMemo, useState } from 'react';
import { ExternalLink, Search, Wind } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import { computePolarSolarState, wgs84ToEpsg3031 } from '@/lib/polar-math';
import type {
  PolarStation,
  StationWeatherTelemetry,
  UnitSystem
} from '@/lib/types';
import {
  formatPolarLength,
  formatPolarTemperature,
  formatPolarWindSpeed
} from '@/lib/units-and-format';
import { StationForecastChart } from './StationForecastChart';

export interface StationWeatherPanelProps {
  locale: SupportedLocale;
  units: UnitSystem;
  stations: PolarStation[];
  selectedStationId: string;
  weatherList: StationWeatherTelemetry[];
  onSelectStation: (station: PolarStation) => void;
}

export function StationWeatherPanel({
  locale,
  units,
  stations,
  selectedStationId,
  weatherList,
  onSelectStation
}: StationWeatherPanelProps) {
  const tNav = useTranslations('nav');
  const tTel = useTranslations('telemetry');
  const tGeo = useTranslations('geology');

  const [query, setQuery] = useState('');

  const filteredStations = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return stations;
    return stations.filter(
      (s) =>
        s.name[locale].toLowerCase().includes(q) ||
        s.name.en.toLowerCase().includes(q) ||
        s.countryName[locale].toLowerCase().includes(q) ||
        s.code.toLowerCase().includes(q)
    );
  }, [stations, query, locale]);

  const activeStation =
    stations.find((s) => s.id === selectedStationId) ?? stations[0];
  const liveWeather = weatherList.find((w) => w.stationId === activeStation.id);

  const projectedXY = wgs84ToEpsg3031(activeStation.lat, activeStation.lon);
  const solar = computePolarSolarState(activeStation.lat);

  const katabaticLabel =
    liveWeather?.katabaticTier === 'severe'
      ? tTel('katabaticSevere')
      : liveWeather?.katabaticTier === 'watch'
        ? tTel('katabaticWatch')
        : tTel('katabaticNominal');

  return (
    <div className="cryo-card rounded-2xl p-4 space-y-3.5">
      {/* Header & Feed Source Status */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Wind className="h-4 w-4 text-sky-400" />
          <h2 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            {tNav('stations')} · {stations.length} COMNAP Nodes
          </h2>
        </div>

        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            liveWeather && !liveWeather.isFallback
              ? 'border border-emerald-400/35 bg-emerald-500/10 text-emerald-300'
              : 'border border-sky-400/30 bg-sky-500/10 text-sky-300'
          }`}
        >
          {liveWeather && !liveWeather.isFallback
            ? tTel('liveApiBadge')
            : tTel('fallbackBadge')}
        </span>
      </div>

      {/* Filter Input & Station Dropdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="relative">
          <Search className="pointer-events-none absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={tTel('filterStations')}
            className="w-full rounded-xl border border-sky-400/25 bg-slate-950/60 py-1.5 pl-8 pr-3 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-sky-400"
          />
        </div>

        <select
          value={activeStation.id}
          onChange={(e) => {
            const st = stations.find((item) => item.id === e.target.value);
            if (st) onSelectStation(st);
          }}
          className="w-full rounded-xl border border-sky-400/30 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
        >
          {(filteredStations.length > 0 ? filteredStations : stations).map((st) => (
            <option key={st.id} value={st.id}>
              {st.name[locale]} ({st.countryName[locale]} · {st.code})
            </option>
          ))}
        </select>
      </div>

      {/* Station Summary & Source Link */}
      <div className="rounded-xl border border-slate-700/50 bg-slate-950/45 p-3 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold text-white">
            {activeStation.name[locale]}{' '}
            <span className="font-mono text-xs text-sky-300">
              [{activeStation.code} · {activeStation.establishedYear}]
            </span>
          </div>
          <a
            href={activeStation.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:text-sky-200 underline"
          >
            <span>COMNAP / AMRDC</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
        <p className="text-xs leading-relaxed text-slate-300">
          {activeStation.summary[locale]}
        </p>
      </div>

      {/* Telemetry Readout Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono">
        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tTel('airTemp')}
          </span>
          <span className="text-sm font-semibold text-sky-300">
            {liveWeather
              ? formatPolarTemperature(liveWeather.temperature2mC, units, locale)
              : '—'}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tTel('windChill')}
          </span>
          <span className="text-sm font-semibold text-rose-300">
            {liveWeather
              ? formatPolarTemperature(liveWeather.windChillC, units, locale)
              : '—'}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tTel('katabaticGust')}
          </span>
          <span
            className={`text-sm font-semibold ${
              liveWeather?.katabaticTier === 'severe'
                ? 'text-rose-400'
                : liveWeather?.katabaticTier === 'watch'
                  ? 'text-amber-300'
                  : 'text-emerald-300'
            }`}
          >
            {liveWeather
              ? formatPolarWindSpeed(liveWeather.windGusts10mKmh, units, locale)
              : '—'}
          </span>
          <span className="block font-sans text-[10px] text-slate-400 truncate">
            {katabaticLabel}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tTel('pressure')} / {tGeo('surfaceElev')}
          </span>
          <span className="text-slate-200">
            {liveWeather ? `${liveWeather.surfacePressureHpa.toFixed(1)} hPa` : '—'} ·{' '}
            {formatPolarLength(activeStation.elevationM, units, locale, 0)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            EPSG:3031 (X, Y)
          </span>
          <span className="text-slate-200">
            {Math.round(projectedXY.x / 1000)}km, {Math.round(projectedXY.y / 1000)}km
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tTel('solarRegime')}
          </span>
          <span className="font-sans text-[11px] text-amber-200">
            {solar.regime === 'polar-day'
              ? tTel('polarDay')
              : solar.regime === 'polar-night'
                ? tTel('polarNight')
                : tTel('daylightHours', { hours: solar.daylightHours })}
          </span>
        </div>
      </div>

      {/* 7-Day Forecast Dual-Axis ECharts */}
      {liveWeather && liveWeather.dailyForecast.length > 0 && (
        <div className="rounded-xl border border-sky-400/15 bg-slate-950/45 p-3 space-y-1.5">
          <div className="flex flex-wrap items-center justify-between gap-1">
            <span className="text-xs font-semibold text-sky-200">
              {tTel('forecast7dTitle')}
            </span>
            <a
              href="https://open-meteo.com/en/docs/ecmwf-api"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-sky-400 hover:underline"
            >
              ECMWF IFS 9km
            </a>
          </div>
          <StationForecastChart forecast={liveWeather.dailyForecast} units={units} />
        </div>
      )}
    </div>
  );
}
