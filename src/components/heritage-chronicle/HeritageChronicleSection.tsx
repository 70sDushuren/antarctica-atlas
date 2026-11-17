'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Compass,
  ExternalLink,
  Landmark,
  Pause,
  Play,
  RotateCcw,
  ScrollText
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { SupportedLocale } from '@/i18n/routing';
import { densifyGreatCircle } from '@/lib/polar-math';
import type {
  ChronicleAct,
  HistoricExpeditionTrack,
  HistoricMonument,
  HistoricTrackRenderLayer
} from '@/lib/types';

export interface HeritageChronicleSectionProps {
  locale: SupportedLocale;
  acts: ChronicleAct[];
  tracks: HistoricExpeditionTrack[];
  monuments: HistoricMonument[];
  onFocusCoordinates: (lat: number, lon: number, zoom?: number) => void;
  onTrackLayersChange: (layers: HistoricTrackRenderLayer[]) => void;
}

function buildDensifiedTrackPoints(track: HistoricExpeditionTrack): Array<{ lat: number; lon: number }> {
  const all: Array<{ lat: number; lon: number }> = [];
  for (let i = 0; i < track.stops.length - 1; i++) {
    const a = track.stops[i];
    const b = track.stops[i + 1];
    const seg = densifyGreatCircle({ lat: a.lat, lon: a.lon }, { lat: b.lat, lon: b.lon }, 0.8);
    if (i > 0) seg.shift();
    all.push(...seg);
  }
  return all;
}

export function HeritageChronicleSection({
  locale,
  acts,
  tracks,
  monuments,
  onFocusCoordinates,
  onTrackLayersChange
}: HeritageChronicleSectionProps) {
  const tHer = useTranslations('heritage');

  const [selectedTrackId, setSelectedTrackId] = useState<string>(tracks[0]?.id ?? 'shackleton-endurance-1915');
  const [progressPct, setProgressPct] = useState<number>(100);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [compareDualRace, setCompareDualRace] = useState<boolean>(false);
  const [autoSyncScroll, setAutoSyncScroll] = useState<boolean>(false);
  const [activeActId, setActiveActId] = useState<string>(acts[0]?.id ?? 'act-1-early');

  const actRefs = useRef<Record<string, HTMLElement | null>>({});

  const activeTrack =
    tracks.find((t) => t.id === selectedTrackId) ?? tracks[0];

  const densifiedByTrackId = useMemo(() => {
    const map: Record<string, Array<{ lat: number; lon: number }>> = {};
    for (const tr of tracks) {
      map[tr.id] = buildDensifiedTrackPoints(tr);
    }
    return map;
  }, [tracks]);

  // Playback animation timer
  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setProgressPct((prev) => {
        if (prev >= 100) {
          setIsPlaying(false);
          return 100;
        }
        return Math.min(100, prev + 2);
      });
    }, 90);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  // Emit active track polyline(s) up to DualModeAtlasCanvas
  useEffect(() => {
    if (!activeTrack) return;

    const makeSliceLayer = (tr: HistoricExpeditionTrack): HistoricTrackRenderLayer => {
      const full = densifiedByTrackId[tr.id] ?? [];
      const count = Math.max(2, Math.round((progressPct / 100) * full.length));
      const sliced = full.slice(0, count);
      const head = sliced[sliced.length - 1] ?? tr.stops[0];
      return {
        id: tr.id,
        colorHex: tr.colorHex,
        points: sliced,
        activeHead: head
          ? {
              lat: head.lat,
              lon: head.lon,
              label: `${tr.leader[locale]} (${progressPct}%)`
            }
          : undefined
      };
    };

    if (compareDualRace) {
      const amundsen = tracks.find((t) => t.id === 'amundsen-1911');
      const scott = tracks.find((t) => t.id === 'scott-1911');
      const layers: HistoricTrackRenderLayer[] = [];
      if (amundsen) layers.push(makeSliceLayer(amundsen));
      if (scott) layers.push(makeSliceLayer(scott));
      onTrackLayersChange(layers);
    } else {
      onTrackLayersChange([makeSliceLayer(activeTrack)]);
    }
  }, [
    activeTrack,
    compareDualRace,
    densifiedByTrackId,
    locale,
    onTrackLayersChange,
    progressPct,
    tracks
  ]);

  // Optional IntersectionObserver scrollytelling sync
  useEffect(() => {
    if (!autoSyncScroll) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const actId = entry.target.getAttribute('data-act-id');
            const matched = acts.find((a) => a.id === actId);
            if (matched) {
              setActiveActId(matched.id);
              onFocusCoordinates(matched.focusLat, matched.focusLon, matched.focusZoom);
            }
          }
        }
      },
      { threshold: 0.55 }
    );

    for (const act of acts) {
      const node = actRefs.current[act.id];
      if (node) observer.observe(node);
    }
    return () => observer.disconnect();
  }, [acts, autoSyncScroll, onFocusCoordinates]);

  const activeStopIndex = activeTrack
    ? Math.min(
        activeTrack.stops.length - 1,
        Math.floor((progressPct / 100) * activeTrack.stops.length)
      )
    : 0;

  return (
    <div className="space-y-4">
      {/* 1. Heroic Age Expedition Track Playback Controller */}
      <div className="cryo-card rounded-2xl p-4 space-y-3.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-amber-400" />
            <h2 className="text-sm font-semibold text-amber-200">
              {tHer('trackPlayerTitle')}
            </h2>
          </div>

          <label className="inline-flex items-center gap-1.5 text-xs text-emerald-300 cursor-pointer">
            <input
              type="checkbox"
              checked={compareDualRace}
              onChange={(e) => {
                setCompareDualRace(e.target.checked);
                if (e.target.checked) {
                  onFocusCoordinates(-85.0, 175.0, 3);
                }
              }}
              className="accent-emerald-400"
            />
            <span>{tHer('compareDualRace')}</span>
          </label>
        </div>

        {/* Expedition Selector + Playback Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2.5 items-center">
          <select
            value={activeTrack.id}
            disabled={compareDualRace}
            onChange={(e) => {
              const next = tracks.find((t) => t.id === e.target.value);
              setSelectedTrackId(e.target.value);
              setProgressPct(100);
              setIsPlaying(false);
              if (next?.stops[0]) {
                onFocusCoordinates(next.stops[0].lat, next.stops[0].lon, 3);
              }
            }}
            className="md:col-span-7 w-full rounded-xl border border-amber-400/35 bg-slate-900 px-3 py-1.5 text-xs text-white disabled:opacity-60"
          >
            {tracks.map((tr) => (
              <option key={tr.id} value={tr.id}>
                {tr.leader[locale]} ({tr.years})
              </option>
            ))}
          </select>

          <div className="md:col-span-5 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (progressPct >= 100) setProgressPct(0);
                setIsPlaying((prev) => !prev);
              }}
              className="inline-flex items-center gap-1.5 rounded-xl bg-amber-400 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-amber-300 transition"
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3.5 w-3.5" />
                  <span>{tHer('pauseTrack')}</span>
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  <span>{tHer('playTrack')}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setProgressPct(0);
              }}
              className="inline-flex items-center gap-1 rounded-xl border border-slate-700 bg-slate-950/60 px-2.5 py-1.5 text-xs text-slate-300 hover:text-white"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{tHer('resetTrack')}</span>
            </button>

            <span className="font-mono text-xs text-amber-300 ml-auto">
              {progressPct}%
            </span>
          </div>
        </div>

        {/* Timeline Scrubber */}
        <input
          type="range"
          min={0}
          max={100}
          value={progressPct}
          onChange={(e) => {
            setIsPlaying(false);
            setProgressPct(Number(e.target.value));
          }}
          className="w-full accent-amber-400"
        />

        <div className="text-xs text-slate-300 leading-relaxed">
          <span className="font-semibold text-sky-300">
            {activeTrack.vesselOrBase[locale]}:
          </span>{' '}
          {activeTrack.summary[locale]}
        </div>

        {/* Expedition Stops Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {activeTrack.stops.map((stop, idx) => {
            const isCurrent = idx === activeStopIndex;
            return (
              <button
                key={`${activeTrack.id}-${stop.dateLabel}`}
                type="button"
                onClick={() => onFocusCoordinates(stop.lat, stop.lon, 4)}
                className={`text-left rounded-xl border p-2.5 text-xs transition ${
                  isCurrent
                    ? 'border-amber-400/65 bg-amber-500/10'
                    : 'border-slate-700/60 bg-slate-950/50 hover:border-sky-400/50'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-1">
                  <span className="font-mono text-[11px] text-amber-300">
                    {stop.dateLabel}
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">
                    {stop.lat.toFixed(2)}°, {stop.lon.toFixed(2)}°
                  </span>
                </div>
                <div className="mt-1 font-semibold text-white">
                  {stop.title[locale]}
                </div>
                <p className="mt-1 text-[11px] leading-relaxed text-slate-300">
                  {stop.note[locale]}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Four-Act Scrollytelling Chronicle */}
      <div className="cryo-card rounded-2xl p-4 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <ScrollText className="h-4 w-4 text-sky-400 shrink-0" />
              <h2 className="text-sm font-semibold text-sky-200">
                {tHer('chronicleTitle')}
              </h2>
            </div>
            <p className="mt-0.5 text-xs text-slate-300">
              {tHer('chronicleSubtitle')}
            </p>
          </div>

          <label className="inline-flex items-center gap-1.5 rounded-xl border border-sky-400/25 bg-slate-950/60 px-2.5 py-1.5 text-xs text-sky-200 cursor-pointer">
            <input
              type="checkbox"
              checked={autoSyncScroll}
              onChange={(e) => setAutoSyncScroll(e.target.checked)}
              className="accent-sky-400"
            />
            <span>{tHer('autoSyncCamera')}</span>
          </label>
        </div>

        <div className="space-y-3.5">
          {acts.map((act) => {
            const isFocused = act.id === activeActId;
            return (
              <article
                key={act.id}
                ref={(el) => {
                  actRefs.current[act.id] = el;
                }}
                data-act-id={act.id}
                className={`rounded-2xl border p-4 space-y-3 transition ${
                  isFocused
                    ? 'border-sky-400/55 bg-slate-950/70'
                    : 'border-slate-800 bg-slate-950/45'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveActId(act.id);
                      onFocusCoordinates(act.focusLat, act.focusLon, act.focusZoom);
                    }}
                    className="text-left text-sm font-semibold text-sky-300 hover:text-sky-200"
                  >
                    {act.title[locale]}
                  </button>
                  <span className="rounded-full border border-sky-400/30 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[11px] text-sky-200">
                    {act.yearsRange}
                  </span>
                </div>

                <p className="text-xs leading-relaxed text-slate-300">
                  {act.leadNarrative[locale]}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {act.milestones.map((ms) => (
                    <button
                      key={`${act.id}-${ms.yearLabel}`}
                      type="button"
                      onClick={() => {
                        setActiveActId(act.id);
                        onFocusCoordinates(ms.lat, ms.lon, 4);
                      }}
                      className="text-left rounded-xl border border-slate-700/60 bg-slate-900/55 hover:border-sky-400/55 p-2.5 text-xs space-y-1 transition"
                    >
                      <div className="flex items-center justify-between gap-1 font-mono text-[10px]">
                        <span className="text-emerald-300 font-semibold">
                          {ms.yearLabel}
                        </span>
                        <span className="text-slate-400">
                          {ms.lat.toFixed(1)}°, {ms.lon.toFixed(1)}°
                        </span>
                      </div>
                      <div className="font-semibold text-white">
                        {ms.title[locale]}
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-300">
                        {ms.detail[locale]}
                      </p>
                    </button>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 3. Protected ATCM Historic Sites & Monuments (7 Iconic HSMs) */}
      <div className="cryo-card rounded-2xl p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Landmark className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
              {tHer('hsmRegistryTitle')}
            </h3>
          </div>
          <a
            href="https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-sky-300 hover:underline"
          >
            <span>ATCM / 45 CFR 670.29</span>
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {monuments.map((hsm) => (
            <div
              key={hsm.id}
              onClick={() => onFocusCoordinates(hsm.lat, hsm.lon, 4)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onFocusCoordinates(hsm.lat, hsm.lon, 4);
                }
              }}
              className="cursor-pointer rounded-xl border border-slate-700/60 bg-slate-950/50 hover:border-amber-400/55 p-3 space-y-1.5 text-xs transition"
            >
              <div className="flex flex-wrap items-center justify-between gap-1 font-semibold text-amber-200">
                <span>{hsm.title[locale]}</span>
                <a
                  href={hsm.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="rounded bg-amber-500/15 px-1.5 py-0.5 font-mono text-[11px] text-amber-300 underline"
                >
                  {hsm.hsmCode} ({hsm.year})
                </a>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-1 text-[10px] text-slate-400">
                <span>
                  {tHer('proposingParty')}: {hsm.proposingParties}
                </span>
                <span className="font-mono">
                  {hsm.lat.toFixed(2)}°, {hsm.lon.toFixed(2)}°
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-300">
                {hsm.summary[locale]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
