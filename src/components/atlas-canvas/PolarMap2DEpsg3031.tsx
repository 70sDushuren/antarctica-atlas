'use client';

import { useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'proj4';
import 'proj4leaflet';
import 'leaflet/dist/leaflet.css';

import type { SupportedLocale } from '@/i18n/routing';
import {
  computeSubsolarPoint,
  densifyGreatCircle,
  EPSG3031_PROJ4,
  epsg3031ToWgs84,
  NASA_GIBS_EPSG3031_CONFIG,
  wgs84ToEpsg3031
} from '@/lib/polar-math';
import type {
  ExpeditionCorridor,
  HistoricMonument,
  HistoricTrackRenderLayer,
  PolarBaseLayer,
  PolarGeologicalSite,
  PolarOutlineDataPack,
  PolarStation,
  StationWeatherTelemetry,
  SubglacialBedmapGrid,
  SubglacialLayerMode
} from '@/lib/types';

export interface PolarMap2DEpsg3031Props {
  locale: SupportedLocale;
  centerLat: number;
  centerLon: number;
  zoom: number;
  peelPercent: number;
  subglacialLayerMode: SubglacialLayerMode;
  baseLayer: PolarBaseLayer;
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
  historicTrackLayers?: HistoricTrackRenderLayer[];
  isPickingTransect: boolean;
  onMapClickCoordinate?: (lat: number, lon: number) => void;
  onCameraChange: (patch: { centerLat?: number; centerLon?: number; zoom?: number }) => void;
  onSelectStation: (stationId: string) => void;
  onCursorMove?: (coords: { lat: number; lon: number; xKm: number; yKm: number } | null) => void;
}

const TRANSPARENT_TILE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

function clampPolarLat(lat: number): number {
  return Math.max(-89.99, Math.min(-52.0, lat));
}

function getSubglacialFillColor(
  tuple: [number, number, number],
  mode: SubglacialLayerMode
): string {
  const [surfM, bedM, thickM] = tuple;
  if (mode === 'thickness') {
    if (thickM >= 3200) return '#a855f7';
    if (thickM >= 2000) return '#3b82f6';
    if (thickM >= 900) return '#38bdf8';
    return '#bae6fd';
  }
  if (mode === 'surface') {
    if (surfM >= 3200) return '#f8fafc';
    if (surfM >= 2000) return '#bae6fd';
    if (surfM >= 800) return '#38bdf8';
    return '#0e7490';
  }
  if (bedM < -1200) return '#6366f1';
  if (bedM < 0) return '#0ea5e9';
  if (bedM < 900) return '#10b981';
  return '#f59e0b';
}

export default function PolarMap2DEpsg3031({
  locale,
  centerLat,
  centerLon,
  zoom,
  peelPercent,
  subglacialLayerMode,
  baseLayer,
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
  historicTrackLayers = [],
  isPickingTransect,
  onMapClickCoordinate,
  onCameraChange,
  onSelectStation,
  onCursorMove
}: PolarMap2DEpsg3031Props) {
  const mapElRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const overlayGroupRef = useRef<L.LayerGroup | null>(null);
  const suppressMoveRef = useRef(false);
  const clickCallbackRef = useRef(onMapClickCoordinate);
  const pickingRef = useRef(isPickingTransect);

  useEffect(() => {
    clickCallbackRef.current = onMapClickCoordinate;
    pickingRef.current = isPickingTransect;
  }, [onMapClickCoordinate, isPickingTransect]);

  const densifiedCorridorLatLngs = useMemo(() => {
    const pts: Array<[number, number]> = [];
    for (let i = 0; i < activeCorridor.waypoints.length - 1; i++) {
      const a = activeCorridor.waypoints[i];
      const b = activeCorridor.waypoints[i + 1];
      const seg = densifyGreatCircle({ lat: a.lat, lon: a.lon }, { lat: b.lat, lon: b.lon }, 1.0);
      if (i > 0) seg.shift();
      for (const p of seg) {
        pts.push([clampPolarLat(p.lat), p.lon]);
      }
    }
    return pts;
  }, [activeCorridor]);

  // Planar EPSG:3031 straight transect line sampled cleanly so Leaflet connects smoothly across 90°S & ±180°
  const planarTransectLatLngs = useMemo(() => {
    const pA = wgs84ToEpsg3031(transectEndpoints.pointA.lat, transectEndpoints.pointA.lon);
    const pB = wgs84ToEpsg3031(transectEndpoints.pointB.lat, transectEndpoints.pointB.lon);
    const pts: Array<[number, number]> = [];
    const steps = 40;
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const geo = epsg3031ToWgs84(
        pA.x + (pB.x - pA.x) * t,
        pA.y + (pB.y - pA.y) * t
      );
      pts.push([clampPolarLat(geo.lat), geo.lon]);
    }
    return pts;
  }, [transectEndpoints]);

  useEffect(() => {
    const el = mapElRef.current;
    if (!el || mapRef.current) return;

    const crs = new L.Proj.CRS('EPSG:3031', EPSG3031_PROJ4, {
      origin: NASA_GIBS_EPSG3031_CONFIG.origin,
      resolutions: NASA_GIBS_EPSG3031_CONFIG.resolutions,
      bounds: L.bounds(
        NASA_GIBS_EPSG3031_CONFIG.boundsMeters[0],
        NASA_GIBS_EPSG3031_CONFIG.boundsMeters[1]
      )
    });

    const initialZoom = Math.max(0, Math.min(5, Math.round(zoom) - 1));
    const map = L.map(el, {
      crs,
      center: [clampPolarLat(centerLat), centerLon],
      zoom: initialZoom,
      minZoom: 0,
      maxZoom: 5,
      attributionControl: false,
      zoomControl: true
    });

    const overlayGroup = L.layerGroup().addTo(map);
    overlayGroupRef.current = overlayGroup;
    mapRef.current = map;

    map.on('moveend', () => {
      if (suppressMoveRef.current) return;
      const c = map.getCenter();
      const z = map.getZoom();
      onCameraChange({
        centerLat: Math.round(Math.max(-90, Math.min(-50, c.lat)) * 100) / 100,
        centerLon: Math.round(c.lng * 100) / 100,
        zoom: z + 1
      });
    });

    map.on('click', (ev: L.LeafletMouseEvent) => {
      if (pickingRef.current && clickCallbackRef.current) {
        clickCallbackRef.current(
          Math.max(-89.99, Math.min(-55.0, ev.latlng.lat)),
          ev.latlng.lng
        );
      }
    });

    map.on('mousemove', (ev: L.LeafletMouseEvent) => {
      if (!onCursorMove) return;
      const xy = wgs84ToEpsg3031(ev.latlng.lat, ev.latlng.lng);
      onCursorMove({
        lat: ev.latlng.lat,
        lon: ev.latlng.lng,
        xKm: Math.round(xy.x / 1000),
        yKm: Math.round(xy.y / 1000)
      });
    });

    map.on('mouseout', () => {
      onCursorMove?.(null);
    });

    return () => {
      map.remove();
      mapRef.current = null;
      overlayGroupRef.current = null;
      tileLayerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const targetLat = clampPolarLat(centerLat);
    const targetZoom = Math.max(0, Math.min(5, Math.round(zoom) - 1));
    const cur = map.getCenter();
    const dist = Math.hypot(cur.lat - targetLat, cur.lng - centerLon);
    if (dist > 1.2 || map.getZoom() !== targetZoom) {
      suppressMoveRef.current = true;
      map.setView([targetLat, centerLon], targetZoom, { animate: false });
      suppressMoveRef.current = false;
    }
  }, [centerLat, centerLon, zoom]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
      tileLayerRef.current = null;
    }

    if (baseLayer === 'cryo-vector') {
      return;
    }

    const tileUrl =
      baseLayer === 'gibs-modis'
        ? 'https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/2024-12-21/250m/{z}/{y}/{x}.jpg'
        : 'https://gibs.earthdata.nasa.gov/wmts/epsg3031/best/BlueMarble_ShadedRelief_Bathymetry/default/500m/{z}/{y}/{x}.jpeg';

    const maxNativeZoom = baseLayer === 'gibs-modis' ? 5 : 4;

    const layer = L.tileLayer(tileUrl, {
      tileSize: NASA_GIBS_EPSG3031_CONFIG.tileSize,
      minZoom: 0,
      maxZoom: 5,
      maxNativeZoom,
      noWrap: true,
      opacity: 0.78,
      errorTileUrl: TRANSPARENT_TILE
    });

    layer.addTo(map);
    layer.bringToBack();
    tileLayerRef.current = layer;
  }, [baseLayer]);

  useEffect(() => {
    const group = overlayGroupRef.current;
    if (!group) return;
    group.clearLayers();

    for (const ringLat of [-60, -66.563, -75, -85]) {
      const latlngs: Array<[number, number]> = [];
      for (let lon = -180; lon <= 180; lon += 3) {
        latlngs.push([ringLat, lon]);
      }
      L.polyline(latlngs, {
        color: ringLat === -60 ? '#10b981' : ringLat === -66.563 ? '#38bdf8' : '#64748b',
        weight: ringLat === -60 ? 1.5 : 1,
        opacity: ringLat === -60 ? 0.65 : 0.35,
        dashArray: ringLat === -60 || ringLat === -66.563 ? '6 5' : undefined,
        interactive: false
      }).addTo(group);
    }

    for (const merLon of [0, 90, 180, -90]) {
      L.polyline(
        [
          [-89.95, merLon],
          [-55.0, merLon]
        ],
        {
          color: merLon === 0 || merLon === 180 ? '#38bdf8' : '#64748b',
          weight: 1,
          opacity: 0.35,
          interactive: false
        }
      ).addTo(group);
    }

    if (outlinePack) {
      const iceFillOpacity = Math.max(0.08, 0.36 * (1 - peelPercent / 100));
      L.polygon(
        outlinePack.antarcticContinentRing.map((v) => [v.lat, v.lon] as [number, number]),
        {
          color: '#7dd3fc',
          weight: 1.8,
          fillColor: '#e0f2fe',
          fillOpacity: iceFillOpacity,
          interactive: false
        }
      ).addTo(group);

      for (const shelf of outlinePack.iceShelves ?? []) {
        L.polygon(
          shelf.vertices.map((v) => [v.lat, v.lon] as [number, number]),
          {
            color: '#38bdf8',
            weight: 1.2,
            dashArray: '4 3',
            fillColor: '#38bdf8',
            fillOpacity: Math.max(0.1, iceFillOpacity * 0.8),
            interactive: false
          }
        ).addTo(group);
      }
    }

    // Subglacial Bedmap3 Grid Nodes (57x57 sampled every 2 cells for crisp 2D rendering)
    if (bedmapGrid && peelPercent > 0) {
      const alpha = Math.min(0.8, (peelPercent / 100) * 0.84);
      const { min, step } = bedmapGrid.gridBoundsKm;

      for (let r = 0; r < bedmapGrid.rows.length; r += 2) {
        const yKm = min + r * step;
        for (let c = 0; c < bedmapGrid.rows[r].length; c += 2) {
          const xKm = min + c * step;
          if (Math.hypot(xKm, yKm) > 2500) continue;
          const tuple = bedmapGrid.rows[r][c];
          if (tuple[0] <= 0) continue;

          const geo = epsg3031ToWgs84(xKm * 1000, yKm * 1000);
          L.circleMarker([clampPolarLat(geo.lat), geo.lon], {
            radius: 4.5,
            stroke: false,
            fillColor: getSubglacialFillColor(tuple, subglacialLayerMode),
            fillOpacity: alpha,
            interactive: false
          }).addTo(group);
        }
      }
    }

    if (showSolarTerminator) {
      const { declinationDeg, subsolarLonDeg } = computeSubsolarPoint();
      if (Math.abs(declinationDeg) > 0.2) {
        const tanDec = Math.tan((declinationDeg * Math.PI) / 180);
        const termPts: Array<[number, number]> = [];
        for (let lon = -180; lon <= 180; lon += 3) {
          const haRad = ((lon - subsolarLonDeg) * Math.PI) / 180;
          const latRad = Math.atan(-Math.cos(haRad) / tanDec);
          const latDeg = (latRad * 180) / Math.PI;
          if (latDeg <= -52 && latDeg >= -89.99) {
            termPts.push([latDeg, lon]);
          }
        }
        if (termPts.length > 2) {
          L.polyline(termPts, {
            color: '#fde047',
            weight: 1.6,
            dashArray: '5 5',
            opacity: 0.75,
            interactive: false
          }).addTo(group);
        }
      }
    }

    if (densifiedCorridorLatLngs.length > 1) {
      L.polyline(densifiedCorridorLatLngs, {
        color: '#fbbf24',
        weight: 2.6,
        opacity: 0.88,
        interactive: false
      }).addTo(group);
    }

    // Phase 3 Heroic Age Historic Track Playback Layers
    for (const layer of historicTrackLayers) {
      if (layer.points.length > 1) {
        L.polyline(
          layer.points.map((p) => [clampPolarLat(p.lat), p.lon] as [number, number]),
          {
            color: layer.colorHex,
            weight: 3,
            opacity: 0.94,
            interactive: false
          }
        ).addTo(group);
      }
      if (layer.activeHead) {
        L.circleMarker([clampPolarLat(layer.activeHead.lat), layer.activeHead.lon], {
          radius: 7.5,
          color: '#ffffff',
          weight: 2,
          fillColor: layer.colorHex,
          fillOpacity: 1
        })
          .bindTooltip(layer.activeHead.label, { direction: 'top' })
          .addTo(group);
      }
    }

    // Active Bedmap3 Cross-Section Transect Line (A -> B)
    if (planarTransectLatLngs.length > 1) {
      L.polyline(planarTransectLatLngs, {
        color: '#e879f9',
        weight: 3,
        dashArray: '7 5',
        opacity: 0.95,
        interactive: false
      }).addTo(group);

      for (const [tag, pt] of [
        ['A', transectEndpoints.pointA],
        ['B', transectEndpoints.pointB]
      ] as const) {
        L.circleMarker([clampPolarLat(pt.lat), pt.lon], {
          radius: 7,
          color: '#0f172a',
          weight: 2,
          fillColor: '#e879f9',
          fillOpacity: 1
        })
          .bindTooltip(`Transect ${tag} (${pt.lat.toFixed(1)}°, ${pt.lon.toFixed(1)}°)`, {
            direction: 'top'
          })
          .addTo(group);
      }
    }

    // SCAR GeoMAP Geological Sites
    for (const geoSite of geologicalSites) {
      L.circleMarker([clampPolarLat(geoSite.lat), geoSite.lon], {
        radius: 5.5,
        color: '#0f172a',
        weight: 1.4,
        fillColor: geoSite.category === 'volcano' ? '#f43f5e' : '#c084fc',
        fillOpacity: 0.92
      })
        .bindTooltip(`${geoSite.name[locale]}`, { direction: 'top' })
        .addTo(group);
    }

    for (const hsm of monuments) {
      L.circleMarker([hsm.lat, hsm.lon], {
        radius: 5.8,
        color: '#fef3c7',
        weight: 1.4,
        fillColor: '#d97706',
        fillOpacity: 0.95
      })
        .bindTooltip(`${hsm.hsmCode} · ${hsm.title[locale]}`, { direction: 'top' })
        .addTo(group);
    }

    for (const st of stations) {
      const isSelected = st.id === selectedStationId;
      const weather = weatherByStation[st.id];
      const marker = L.circleMarker([clampPolarLat(st.lat), st.lon], {
        radius: isSelected ? 8.5 : 5.8,
        color: isSelected ? '#ecfdf5' : '#082f49',
        weight: isSelected ? 2.2 : 1.4,
        fillColor: isSelected ? '#10b981' : '#38bdf8',
        fillOpacity: 0.95
      });

      const tempText = weather ? ` · ${weather.temperature2mC.toFixed(1)}°C` : '';
      marker.bindTooltip(`${st.name[locale]} (${st.code})${tempText}`, {
        direction: 'top'
      });

      marker.on('click', () => {
        if (pickingRef.current && clickCallbackRef.current) {
          clickCallbackRef.current(st.lat, st.lon);
          return;
        }
        onSelectStation(st.id);
        onCameraChange({ centerLat: st.lat, centerLon: st.lon });
      });

      marker.addTo(group);
    }
  }, [
    outlinePack,
    bedmapGrid,
    peelPercent,
    subglacialLayerMode,
    showSolarTerminator,
    densifiedCorridorLatLngs,
    planarTransectLatLngs,
    transectEndpoints,
    historicTrackLayers,
    geologicalSites,
    monuments,
    stations,
    weatherByStation,
    selectedStationId,
    locale,
    onSelectStation,
    onCameraChange
  ]);

  return (
    <div
      className={`relative h-full w-full min-h-[420px] overflow-hidden rounded-xl bg-[#061325] ${
        isPickingTransect ? 'cursor-crosshair' : ''
      }`}
    >
      <div ref={mapElRef} className="h-full w-full min-h-[420px]" />
    </div>
  );
}
