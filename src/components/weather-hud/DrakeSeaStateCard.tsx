'use client';

import { useState } from 'react';
import { ExternalLink, Waves } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import type { MarineCorridorTelemetry, UnitSystem } from '@/lib/types';
import { formatPolarLength, formatPolarTemperature } from '@/lib/units-and-format';

export interface DrakeSeaStateCardProps {
  locale: SupportedLocale;
  units: UnitSystem;
  marineList: MarineCorridorTelemetry[];
  onFocusBuoy?: (lat: number, lon: number) => void;
}

const TIER_COLORS: Record<1 | 2 | 3 | 4 | 5, string> = {
  1: 'bg-emerald-400 text-slate-950',
  2: 'bg-sky-400 text-slate-950',
  3: 'bg-amber-400 text-slate-950',
  4: 'bg-orange-500 text-white',
  5: 'bg-rose-500 text-white'
};

export function DrakeSeaStateCard({
  locale,
  units,
  marineList,
  onFocusBuoy
}: DrakeSeaStateCardProps) {
  const tTel = useTranslations('telemetry');
  const [selectedBuoyId, setSelectedBuoyId] = useState<string>('drake-convergence');

  const activeBuoy =
    marineList.find((m) => m.pointId === selectedBuoyId) ?? marineList[0];

  const tierLabels: Record<1 | 2 | 3 | 4 | 5, string> = {
    1: tTel('drakeTier1'),
    2: tTel('drakeTier2'),
    3: tTel('drakeTier3'),
    4: tTel('drakeTier4'),
    5: tTel('drakeTier5')
  };

  return (
    <div className="cryo-card rounded-2xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Waves className="h-4 w-4 text-sky-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            {tTel('drakeIndex')}
          </h3>
        </div>
        <a
          href="https://open-meteo.com/en/docs/marine-weather-api"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
        >
          <span>Open-Meteo Marine</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Buoy Selector */}
      {marineList.length > 0 && activeBuoy && (
        <>
          <select
            value={activeBuoy.pointId}
            onChange={(e) => {
              setSelectedBuoyId(e.target.value);
              const target = marineList.find((m) => m.pointId === e.target.value);
              if (target && onFocusBuoy) {
                onFocusBuoy(target.lat, target.lon);
              }
            }}
            className="w-full rounded-xl border border-sky-400/30 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-sky-400"
          >
            {marineList.map((pt) => (
              <option key={pt.pointId} value={pt.pointId}>
                {pt.label[locale]} ({pt.lat.toFixed(1)}°, {pt.lon.toFixed(1)}°)
              </option>
            ))}
          </select>

          {/* 5-Tier Visual Scale Bar */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-5 gap-1">
              {([1, 2, 3, 4, 5] as const).map((tier) => {
                const isActive = activeBuoy.drakeTier === tier;
                return (
                  <div
                    key={tier}
                    className={`h-2 rounded-full transition-all ${
                      isActive
                        ? `${TIER_COLORS[tier]} ring-2 ring-white/70 scale-y-125`
                        : 'bg-slate-800'
                    }`}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap items-center justify-between gap-1 text-xs">
              <span
                className={`rounded-md px-2 py-0.5 text-[11px] font-semibold ${
                  TIER_COLORS[activeBuoy.drakeTier]
                }`}
              >
                {tierLabels[activeBuoy.drakeTier]}
              </span>
              <span className="font-mono text-xs text-slate-300">
                {activeBuoy.waveDirectionDeg}° Swell
              </span>
            </div>
          </div>

          {/* Wave & SST Metrics */}
          <div className="grid grid-cols-3 gap-2 text-xs font-mono">
            <div className="rounded-xl bg-slate-950/55 p-2">
              <span className="block font-sans text-[10px] text-slate-400">
                {tTel('waveHeight')}
              </span>
              <span className="text-sm font-semibold text-amber-300">
                {formatPolarLength(activeBuoy.waveHeightM, units, locale, 1)}
              </span>
            </div>
            <div className="rounded-xl bg-slate-950/55 p-2">
              <span className="block font-sans text-[10px] text-slate-400">
                {tTel('wavePeriod')}
              </span>
              <span className="text-sm font-semibold text-sky-300">
                {activeBuoy.wavePeriodS.toFixed(1)} s
              </span>
            </div>
            <div className="rounded-xl bg-slate-950/55 p-2">
              <span className="block font-sans text-[10px] text-slate-400">
                {tTel('sst')}
              </span>
              <span className="text-sm font-semibold text-emerald-300">
                {formatPolarTemperature(activeBuoy.seaSurfaceTempC, units, locale)}
              </span>
            </div>
          </div>

          {/* 7-Day Daily Max Wave Sparkbars */}
          {activeBuoy.dailyWaveMaxM.length > 0 && (
            <div className="rounded-xl border border-slate-800 bg-slate-950/45 p-2.5">
              <div className="flex items-end justify-between gap-1.5 h-12">
                {activeBuoy.dailyWaveMaxM.map((wM, idx) => {
                  const pct = Math.min(100, Math.max(16, (wM / 8.5) * 100));
                  const barColor =
                    wM >= 5.5
                      ? 'bg-orange-400'
                      : wM >= 3.5
                        ? 'bg-amber-400'
                        : 'bg-sky-400';
                  return (
                    <div
                      key={idx}
                      className="flex-1 flex flex-col items-center justify-end h-full gap-1"
                    >
                      <div
                        style={{ height: `${pct}%` }}
                        className={`w-full rounded-t ${barColor}`}
                        title={`D+${idx}: ${wM.toFixed(1)} m`}
                      />
                      <span className="font-mono text-[9px] text-slate-400">
                        D+{idx}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
