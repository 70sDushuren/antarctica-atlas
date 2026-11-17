'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { SupportedLocale } from '@/i18n/routing';
import {
  computeSubsolarPoint,
  densifyGreatCircle,
  epsg3031ToWgs84,
  wgs84ToEpsg3031
} from '@/lib/polar-math';
import type {
  ExpeditionCorridor,
  HistoricMonument,
  PolarGeologicalSite,
  PolarOutlineDataPack,
  PolarStation,
  StationWeatherTelemetry,
  SubglacialBedmapGrid,
  SubglacialLayerMode
} from '@/lib/types';

export interface PolarGlobe3DProps {
  locale: SupportedLocale;
  centerLat: number;
  centerLon: number;
  zoom: number;
  peelPercent: number;
  subglacialLayerMode: SubglacialLayerMode;
  showSolarTerminator: boolean;
  outlinePack: PolarOutlineDataPack | null;
  bedmapGrid: SubglacialBedmapGrid | null;
  stations: PolarStation[];
  weatherByStation: Record<string, StationWeatherTelemetry>;
  selectedStationId: string;
  monuments: HistoricMonument[];
  geologicalSites: PolarGeologicalSite[];
  activeCorridor: ExpeditionCorridor;
  transectEndpoints: {
    pointA: { lat: number; lon: number };
    pointB: { lat: number; lon: number };
  };
  isPickingTransect: boolean;
  onMapClickCoordinate?: (lat: number, lon: number) => void;
  onCameraChange: (patch: { centerLat?: number; centerLon?: number; zoom?: number }) => void;
  onSelectStation: (stationId: string) => void;
  onCursorMove?: (coords: { lat: number; lon: number; xKm: number; yKm: number } | null) => void;
}

interface ScreenBeacon {
  id: string;
  kind: 'station' | 'hsm' | 'geology';
  x: number;
  y: number;
  label: string;
  sublabel: string;
  lat: number;
  lon: number;
}

function projectOrtho(
  latDeg: number,
  lonDeg: number,
  camLatDeg: number,
  camLonDeg: number,
  radiusPx: number,
  cx: number,
  cy: number
): { x: number; y: number; cosC: number } {
  const phi = (latDeg * Math.PI) / 180;
  const lam = (lonDeg * Math.PI) / 180;
  const phi0 = (camLatDeg * Math.PI) / 180;
  const lam0 = (camLonDeg * Math.PI) / 180;
  const dLam = lam - lam0;

  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const sinPhi0 = Math.sin(phi0);
  const cosPhi0 = Math.cos(phi0);
  const cosDLam = Math.cos(dLam);

  const cosC = sinPhi0 * sinPhi + cosPhi0 * cosPhi * cosDLam;
  const x = cx + radiusPx * cosPhi * Math.sin(dLam);
  const y = cy - radiusPx * (cosPhi0 * sinPhi - sinPhi0 * cosPhi * cosDLam);

  return { x, y, cosC };
}

function inverseOrtho(
  px: number,
  py: number,
  camLatDeg: number,
  camLonDeg: number,
  radiusPx: number,
  cx: number,
  cy: number
): { lat: number; lon: number } | null {
  const dx = px - cx;
  const dy = cy - py;
  const rho = Math.hypot(dx, dy);
  if (rho > radiusPx || radiusPx <= 0) return null;
  if (rho < 1e-5) return { lat: camLatDeg, lon: camLonDeg };

  const c = Math.asin(Math.min(1, rho / radiusPx));
  const sinC = Math.sin(c);
  const cosC = Math.cos(c);
  const phi0 = (camLatDeg * Math.PI) / 180;
  const lam0 = (camLonDeg * Math.PI) / 180;

  const phi = Math.asin(
    cosC * Math.sin(phi0) + (dy * sinC * Math.cos(phi0)) / rho
  );
  const lam =
    lam0 +
    Math.atan2(
      dx * sinC,
      rho * Math.cos(phi0) * cosC - dy * Math.sin(phi0) * sinC
    );

  let lonDeg = (lam * 180) / Math.PI;
  while (lonDeg > 180) lonDeg -= 360;
  while (lonDeg < -180) lonDeg += 360;

  return {
    lat: (phi * 180) / Math.PI,
    lon: lonDeg
  };
}

function getSubglacialCellColor(
  tuple: [number, number, number],
  mode: SubglacialLayerMode,
  alpha: number
): string {
  const [surfM, bedM, thickM] = tuple;
  if (mode === 'thickness') {
    if (thickM >= 3200) return `rgba(168, 85, 247, ${alpha})`;
    if (thickM >= 2000) return `rgba(59, 130, 246, ${alpha})`;
    if (thickM >= 900) return `rgba(56, 189, 248, ${alpha})`;
    return `rgba(186, 230, 253, ${alpha})`;
  }
  if (mode === 'surface') {
    if (surfM >= 3200) return `rgba(248, 250, 252, ${alpha})`;
    if (surfM >= 2000) return `rgba(186, 230, 253, ${alpha})`;
    if (surfM >= 800) return `rgba(56, 189, 248, ${alpha})`;
    return `rgba(14, 116, 144, ${alpha})`;
  }
  if (bedM < -1200) return `rgba(99, 102, 241, ${alpha})`;
  if (bedM < 0) return `rgba(14, 165, 233, ${alpha})`;
  if (bedM < 900) return `rgba(16, 185, 129, ${alpha})`;
  return `rgba(245, 158, 11, ${alpha})`;
}

export default function PolarGlobe3D({
  locale,
  centerLat,
  centerLon,
  zoom,
  peelPercent,
  subglacialLayerMode,
  showSolarTerminator,
  outlinePack,
  bedmapGrid,
  stations,
  weatherByStation,
  selectedStationId,
  monuments,
  geologicalSites,
  activeCorridor,
  transectEndpoints,
  isPickingTransect,
  onMapClickCoordinate,
  onCameraChange,
  onSelectStation,
  onCursorMove
}: PolarGlobe3DProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const beaconsRef = useRef<ScreenBeacon[]>([]);
  const dragRef = useRef<{
    dragging: boolean;
    moved: boolean;
    startX: number;
    startY: number;
    startLat: number;
    startLon: number;
  }>({
    dragging: false,
    moved: false,
    startX: 0,
    startY: 0,
    startLat: centerLat,
    startLon: centerLon
  });

  const [size, setSize] = useState<{ w: number; h: number }>({ w: 760, h: 480 });
  const [hoveredBeacon, setHoveredBeacon] = useState<ScreenBeacon | null>(null);

  const corridorArcPoints = useMemo(() => {
    const pts: Array<{ lat: number; lon: number }> = [];
    for (let i = 0; i < activeCorridor.waypoints.length - 1; i++) {
      const a = activeCorridor.waypoints[i];
      const b = activeCorridor.waypoints[i + 1];
      const seg = densifyGreatCircle({ lat: a.lat, lon: a.lon }, { lat: b.lat, lon: b.lon }, 1.0);
      if (i > 0) seg.shift();
      pts.push(...seg);
    }
    return pts;
  }, [activeCorridor]);

  // Densify planar EPSG:3031 transect so the 3D globe shows the exact planar geodesic slice
  const transectArcPoints = useMemo(() => {
    const pA = wgs84ToEpsg3031(transectEndpoints.pointA.lat, transectEndpoints.pointA.lon);
    const pB = wgs84ToEpsg3031(transectEndpoints.pointB.lat, transectEndpoints.pointB.lon);
    const pts: Array<{ lat: number; lon: number }> = [];
    const steps = 48;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const geo = epsg3031ToWgs84(
        pA.x + (pB.x - pA.x) * t,
        pA.y + (pB.y - pA.y) * t
      );
      pts.push(geo);
    }
    return pts;
  }, [transectEndpoints]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0 && rect.height > 0) {
        setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
      }
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size.w * dpr;
    canvas.height = size.h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cx = size.w / 2;
    const cy = size.h / 2;
    const baseRadius = Math.min(size.w, size.h) * 0.41;
    const zoomFactor = 0.78 + Math.max(0, Math.min(8, zoom)) * 0.16;
    const radius = baseRadius * zoomFactor;

    const camLat = Math.max(-90, Math.min(-25, centerLat));
    const camLon = centerLon;

    ctx.clearRect(0, 0, size.w, size.h);
    const spaceGrad = ctx.createRadialGradient(cx, cy, radius * 0.25, cx, cy, Math.max(size.w, size.h) * 0.75);
    spaceGrad.addColorStop(0, '#0b223d');
    spaceGrad.addColorStop(0.65, '#071324');
    spaceGrad.addColorStop(1, '#040b16');
    ctx.fillStyle = spaceGrad;
    ctx.fillRect(0, 0, size.w, size.h);

    const haloGrad = ctx.createRadialGradient(cx, cy, radius * 0.94, cx, cy, radius * 1.14);
    haloGrad.addColorStop(0, 'rgba(56, 189, 248, 0.26)');
    haloGrad.addColorStop(0.5, 'rgba(14, 165, 233, 0.08)');
    haloGrad.addColorStop(1, 'rgba(7, 17, 31, 0)');
    ctx.fillStyle = haloGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, radius * 1.14, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.clip();

    const oceanGrad = ctx.createRadialGradient(
      cx - radius * 0.25,
      cy - radius * 0.25,
      radius * 0.1,
      cx,
      cy,
      radius
    );
    oceanGrad.addColorStop(0, '#0f3358');
    oceanGrad.addColorStop(0.65, '#09223c');
    oceanGrad.addColorStop(1, '#051527');
    ctx.fillStyle = oceanGrad;
    ctx.fillRect(cx - radius, cy - radius, radius * 2, radius * 2);

    const drawSpherePath = (
      coords: Array<{ lat: number; lon: number }>,
      closeRing: boolean
    ) => {
      ctx.beginPath();
      let started = false;
      for (const pt of coords) {
        const p = projectOrtho(pt.lat, pt.lon, camLat, camLon, radius, cx, cy);
        if (p.cosC >= -0.05) {
          if (!started) {
            ctx.moveTo(p.x, p.y);
            started = true;
          } else {
            ctx.lineTo(p.x, p.y);
          }
        } else if (!closeRing) {
          started = false;
        }
      }
      if (closeRing && started) ctx.closePath();
    };

    if (outlinePack?.southernGateways) {
      ctx.fillStyle = 'rgba(51, 83, 108, 0.65)';
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.45)';
      ctx.lineWidth = 1.1;
      for (const gw of outlinePack.southernGateways) {
        drawSpherePath(gw.coords, true);
        ctx.fill();
        ctx.stroke();
      }
    }

    if (outlinePack) {
      const iceAlpha = Math.max(0.2, 1 - (peelPercent / 100) * 0.74);
      ctx.fillStyle = `rgba(224, 242, 254, ${iceAlpha})`;
      ctx.strokeStyle = 'rgba(125, 211, 252, 0.9)';
      ctx.lineWidth = 1.5;
      drawSpherePath(outlinePack.antarcticContinentRing, true);
      ctx.fill();
      ctx.stroke();

      if (outlinePack.iceShelves) {
        ctx.fillStyle = `rgba(125, 211, 252, ${Math.max(0.16, iceAlpha * 0.55)})`;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.75)';
        ctx.lineWidth = 1;
        for (const shelf of outlinePack.iceShelves) {
          drawSpherePath(shelf.vertices, true);
          ctx.fill();
          ctx.stroke();
        }
      }
    }

    // Subglacial Bedmap3 57x57 Grid Visualization (stride by 2 on 3D canvas for 60fps smoothness)
    if (bedmapGrid && peelPercent > 0) {
      const alpha = Math.min(0.84, (peelPercent / 100) * 0.88);
      const { min, step } = bedmapGrid.gridBoundsKm;
      const dotR = Math.max(2.2, radius * 0.019);

      for (let r = 0; r < bedmapGrid.rows.length; r += 2) {
        const yKm = min + r * step;
        for (let c = 0; c < bedmapGrid.rows[r].length; c += 2) {
          const xKm = min + c * step;
          if (Math.hypot(xKm, yKm) > 2500) continue;
          const tuple = bedmapGrid.rows[r][c];
          if (tuple[0] <= 0) continue;

          const geo = epsg3031ToWgs84(xKm * 1000, yKm * 1000);
          const p = projectOrtho(geo.lat, geo.lon, camLat, camLon, radius, cx, cy);
          if (p.cosC > 0.02) {
            ctx.fillStyle = getSubglacialCellColor(tuple, subglacialLayerMode, alpha);
            ctx.beginPath();
            ctx.arc(p.x, p.y, dotR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }
    }

    // Graticule rings
    for (const latRing of [-30, -45, -60, -66.563, -75, -85]) {
      const ringPts: Array<{ lat: number; lon: number }> = [];
      for (let lon = -180; lon <= 180; lon += 4) {
        ringPts.push({ lat: latRing, lon });
      }
      ctx.save();
      if (latRing === -60) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.55)';
        ctx.setLineDash([5, 4]);
        ctx.lineWidth = 1.3;
      } else if (Math.abs(latRing - -66.563) < 0.1) {
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
        ctx.setLineDash([3, 3]);
        ctx.lineWidth = 1.1;
      } else {
        ctx.strokeStyle = 'rgba(148, 163, 184, 0.2)';
        ctx.lineWidth = 0.8;
      }
      drawSpherePath(ringPts, false);
      ctx.stroke();
      ctx.restore();
    }

    for (let lon = -180; lon < 180; lon += 30) {
      const merPts: Array<{ lat: number; lon: number }> = [];
      for (let lat = -90; lat <= -15; lat += 3) {
        merPts.push({ lat, lon });
      }
      ctx.strokeStyle =
        lon === 0 || lon === -180
          ? 'rgba(56, 189, 248, 0.38)'
          : 'rgba(148, 163, 184, 0.16)';
      ctx.lineWidth = lon === 0 || lon === -180 ? 1.1 : 0.75;
      drawSpherePath(merPts, false);
      ctx.stroke();
    }

    if (showSolarTerminator) {
      const { declinationDeg, subsolarLonDeg } = computeSubsolarPoint();
      const decRad = (declinationDeg * Math.PI) / 180;
      const subLonRad = (subsolarLonDeg * Math.PI) / 180;
      const sunVec = [
        Math.cos(decRad) * Math.cos(subLonRad),
        Math.cos(decRad) * Math.sin(subLonRad),
        Math.sin(decRad)
      ];

      const stepPx = 14;
      for (let py = cy - radius; py <= cy + radius; py += stepPx) {
        for (let px = cx - radius; px <= cx + radius; px += stepPx) {
          const geo = inverseOrtho(px, py, camLat, camLon, radius, cx, cy);
          if (!geo) continue;
          const phi = (geo.lat * Math.PI) / 180;
          const lam = (geo.lon * Math.PI) / 180;
          const dot =
            Math.cos(phi) * Math.cos(lam) * sunVec[0] +
            Math.cos(phi) * Math.sin(lam) * sunVec[1] +
            Math.sin(phi) * sunVec[2];

          if (dot < 0) {
            const nightAlpha = Math.min(0.46, Math.abs(dot) * 0.9 + 0.12);
            ctx.fillStyle = `rgba(2, 6, 23, ${nightAlpha})`;
            ctx.fillRect(px - stepPx / 2, py - stepPx / 2, stepPx + 1, stepPx + 1);
          }
        }
      }
    }

    // Active Expedition Corridor Track
    if (corridorArcPoints.length > 1) {
      ctx.save();
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.9)';
      ctx.lineWidth = 2.2;
      drawSpherePath(corridorArcPoints, false);
      ctx.stroke();
      ctx.restore();
    }

    // Active Bedmap3 Cross-Section Transect Line (A -> B)
    if (transectArcPoints.length > 1) {
      ctx.save();
      ctx.strokeStyle = '#e879f9';
      ctx.lineWidth = 2.4;
      ctx.setLineDash([6, 4]);
      drawSpherePath(transectArcPoints, false);
      ctx.stroke();
      ctx.restore();

      const endpoints: Array<[string, { lat: number; lon: number }]> = [
        ['A', transectEndpoints.pointA],
        ['B', transectEndpoints.pointB]
      ];
      for (const [tag, pt] of endpoints) {
        const p = projectOrtho(pt.lat, pt.lon, camLat, camLon, radius, cx, cy);
        if (p.cosC > 0) {
          ctx.fillStyle = '#e879f9';
          ctx.strokeStyle = '#0f172a';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          ctx.fillStyle = '#0f172a';
          ctx.font = '700 9px system-ui, sans-serif';
          ctx.fillText(tag, p.x - 3, p.y + 3);
        }
      }
    }

    ctx.restore();

    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Beacons: Geological Sites, HSM Monuments & 18 Polar Stations
    const nextBeacons: ScreenBeacon[] = [];

    for (const geoSite of geologicalSites) {
      const p = projectOrtho(geoSite.lat, geoSite.lon, camLat, camLon, radius, cx, cy);
      if (p.cosC <= 0.02) continue;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y - 5.5);
      ctx.lineTo(p.x + 5, p.y + 4.5);
      ctx.lineTo(p.x - 5, p.y + 4.5);
      ctx.closePath();
      ctx.fillStyle = geoSite.category === 'volcano' ? '#f43f5e' : '#c084fc';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.fill();
      ctx.stroke();

      nextBeacons.push({
        id: geoSite.id,
        kind: 'geology',
        x: p.x,
        y: p.y,
        label: geoSite.name[locale],
        sublabel: `${geoSite.rockOrFeatureType[locale]}`,
        lat: geoSite.lat,
        lon: geoSite.lon
      });
    }

    for (const hsm of monuments) {
      const p = projectOrtho(hsm.lat, hsm.lon, camLat, camLon, radius, cx, cy);
      if (p.cosC <= 0.02) continue;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.PI / 4);
      ctx.fillStyle = '#f59e0b';
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1.2;
      ctx.fillRect(-4, -4, 8, 8);
      ctx.strokeRect(-4, -4, 8, 8);
      ctx.restore();

      nextBeacons.push({
        id: hsm.id,
        kind: 'hsm',
        x: p.x,
        y: p.y,
        label: hsm.title[locale],
        sublabel: `${hsm.hsmCode} · ${hsm.year}`,
        lat: hsm.lat,
        lon: hsm.lon
      });
    }

    for (const st of stations) {
      const p = projectOrtho(st.lat, st.lon, camLat, camLon, radius, cx, cy);
      if (p.cosC <= 0.02) continue;
      const isSelected = st.id === selectedStationId;
      const weather = weatherByStation[st.id];

      if (isSelected) {
        ctx.strokeStyle = 'rgba(16, 185, 129, 0.9)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
        ctx.stroke();
      }

      ctx.fillStyle = isSelected ? '#10b981' : '#38bdf8';
      ctx.strokeStyle = '#082f49';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(p.x, p.y, isSelected ? 5.8 : 4.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      if (isSelected || st.id === 'amundsen-scott' || st.id === 'mcmurdo' || st.id === 'great-wall') {
        ctx.font = isSelected ? '600 11px system-ui, sans-serif' : '500 10px system-ui, sans-serif';
        ctx.fillStyle = isSelected ? '#a7f3d0' : '#e0f2fe';
        ctx.fillText(st.code, p.x + 8, p.y + 3);
      }

      nextBeacons.push({
        id: st.id,
        kind: 'station',
        x: p.x,
        y: p.y,
        label: st.name[locale],
        sublabel: weather
          ? `${weather.temperature2mC.toFixed(1)}°C · ${st.elevationM}m`
          : `${st.countryName[locale]} · ${st.elevationM}m`,
        lat: st.lat,
        lon: st.lon
      });
    }

    beaconsRef.current = nextBeacons;
  }, [
    size,
    centerLat,
    centerLon,
    zoom,
    peelPercent,
    subglacialLayerMode,
    showSolarTerminator,
    outlinePack,
    bedmapGrid,
    stations,
    weatherByStation,
    selectedStationId,
    monuments,
    geologicalSites,
    corridorArcPoints,
    transectArcPoints,
    transectEndpoints,
    locale
  ]);

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      dragging: true,
      moved: false,
      startX: e.clientX,
      startY: e.clientY,
      startLat: centerLat,
      startLon: centerLon
    };
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const lx = e.clientX - rect.left;
    const ly = e.clientY - rect.top;

    if (dragRef.current.dragging) {
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      if (Math.hypot(dx, dy) > 3) {
        dragRef.current.moved = true;
      }
      const nextLon = ((dragRef.current.startLon - dx * 0.35 + 540) % 360) - 180;
      const nextLat = Math.max(-90, Math.min(-30, dragRef.current.startLat + dy * 0.25));
      onCameraChange({
        centerLat: Math.round(nextLat * 100) / 100,
        centerLon: Math.round(nextLon * 100) / 100
      });
      return;
    }

    const hit = beaconsRef.current.find((b) => Math.hypot(b.x - lx, b.y - ly) <= 10) ?? null;
    setHoveredBeacon(hit);

    if (onCursorMove) {
      const baseRadius = Math.min(size.w, size.h) * 0.41;
      const radius = baseRadius * (0.78 + Math.max(0, Math.min(8, zoom)) * 0.16);
      const geo = inverseOrtho(
        lx,
        ly,
        Math.max(-90, Math.min(-25, centerLat)),
        centerLon,
        radius,
        size.w / 2,
        size.h / 2
      );
      if (geo && geo.lat <= -50) {
        const xy = wgs84ToEpsg3031(geo.lat, geo.lon);
        onCursorMove({
          lat: geo.lat,
          lon: geo.lon,
          xKm: Math.round(xy.x / 1000),
          yKm: Math.round(xy.y / 1000)
        });
      } else {
        onCursorMove(null);
      }
    }
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current.dragging) return;
    const wasMoved = dragRef.current.moved;
    dragRef.current.dragging = false;

    if (!wasMoved) {
      const rect = e.currentTarget.getBoundingClientRect();
      const lx = e.clientX - rect.left;
      const ly = e.clientY - rect.top;

      if (isPickingTransect && onMapClickCoordinate) {
        const baseRadius = Math.min(size.w, size.h) * 0.41;
        const radius = baseRadius * (0.78 + Math.max(0, Math.min(8, zoom)) * 0.16);
        const geo = inverseOrtho(
          lx,
          ly,
          Math.max(-90, Math.min(-25, centerLat)),
          centerLon,
          radius,
          size.w / 2,
          size.h / 2
        );
        if (geo && geo.lat <= -55) {
          onMapClickCoordinate(geo.lat, geo.lon);
        }
        return;
      }

      const hit = beaconsRef.current.find((b) => Math.hypot(b.x - lx, b.y - ly) <= 12);
      if (hit) {
        if (hit.kind === 'station') {
          onSelectStation(hit.id);
        }
        onCameraChange({ centerLat: hit.lat, centerLon: hit.lon });
      }
    }
  }

  function handleWheel(e: React.WheelEvent<HTMLCanvasElement>) {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 0.5 : -0.5;
    const nextZoom = Math.max(1, Math.min(6, Math.round((zoom + delta) * 2) / 2));
    if (nextZoom !== zoom) {
      onCameraChange({ zoom: nextZoom });
    }
  }

  return (
    <div ref={containerRef} className="relative h-full w-full min-h-[420px] select-none overflow-hidden rounded-xl">
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={() => {
          dragRef.current.dragging = false;
          setHoveredBeacon(null);
        }}
        onWheel={handleWheel}
        className={`block h-full w-full ${
          isPickingTransect ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'
        }`}
      />

      {hoveredBeacon && (
        <div
          style={{
            left: Math.min(size.w - 220, Math.max(12, hoveredBeacon.x + 14)),
            top: Math.max(12, hoveredBeacon.y - 36)
          }}
          className="pointer-events-none absolute z-20 rounded-xl border border-sky-400/40 bg-slate-950/90 px-3 py-1.5 text-xs shadow-lg backdrop-blur-md"
        >
          <div className="font-semibold text-sky-200">{hoveredBeacon.label}</div>
          <div className="font-mono text-[11px] text-slate-300">{hoveredBeacon.sublabel}</div>
        </div>
      )}
    </div>
  );
}
