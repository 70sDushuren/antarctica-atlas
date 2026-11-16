'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { ExternalLink, Snowflake } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import type { SeaIceSummaryPayload } from '@/lib/types';
import { formatLocalizedNumber } from '@/lib/units-and-format';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
]);

export interface SeaIceAnomalyCardProps {
  locale: SupportedLocale;
  seaIce: SeaIceSummaryPayload | null;
}

const MONTH_LABELS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];

export function SeaIceAnomalyCard({ locale, seaIce }: SeaIceAnomalyCardProps) {
  const tTel = useTranslations('telemetry');
  const chartElRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<echarts.ECharts | null>(null);

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
    if (!chart || !seaIce?.seasonalCycle) return;

    const medians = seaIce.seasonalCycle.map((p) => p.median1981To2010Mkm2);
    const currents = seaIce.seasonalCycle.map((p) => p.currentYearMkm2);

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(7, 17, 31, 0.94)',
        borderColor: 'rgba(56, 189, 248, 0.35)',
        textStyle: { color: '#e2e8f0', fontSize: 11 }
      },
      legend: {
        top: 0,
        textStyle: { color: '#94a3b8', fontSize: 10 },
        itemWidth: 12,
        itemHeight: 8
      },
      grid: {
        left: 34,
        right: 14,
        top: 28,
        bottom: 20
      },
      xAxis: {
        type: 'category',
        data: MONTH_LABELS,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      yAxis: {
        type: 'value',
        splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.12)' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      series: [
        {
          name: tTel('seaIceMedian'),
          type: 'line',
          smooth: true,
          data: medians,
          itemStyle: { color: '#94a3b8' },
          lineStyle: { width: 1.6, type: 'dashed' }
        },
        {
          name: tTel('seaIceCurrent'),
          type: 'line',
          smooth: true,
          data: currents,
          itemStyle: { color: '#38bdf8' },
          lineStyle: { width: 2.2 },
          areaStyle: {
            color: 'rgba(56, 189, 248, 0.14)'
          }
        }
      ]
    });
  }, [seaIce, tTel]);

  const base = seaIce?.australSpringBaseline;

  return (
    <div className="cryo-card rounded-2xl p-4 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Snowflake className="h-4 w-4 text-sky-400" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-sky-300">
            {tTel('seaIceExtent')}
          </h3>
        </div>
        <a
          href={seaIce?.source ?? 'https://nsidc.org/data/g02135/versions/4'}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
        >
          <span>NSIDC v4 / OSI SAF</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      {base && (
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <div className="rounded-xl bg-slate-950/55 p-2">
            <span className="block font-sans text-[10px] text-slate-400">
              {tTel('seaIceCurrent')}
            </span>
            <span className="text-sm font-semibold text-sky-300">
              {formatLocalizedNumber(base.extentMillionKm2, locale, 2)}{' '}
              <span className="text-[10px]">{tTel('millionKm2')}</span>
            </span>
          </div>
          <div className="rounded-xl bg-slate-950/55 p-2">
            <span className="block font-sans text-[10px] text-slate-400">
              {tTel('seaIceMedian')}
            </span>
            <span className="text-sm font-semibold text-slate-200">
              {formatLocalizedNumber(base.climatologyMedian1981To2010MillionKm2, locale, 2)}{' '}
              <span className="text-[10px]">{tTel('millionKm2')}</span>
            </span>
          </div>
          <div className="rounded-xl bg-slate-950/55 p-2">
            <span className="block font-sans text-[10px] text-slate-400">
              {tTel('seaIceAnomaly')}
            </span>
            <span className="text-sm font-semibold text-rose-400">
              {formatLocalizedNumber(base.anomalyMillionKm2, locale, 2)}{' '}
              <span className="text-[10px]">{tTel('millionKm2')}</span>
            </span>
          </div>
        </div>
      )}

      <div ref={chartElRef} className="h-[165px] w-full" />

      {base && (
        <p className="text-[11px] leading-relaxed text-slate-300">
          {base.regionalNotes[locale]}
        </p>
      )}
    </div>
  );
}
