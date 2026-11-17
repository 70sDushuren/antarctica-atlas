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
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import type { HikingProfileSample, UnitSystem } from '@/lib/types';
import {
  celsiusToFahrenheit,
  metersToFeet
} from '@/lib/units-and-format';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
]);

const TIER_COLORS: Record<number, string> = {
  1: '#10b981',
  2: '#38bdf8',
  3: '#f59e0b',
  4: '#f97316',
  5: '#f43f5e'
};

export interface HikingProfileChartProps {
  locale: SupportedLocale;
  units: UnitSystem;
  samples: HikingProfileSample[];
  onHoverCoordinate?: (lat: number, lon: number) => void;
}

export function HikingProfileChart({
  units,
  samples,
  onHoverCoordinate
}: HikingProfileChartProps) {
  const tAdv = useTranslations('advisor');
  const tTel = useTranslations('telemetry');
  const chartElRef = useRef<HTMLDivElement | null>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const el = chartElRef.current;
    if (!el || samples.length === 0) return;

    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(el);
    }
    const chart = chartInstanceRef.current;

    const elevUnit = units === 'imperial' ? 'ft' : 'm';
    const tempUnit = units === 'imperial' ? '°F' : '°C';

    const xLabels = samples.map((s, idx) => `#${idx + 1} (${s.distanceKm}km)`);
    const elevData = samples.map((s) => ({
      value:
        units === 'imperial'
          ? Math.round(metersToFeet(s.elevationM))
          : Math.round(s.elevationM),
      itemStyle: { color: TIER_COLORS[s.difficultyTier] || '#38bdf8' }
    }));
    const wcData = samples.map((s) =>
      units === 'imperial'
        ? Math.round(celsiusToFahrenheit(s.windChillC) * 10) / 10
        : s.windChillC
    );

    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(7, 17, 31, 0.94)',
        borderColor: 'rgba(56, 189, 248, 0.4)',
        textStyle: { color: '#e2e8f0', fontSize: 11 }
      },
      legend: {
        top: 0,
        textStyle: { color: '#cbd5e1', fontSize: 11 }
      },
      grid: {
        left: 48,
        right: 48,
        top: 28,
        bottom: 24
      },
      xAxis: {
        type: 'category',
        data: xLabels,
        axisLabel: { color: '#94a3b8', fontSize: 10 },
        axisLine: { lineStyle: { color: '#334155' } }
      },
      yAxis: [
        {
          type: 'value',
          name: `${tAdv('elevLabel')} (${elevUnit})`,
          nameTextStyle: { color: '#38bdf8', fontSize: 10 },
          axisLabel: { color: '#94a3b8', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(51, 65, 85, 0.45)' } }
        },
        {
          type: 'value',
          name: `${tTel('windChill')} (${tempUnit})`,
          nameTextStyle: { color: '#f59e0b', fontSize: 10 },
          axisLabel: { color: '#fbbf24', fontSize: 10 },
          splitLine: { show: false }
        }
      ],
      series: [
        {
          name: `${tAdv('elevLabel')} (${elevUnit})`,
          type: 'line',
          yAxisIndex: 0,
          smooth: true,
          symbolSize: 8,
          areaStyle: { color: 'rgba(56, 189, 248, 0.16)' },
          lineStyle: { color: '#38bdf8', width: 2.5 },
          data: elevData
        },
        {
          name: `${tTel('windChill')} (${tempUnit})`,
          type: 'line',
          yAxisIndex: 1,
          smooth: true,
          symbolSize: 6,
          lineStyle: { color: '#f59e0b', width: 2, type: 'dashed' },
          itemStyle: { color: '#f59e0b' },
          data: wcData
        }
      ]
    });

    const handleAxisPointer = (ev: unknown) => {
      const axesInfo = (ev as { axesInfo?: Array<{ value?: number }> })?.axesInfo;
      const idx = axesInfo?.[0]?.value;
      if (typeof idx === 'number' && samples[idx] && onHoverCoordinate) {
        onHoverCoordinate(samples[idx].lat, samples[idx].lon);
      }
    };
    chart.on('updateAxisPointer', handleAxisPointer);

    const ro = new ResizeObserver(() => chart.resize());
    ro.observe(el);

    return () => {
      chart.off('updateAxisPointer', handleAxisPointer);
      ro.disconnect();
    };
  }, [samples, units, tAdv, tTel, onHoverCoordinate]);

  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return <div ref={chartElRef} className="h-[195px] w-full" />;
}
