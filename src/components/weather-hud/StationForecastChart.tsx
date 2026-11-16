'use client';

import { useEffect, useRef } from 'react';
import * as echarts from 'echarts/core';
import { BarChart, LineChart } from 'echarts/charts';
import {
  GridComponent,
  LegendComponent,
  TooltipComponent
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useTranslations } from 'next-intl';
import type { DailyStationForecast, UnitSystem } from '@/lib/types';
import { celsiusToFahrenheit, kmhToKnots } from '@/lib/units-and-format';

echarts.use([
  LineChart,
  BarChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer
]);

export interface StationForecastChartProps {
  forecast: DailyStationForecast[];
  units: UnitSystem;
}

export function StationForecastChart({ forecast, units }: StationForecastChartProps) {
  const tTel = useTranslations('telemetry');
  const chartElRef = useRef<HTMLDivElement | null>(null);
  const instanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    const el = chartElRef.current;
    if (!el) return;
    const chart = echarts.init(el);
    instanceRef.current = chart;

    const ro = new ResizeObserver(() => {
      chart.resize();
    });
    ro.observe(el);

    return () => {
      ro.disconnect();
      chart.dispose();
      instanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = instanceRef.current;
    if (!chart || forecast.length === 0) return;

    const tempUnit = units === 'imperial' ? '°F' : '°C';
    const windUnit = units === 'metric' ? 'km/h' : 'kt';

    const convertTemp = (c: number) =>
      Math.round((units === 'imperial' ? celsiusToFahrenheit(c) : c) * 10) / 10;
    const convertWind = (kmh: number) =>
      Math.round((units === 'metric' ? kmh : kmhToKnots(kmh)) * 10) / 10;

    const labels = forecast.map((d) => d.date.slice(5));
    const highs = forecast.map((d) => convertTemp(d.tempMaxC));
    const lows = forecast.map((d) => convertTemp(d.tempMinC));
    const chills = forecast.map((d) => convertTemp(d.windChillMinC));
    const gusts = forecast.map((d) => convertWind(d.gustMaxKmh));

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
        left: 38,
        right: 40,
        top: 30,
        bottom: 22
      },
      xAxis: {
        type: 'category',
        data: labels,
        axisLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.3)' } },
        axisLabel: { color: '#94a3b8', fontSize: 10 }
      },
      yAxis: [
        {
          type: 'value',
          name: tempUnit,
          nameTextStyle: { color: '#7dd3fc', fontSize: 10 },
          splitLine: { lineStyle: { color: 'rgba(148, 163, 184, 0.12)' } },
          axisLabel: { color: '#94a3b8', fontSize: 10 }
        },
        {
          type: 'value',
          name: windUnit,
          nameTextStyle: { color: '#fcd34d', fontSize: 10 },
          splitLine: { show: false },
          axisLabel: { color: '#fcd34d', fontSize: 10 }
        }
      ],
      series: [
        {
          name: tTel('tempMax'),
          type: 'line',
          smooth: true,
          data: highs,
          itemStyle: { color: '#38bdf8' },
          lineStyle: { width: 2 }
        },
        {
          name: tTel('tempMin'),
          type: 'line',
          smooth: true,
          data: lows,
          itemStyle: { color: '#818cf8' },
          lineStyle: { width: 1.8 }
        },
        {
          name: tTel('windChill'),
          type: 'line',
          smooth: true,
          data: chills,
          itemStyle: { color: '#f43f5e' },
          lineStyle: { width: 1.5, type: 'dashed' }
        },
        {
          name: tTel('katabaticGust'),
          type: 'bar',
          yAxisIndex: 1,
          barMaxWidth: 14,
          data: gusts,
          itemStyle: {
            color: 'rgba(245, 158, 11, 0.38)',
            borderColor: '#f59e0b',
            borderRadius: [3, 3, 0, 0]
          }
        }
      ]
    });
  }, [forecast, units, tTel]);

  return <div ref={chartElRef} className="h-[195px] w-full" />;
}
