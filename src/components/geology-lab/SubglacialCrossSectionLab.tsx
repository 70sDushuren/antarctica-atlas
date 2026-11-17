'use client';

import { useEffect, useMemo, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { Crosshair, ExternalLink, Mountain } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import { sampleSubglacialTransect } from '@/lib/polar-math';
import type {
  SubglacialBedmapGrid,
  SubglacialTransectPreset,
  UnitSystem
} from '@/lib/types';
import {
  formatLocalizedNumber,
  formatPolarLength,
  metersToFeet
} from '@/lib/units-and-format';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
]);

export type TransectDrawStep = 'idle' | 'pick-a' | 'pick-b';

export interface SubglacialCrossSectionLabProps {
  locale: SupportedLocale;
  units: UnitSystem;
  bedmapGrid: SubglacialBedmapGrid | null;
  presets: SubglacialTransectPreset[];
  selectedPresetId: string;
  transectEndpoints: {
    pointA: { lat: number; lon: number };
    pointB: { lat: number; lon: number };
  };
  isCustomTransect: boolean;
  drawStep: TransectDrawStep;
  onSelectPreset: (preset: SubglacialTransectPreset) => void;
  onToggleDrawMode: () => void;
}

export function SubglacialCrossSectionLab({
  locale,
  units,
  bedmapGrid,
  presets,
  selectedPresetId,
  transectEndpoints,
  isCustomTransect,
  drawStep,
  onSelectPreset,
  onToggleDrawMode
}: SubglacialCrossSectionLabProps) {
  const tGeo = useTranslations('geology');
  const chartElRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

  const activePreset =
    presets.find((p) => p.id === selectedPresetId) ?? presets[0];

  const samples = useMemo(() => {
    if (!bedmapGrid) return [];
    return sampleSubglacialTransect(
      bedmapGrid,
      transectEndpoints.pointA,
      transectEndpoints.pointB,
      180
    );
  }, [bedmapGrid, transectEndpoints]);

  const metrics = useMemo(() => {
    if (samples.length === 0) {
      return {
        totalDistanceKm: 0,
        maxThicknessM: 0,
        minBedM: 0,
        marineSharePct: 0
      };
    }
    let maxThicknessM = 0;
    let minBedM = Infinity;
    let marineCount = 0;

    for (const s of samples) {
      if (s.iceThicknessM > maxThicknessM) maxThicknessM = s.iceThicknessM;
      if (s.bedElevationM < minBedM) minBedM = s.bedElevationM;
      if (s.isMarineBasedIceSheet) marineCount += 1;
    }

    return {
      totalDistanceKm: samples[samples.length - 1].distanceKm,
      maxThicknessM,
      minBedM: Number.isFinite(minBedM) ? minBedM : 0,
      marineSharePct: Math.round((marineCount / samples.length) * 100)
    };
  }, [samples]);

  useEffect(() => {
    const el = chartElRef.current;
    if (!el) return;
    const chart = echarts.init(el);
    chartRef.current = chart;

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.dispose();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    if (!chart || samples.length === 0) return;

    const elevUnit = units === 'imperial' ? 'ft' : 'm';
    const conv = (m: number) =>
      Math.round(units === 'imperial' ? metersToFeet(m) : m);

    const xLabels = samples.map((s) => `${Math.round(s.distanceKm)} km`);
    const surfSeries = samples.map((s) => conv(s.surfaceElevationM));
    const bedSeries = samples.map((s) => conv(s.bedElevationM));
    const seaLevelSeries = samples.map(() => 0);

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(7, 17, 31, 0.95)',
        borderColor: 'rgba(232, 121, 249, 0.45)',
        textStyle: { color: '#e2e8f0', fontSize: 11 },
        formatter: (params: unknown) => {
          const list = Array.isArray(params)
            ? (params as Array<{ dataIndex?: number }>)
            : [];
          const idx = list[0]?.dataIndex ?? 0;
          const pt = samples[idx];
          if (!pt) return '';
          const marineTag = pt.isMarineBasedIceSheet
            ? `<div style="color:#fda4af;margin-top:3px;">⚠ ${tGeo('marineBedWarning')}</div>`
            : '';
          return `
            <div style="font-family:monospace;font-size:11px;">
              <div style="color:#f0abfc;font-weight:600;">${pt.distanceKm} km (${pt.lat.toFixed(2)}°, ${pt.lon.toFixed(2)}°)</div>
              <div>${tGeo('surfaceElev')}: <b>${conv(pt.surfaceElevationM)} ${elevUnit}</b></div>
              <div>${tGeo('iceThickness')}: <b>${conv(pt.iceThicknessM)} ${elevUnit}</b></div>
              <div>${tGeo('bedElev')}: <b>${conv(pt.bedElevationM)} ${elevUnit}</b></div>
              ${marineTag}
            </div>
          `;
        }
      },
      legend: {
        top: 0,
        textStyle: { color: '#94a3b8', fontSize: 10 },
        itemWidth: 12,
        itemHeight: 8
      },
      grid: {
        left: 48,
        right: 18,
        top: 30,
        bottom: 24
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#94a3b8', fontSize: 10, interval: 29 }
      },
      yAxis: {
        type: 'value',
        name: elevUnit,
        nameTextStyle: { color: '#7dd3fc', fontSize: 10 },
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.12)' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      series: [
        {
          name: tGeo('surfaceElev'),
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: surfSeries,
          itemStyle: { color: '#38bdf8' },
          lineStyle: { width: 2.2 },
          areaStyle: {
            color: 'rgba(56, 189, 248, 0.25)'
          }
        },
        {
          name: tGeo('bedElev'),
          type: 'line',
          smooth: true,
          showSymbol: false,
          data: bedSeries,
          itemStyle: { color: '#f59e0b' },
          lineStyle: { width: 2 },
          areaStyle: {
            color: 'rgba(120, 53, 15, 0.36)'
          }
        },
        {
          name: tGeo('seaLevelDatum'),
          type: 'line',
          showSymbol: false,
          data: seaLevelSeries,
          itemStyle: { color: '#f43f5e' },
          lineStyle: { width: 1.2, type: 'dashed' }
        }
      ]
    });
  }, [samples, units, tGeo]);

  const drawButtonLabel =
    drawStep === 'pick-a'
      ? tGeo('drawModePickA')
      : drawStep === 'pick-b'
        ? tGeo('drawModePickB')
        : tGeo('drawModeOff');

  return (
    <div className="cryo-card rounded-2xl p-4 space-y-3.5">
      {/* Header & BAS Bedmap3 Citation */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Mountain className="h-4 w-4 text-fuchsia-400 shrink-0" />
            <h2 className="text-sm font-semibold text-fuchsia-200">
              {tGeo('profilerTitle')}
            </h2>
          </div>
          <p className="mt-0.5 text-xs text-slate-300">{tGeo('profilerSubtitle')}</p>
        </div>

        <a
          href="https://www.bas.ac.uk/project/bedmap3/"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
        >
          <span>BAS Bedmap3 Grid</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {/* Preset Selector + Interactive Map Click-to-Draw Trigger */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-end">
        <label className="md:col-span-8 block text-xs text-slate-400">
          {tGeo('presetLabel')}
          <select
            value={isCustomTransect ? '__custom__' : activePreset.id}
            onChange={(e) => {
              const found = presets.find((p) => p.id === e.target.value);
              if (found) onSelectPreset(found);
            }}
            className="mt-1 w-full rounded-xl border border-fuchsia-400/35 bg-slate-900 px-3 py-1.5 text-xs text-white focus:outline-none focus:ring-1 focus:ring-fuchsia-400"
          >
            {isCustomTransect && (
              <option value="__custom__">
                A ({transectEndpoints.pointA.lat.toFixed(1)}°,{' '}
                {transectEndpoints.pointA.lon.toFixed(1)}°) → B (
                {transectEndpoints.pointB.lat.toFixed(1)}°,{' '}
                {transectEndpoints.pointB.lon.toFixed(1)}°)
              </option>
            )}
            {presets.map((preset) => (
              <option key={preset.id} value={preset.id}>
                {preset.name[locale]}
              </option>
            ))}
          </select>
        </label>

        <button
          type="button"
          onClick={onToggleDrawMode}
          className={`md:col-span-4 inline-flex items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
            drawStep !== 'idle'
              ? 'border-fuchsia-300 bg-fuchsia-500 text-slate-950 shadow-md'
              : 'border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200 hover:bg-fuchsia-500/25'
          }`}
        >
          <Crosshair className="h-3.5 w-3.5 shrink-0" />
          <span className="truncate">{drawButtonLabel}</span>
        </button>
      </div>

      {!isCustomTransect && (
        <p className="text-xs leading-relaxed text-slate-300">
          {activePreset.summary[locale]}
        </p>
      )}

      {/* 4 Key Subglacial Profile Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tGeo('transectLength')}
          </span>
          <span className="text-sm font-semibold text-fuchsia-300">
            {formatLocalizedNumber(metrics.totalDistanceKm, locale, 0)} km
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tGeo('maxIceThickness')}
          </span>
          <span className="text-sm font-semibold text-sky-300">
            {formatPolarLength(metrics.maxThicknessM, units, locale, 0)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tGeo('minBedrockDepth')}
          </span>
          <span className="text-sm font-semibold text-amber-300">
            {formatPolarLength(metrics.minBedM, units, locale, 0)}
          </span>
        </div>

        <div className="rounded-xl bg-slate-950/55 p-2.5">
          <span className="block font-sans text-[10px] text-slate-400">
            {tGeo('marineGroundedShare')}
          </span>
          <span
            className={`text-sm font-semibold ${
              metrics.marineSharePct >= 25 ? 'text-rose-400' : 'text-emerald-300'
            }`}
          >
            {metrics.marineSharePct}%
          </span>
        </div>
      </div>

      {/* Dual-Layer Ice Surface vs Subglacial Bedrock ECharts */}
      <div className="rounded-xl border border-fuchsia-400/20 bg-slate-950/50 p-2.5">
        <div ref={chartElRef} className="h-[225px] w-full" />
      </div>
    </div>
  );
}
