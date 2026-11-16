'use client';

import { Suspense, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import {
  DEFAULT_ATLAS_URL_STATE,
  useAtlasUrlState
} from '@/lib/atlas-url-state';
import { computePolarSolarState, wgs84ToEpsg3031 } from '@/lib/polar-math';
import { polarRepository } from '@/lib/polar-repository';
import type {
  MarineCorridorTelemetry,
  StationWeatherTelemetry,
  ThemeMode,
  UnitSystem
} from '@/lib/types';
import {
  formatPolarLength,
  formatPolarTemperature,
  formatPolarWindSpeed
} from '@/lib/units-and-format';
import { LanguageSwitcher } from './LanguageSwitcher';

const UNIT_CYCLE: UnitSystem[] = ['nautical', 'metric', 'imperial'];

function AtlasShellContent({ locale }: { locale: SupportedLocale }) {
  const tBrand = useTranslations('brand');
  const tNav = useTranslations('nav');
  const tTel = useTranslations('telemetry');
  const tGeo = useTranslations('geology');
  const tCor = useTranslations('corridor');
  const tFoot = useTranslations('footer');

  const { atlasState, updateAtlasState } = useAtlasUrlState();
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [weatherList, setWeatherList] = useState<StationWeatherTelemetry[]>([]);
  const [marineList, setMarineList] = useState<MarineCorridorTelemetry[]>([]);

  useEffect(() => {
    const controller = new AbortController();
    polarRepository
      .fetchStationWeather(controller.signal)
      .then(setWeatherList)
      .catch(() => {});
    polarRepository
      .fetchMarineTelemetry(controller.signal)
      .then(setMarineList)
      .catch(() => {});
    return () => controller.abort();
  }, []);

  const corridors = polarRepository.getExpeditionCorridors();
  const stations = polarRepository.getStations();
  const monuments = polarRepository.getHistoricMonuments();
  const scientificSources = polarRepository.getScientificSources();

  const activeCorridor =
    corridors.find((c) => c.id === atlasState.corridor) ??
    polarRepository.getDefaultCorridor();
  const activeStation =
    polarRepository.getStationById(atlasState.station) ?? stations[0];

  const liveStationWeather = weatherList.find(
    (w) => w.stationId === activeStation.id
  );
  const drakeSample =
    marineList.find((m) => m.pointId === 'drake-convergence') ?? marineList[0];

  const projectedXY = wgs84ToEpsg3031(activeStation.lat, activeStation.lon);
  const solar = computePolarSolarState(activeStation.lat);

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

      {/* Main Spatial Canvas Stage & Telemetry Grid */}
      <main className="grid grid-cols-1 lg:grid-cols-12 gap-5 flex-1">
        {/* Left Column: Default Pinned Expedition Corridor & Subglacial Ice-Peel Controls */}
        <section className="lg:col-span-4 flex flex-col gap-4">
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
                onChange={(e) => updateAtlasState({ corridor: e.target.value })}
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

            {drakeSample && (
              <div className="rounded-xl border border-amber-400/25 bg-amber-500/10 p-2.5 text-xs flex flex-wrap items-center justify-between gap-2">
                <span className="font-medium text-amber-200">
                  {tTel('drakeIndex')}: {drakeSample.drakeTierCode}
                </span>
                <span className="font-mono text-amber-300">
                  Hs {formatPolarLength(drakeSample.waveHeightM, atlasState.units, locale)} ·{' '}
                  {drakeSample.wavePeriodS.toFixed(1)}s
                </span>
              </div>
            )}

            <ol className="space-y-2 border-t border-slate-700/60 pt-3">
              {activeCorridor.waypoints.map((wp, idx) => (
                <li
                  key={wp.id}
                  className="rounded-xl border border-slate-700/50 bg-slate-900/45 p-2.5 text-xs"
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
                </li>
              ))}
            </ol>

            <p className="text-[11px] text-slate-400">{tCor('safetyNotice')}</p>
          </div>

          {/* Bedmap3 Ice-Peel Slider Control */}
          <div className="cryo-card rounded-2xl p-4 space-y-2.5">
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
            <p className="text-xs text-slate-300">{tGeo('icePeelHint')}</p>
          </div>
        </section>

        {/* Center/Right Column: Dual-Mode Spatial Stage & Station/Heritage Inspector */}
        <section className="lg:col-span-8 flex flex-col gap-4">
          <div className="cryo-card rounded-2xl p-5 flex-1 flex flex-col justify-between min-h-[360px]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sky-400/20 pb-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-400" />
                <span className="text-xs font-medium text-emerald-300">
                  {tTel('liveStatus')}
                </span>
              </div>
              <span className="font-mono text-xs text-sky-300">
                Active Engine:{' '}
                {atlasState.mode === '3d'
                  ? '3D Polar Globe (WGS84 / ECEF)'
                  : '2D Native EPSG:3031 (71°S Standard Parallel)'}
              </span>
            </div>

            {/* Station Selector & Synced EPSG:3031 + Live Telemetry Readout */}
            <div className="my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-xl border border-sky-400/20 bg-slate-950/45 p-4 space-y-3">
                <label className="block text-xs font-semibold uppercase tracking-wider text-sky-400">
                  {tNav('stations')}
                  <select
                    value={activeStation.id}
                    onChange={(e) => {
                      const nextStation = polarRepository.getStationById(e.target.value);
                      updateAtlasState({
                        station: e.target.value,
                        centerLat: nextStation?.lat ?? atlasState.centerLat,
                        centerLon: nextStation?.lon ?? atlasState.centerLon
                      });
                    }}
                    className="mt-1.5 w-full rounded-xl border border-sky-400/30 bg-slate-900 px-3 py-2 text-sm text-white"
                  >
                    {stations.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name[locale]} ({st.countryName[locale]})
                      </option>
                    ))}
                  </select>
                </label>

                <p className="text-xs leading-relaxed text-slate-300">
                  {activeStation.summary[locale]}
                </p>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-lg bg-slate-900/70 p-2">
                    <span className="block text-[10px] text-slate-400">WGS84</span>
                    <span>
                      {activeStation.lat.toFixed(3)}°, {activeStation.lon.toFixed(3)}°
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-900/70 p-2">
                    <span className="block text-[10px] text-slate-400">EPSG:3031 (m)</span>
                    <span>
                      X {(projectedXY.x / 1000).toFixed(0)}km · Y {(projectedXY.y / 1000).toFixed(0)}km
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-900/70 p-2">
                    <span className="block text-[10px] text-slate-400">{tGeo('surfaceElev')}</span>
                    <span>
                      {formatPolarLength(activeStation.elevationM, atlasState.units, locale, 0)}
                    </span>
                  </div>
                  <div className="rounded-lg bg-slate-900/70 p-2">
                    <span className="block text-[10px] text-slate-400">{tTel('solarRegime')}</span>
                    <span>
                      {solar.regime === 'polar-day'
                        ? tTel('polarDay')
                        : solar.regime === 'polar-night'
                          ? tTel('polarNight')
                          : tTel('daylightHours', { hours: solar.daylightHours })}
                    </span>
                  </div>
                  {liveStationWeather && (
                    <>
                      <div className="rounded-lg bg-slate-900/70 p-2">
                        <span className="block text-[10px] text-slate-400">
                          {tTel('airTemp')} / {tTel('windChill')}
                        </span>
                        <span className="text-sky-300">
                          {formatPolarTemperature(
                            liveStationWeather.temperature2mC,
                            atlasState.units,
                            locale
                          )}{' '}
                          /{' '}
                          {formatPolarTemperature(
                            liveStationWeather.windChillC,
                            atlasState.units,
                            locale
                          )}
                        </span>
                      </div>
                      <div className="rounded-lg bg-slate-900/70 p-2">
                        <span className="block text-[10px] text-slate-400">
                          {tTel('katabaticGust')}
                        </span>
                        <span
                          className={
                            liveStationWeather.katabaticTier === 'severe'
                              ? 'text-rose-400'
                              : liveStationWeather.katabaticTier === 'watch'
                                ? 'text-amber-300'
                                : 'text-emerald-300'
                          }
                        >
                          {formatPolarWindSpeed(
                            liveStationWeather.windGusts10mKmh,
                            atlasState.units,
                            locale
                          )}
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Featured Protected Historic Sites & Monuments (HSM) */}
              <div className="rounded-xl border border-sky-400/20 bg-slate-950/45 p-4 space-y-2.5">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                  {tNav('heritage')} · ATCM HSM
                </h3>
                <div className="space-y-2.5">
                  {monuments.map((hsm) => (
                    <div
                      key={hsm.id}
                      className="rounded-lg border border-slate-700/60 bg-slate-900/55 p-2.5 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-1 font-semibold text-amber-200">
                        <span>{hsm.title[locale]}</span>
                        <a
                          href={hsm.sourceUrl}
                          target="_blank"
                          rel="noreferrer"
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
            </div>

            <div className="rounded-xl border border-emerald-400/25 bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-200">
              {tFoot('scaffoldReady')}
            </div>
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
