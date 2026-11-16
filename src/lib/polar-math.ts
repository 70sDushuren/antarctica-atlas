/**
 * Canonical Polar Stereographic (EPSG:3031), Anti-Meridian Geodesics,
 * Subglacial Bedmap3 Cross-Section Interpolation, Wind-Chill, Drake Sea-State,
 * and Polar Solar Illumination Geometry Utilities.
 * Reference: https://spatialreference.org/ref/epsg/3031/
 */

import type { SubglacialBedmapGrid, TransectSamplePoint } from './types';

const WGS84_A = 6378137.0;
const WGS84_F = 1 / 298.257223563;
const WGS84_E2 = 2 * WGS84_F - WGS84_F * WGS84_F;
const WGS84_E = Math.sqrt(WGS84_E2);
const LAT_TS_RAD = (71 * Math.PI) / 180; // |lat_ts| = 71°S standard parallel

export const EPSG3031_PROJ4 =
  '+proj=stere +lat_0=-90 +lat_ts=-71 +lon_0=0 +x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs';

/**
 * Official NASA Earthdata GIBS Antarctic Polar Stereographic (EPSG:3031) WMTS Grid Parameters.
 * Reference: https://nasa-gibs.github.io/gibs-web-examples/examples/leaflet/antarctic-epsg3031.html
 */
export const NASA_GIBS_EPSG3031_CONFIG = {
  crsCode: 'EPSG:3031',
  origin: [-4194304, 4194304] as [number, number],
  resolutions: [8192, 4096, 2048, 1024, 512, 256] as number[],
  tileSize: 512,
  boundsMeters: [
    [-4194304, -4194304],
    [4194304, 4194304]
  ] as [[number, number], [number, number]]
} as const;

/**
 * Converts WGS84 (lat, lon) in degrees to EPSG:3031 planar meters (x, y).
 * Origin (0, 0) is the Geographic South Pole (-90°, 0°).
 * Prime Meridian (0°) points up (+Y), 90°E points right (+X), 90°W points left (-X), 180° points down (-Y).
 */
export function wgs84ToEpsg3031(latDeg: number, lonDeg: number): { x: number; y: number } {
  if (latDeg <= -89.999999) {
    return { x: 0, y: 0 };
  }
  const phi = (-latDeg * Math.PI) / 180; // flip to positive southern latitude
  const lam = (lonDeg * Math.PI) / 180;

  const sinPhi = Math.sin(phi);
  const sinPhiC = Math.sin(LAT_TS_RAD);
  const cosPhiC = Math.cos(LAT_TS_RAD);

  const t =
    Math.tan(Math.PI / 4 - phi / 2) /
    Math.pow((1 - WGS84_E * sinPhi) / (1 + WGS84_E * sinPhi), WGS84_E / 2);
  const tC =
    Math.tan(Math.PI / 4 - LAT_TS_RAD / 2) /
    Math.pow((1 - WGS84_E * sinPhiC) / (1 + WGS84_E * sinPhiC), WGS84_E / 2);
  const mC = cosPhiC / Math.sqrt(1 - WGS84_E2 * sinPhiC * sinPhiC);

  const rho = (WGS84_A * mC * t) / tC;

  return {
    x: rho * Math.sin(lam),
    y: rho * Math.cos(lam)
  };
}

/**
 * Inverse transform from EPSG:3031 meters (x, y) back to WGS84 (lat, lon) degrees.
 */
export function epsg3031ToWgs84(x: number, y: number): { lat: number; lon: number } {
  const rho = Math.hypot(x, y);
  if (rho < 1e-6) {
    return { lat: -90, lon: 0 };
  }

  const sinPhiC = Math.sin(LAT_TS_RAD);
  const cosPhiC = Math.cos(LAT_TS_RAD);
  const tC =
    Math.tan(Math.PI / 4 - LAT_TS_RAD / 2) /
    Math.pow((1 - WGS84_E * sinPhiC) / (1 + WGS84_E * sinPhiC), WGS84_E / 2);
  const mC = cosPhiC / Math.sqrt(1 - WGS84_E2 * sinPhiC * sinPhiC);

  const t = (rho * tC) / (WGS84_A * mC);
  let phi = Math.PI / 2 - 2 * Math.atan(t);

  for (let i = 0; i < 6; i++) {
    const sinPhi = Math.sin(phi);
    phi =
      Math.PI / 2 -
      2 *
        Math.atan(
          t * Math.pow((1 - WGS84_E * sinPhi) / (1 + WGS84_E * sinPhi), WGS84_E / 2)
        );
  }

  const lonRad = Math.atan2(x, y);
  return {
    lat: -(phi * 180) / Math.PI,
    lon: (lonRad * 180) / Math.PI
  };
}

/**
 * Converts WGS84 geodetic coordinates (lat, lon, altitudeMeters) to 3D ECEF Cartesian meters.
 * Eliminates ±180° Mercator longitude wrap artifacts in 3D WebGL / Cesium Globe rendering.
 */
export function wgs84ToEcef(
  latDeg: number,
  lonDeg: number,
  altMeters = 0
): { x: number; y: number; z: number } {
  const latRad = (latDeg * Math.PI) / 180;
  const lonRad = (lonDeg * Math.PI) / 180;
  const sinLat = Math.sin(latRad);
  const cosLat = Math.cos(latRad);
  const sinLon = Math.sin(lonRad);
  const cosLon = Math.cos(lonRad);

  const n = WGS84_A / Math.sqrt(1 - WGS84_E2 * sinLat * sinLat);
  return {
    x: (n + altMeters) * cosLat * cosLon,
    y: (n + altMeters) * cosLat * sinLon,
    z: (n * (1 - WGS84_E2) + altMeters) * sinLat
  };
}

/**
 * Densifies a great-circle geodesic segment between two (lat, lon) coordinates using 3D spherical slerp.
 * Safely crosses the ±180° Ross Sea anti-meridian and the -90° South Pole without horizontal tearing.
 */
export function densifyGreatCircle(
  start: { lat: number; lon: number },
  end: { lat: number; lon: number },
  maxStepDeg = 1.25
): Array<{ lat: number; lon: number }> {
  const toUnitVec = (lat: number, lon: number): [number, number, number] => {
    const phi = (lat * Math.PI) / 180;
    const lam = (lon * Math.PI) / 180;
    const cosPhi = Math.cos(phi);
    return [cosPhi * Math.cos(lam), cosPhi * Math.sin(lam), Math.sin(phi)];
  };

  const v0 = toUnitVec(start.lat, start.lon);
  const v1 = toUnitVec(end.lat, end.lon);
  const dot = Math.max(-1, Math.min(1, v0[0] * v1[0] + v0[1] * v1[1] + v0[2] * v1[2]));
  const omega = Math.acos(dot);
  const arcDeg = (omega * 180) / Math.PI;

  if (arcDeg < 1e-5) {
    return [{ ...start }, { ...end }];
  }

  const steps = Math.max(1, Math.ceil(arcDeg / Math.max(0.1, maxStepDeg)));
  const sinOmega = Math.sin(omega);
  const result: Array<{ lat: number; lon: number }> = [];

  for (let i = 0; i <= steps; i++) {
    const f = i / steps;
    let x: number;
    let y: number;
    let z: number;

    if (sinOmega < 1e-6) {
      x = (1 - f) * v0[0] + f * v1[0];
      y = (1 - f) * v0[1] + f * v1[1];
      z = (1 - f) * v0[2] + f * v1[2];
    } else {
      const a = Math.sin((1 - f) * omega) / sinOmega;
      const b = Math.sin(f * omega) / sinOmega;
      x = a * v0[0] + b * v1[0];
      y = a * v0[1] + b * v1[1];
      z = a * v0[2] + b * v1[2];
    }

    const norm = Math.hypot(x, y, z) || 1;
    const lat = (Math.asin(Math.max(-1, Math.min(1, z / norm))) * 180) / Math.PI;
    const lon = (Math.atan2(y, x) * 180) / Math.PI;
    result.push({ lat, lon });
  }

  return result;
}

/**
 * Bilinearly interpolates [surfaceElevationM, bedElevationM, iceThicknessM] at planar EPSG:3031 (x, y) meters.
 */
export function interpolateBedmapPoint(
  grid: SubglacialBedmapGrid,
  xMeters: number,
  yMeters: number
): { surfaceElevationM: number; bedElevationM: number; iceThicknessM: number } {
  const { min, max, step } = grid.gridBoundsKm;
  const maxIndex = Math.round((max - min) / step);

  const xKm = Math.max(min, Math.min(max, xMeters / 1000));
  const yKm = Math.max(min, Math.min(max, yMeters / 1000));

  const gx = (xKm - min) / step;
  const gy = (yKm - min) / step;

  const x0 = Math.max(0, Math.min(maxIndex - 1, Math.floor(gx)));
  const y0 = Math.max(0, Math.min(maxIndex - 1, Math.floor(gy)));
  const x1 = Math.min(maxIndex, x0 + 1);
  const y1 = Math.min(maxIndex, y0 + 1);

  const tx = Math.max(0, Math.min(1, gx - x0));
  const ty = Math.max(0, Math.min(1, gy - y0));

  const c00 = grid.rows[y0][x0];
  const c10 = grid.rows[y0][x1];
  const c01 = grid.rows[y1][x0];
  const c11 = grid.rows[y1][x1];

  const bilerp = (idx: 0 | 1) => {
    const top = c00[idx] * (1 - tx) + c10[idx] * tx;
    const bottom = c01[idx] * (1 - tx) + c11[idx] * tx;
    return top * (1 - ty) + bottom * ty;
  };

  const surfaceElevationM = Math.round(bilerp(0));
  const bedElevationM = Math.round(bilerp(1));
  const iceThicknessM = surfaceElevationM > 0 ? Math.max(0, surfaceElevationM - bedElevationM) : 0;

  return { surfaceElevationM, bedElevationM, iceThicknessM };
}

/**
 * Samples a two-point Antarctic transect uniformly in EPSG:3031 Euclidean planar distance (NOT linear lat/lon).
 * Flags marine-based ice sheet grounding zones where bedElevationM < 0 and iceThicknessM > 0.
 */
export function sampleSubglacialTransect(
  grid: SubglacialBedmapGrid,
  pointA: { lat: number; lon: number },
  pointB: { lat: number; lon: number },
  sampleCount = 160
): TransectSamplePoint[] {
  const count = Math.max(2, sampleCount);
  const pA = wgs84ToEpsg3031(pointA.lat, pointA.lon);
  const pB = wgs84ToEpsg3031(pointB.lat, pointB.lon);
  const totalMeters = Math.hypot(pB.x - pA.x, pB.y - pA.y);

  const samples: TransectSamplePoint[] = [];

  for (let i = 0; i < count; i++) {
    const t = i / (count - 1);
    const x = pA.x + (pB.x - pA.x) * t;
    const y = pA.y + (pB.y - pA.y) * t;
    const { lat, lon } = epsg3031ToWgs84(x, y);
    const { surfaceElevationM, bedElevationM, iceThicknessM } = interpolateBedmapPoint(
      grid,
      x,
      y
    );

    samples.push({
      index: i,
      distanceKm: Math.round(((totalMeters * t) / 1000) * 10) / 10,
      x: Math.round(x),
      y: Math.round(y),
      lat: Math.round(lat * 10000) / 10000,
      lon: Math.round(lon * 10000) / 10000,
      surfaceElevationM,
      bedElevationM,
      iceThicknessM,
      isMarineBasedIceSheet: bedElevationM < 0 && iceThicknessM > 0
    });
  }

  return samples;
}

/**
 * Standard NWS / Environment Canada Polar Wind Chill index (°C).
 */
export function computeWindChillC(tempC: number, windSpeedKmh: number): number {
  if (tempC > 10 || windSpeedKmh <= 4.8) {
    return Math.round(tempC * 10) / 10;
  }
  const vPow = Math.pow(windSpeedKmh, 0.16);
  const wc = 13.12 + 0.6215 * tempC - 11.37 * vPow + 0.3965 * tempC * vPow;
  return Math.round(wc * 10) / 10;
}

export function classifyKatabaticTier(gustKmh: number): 'nominal' | 'watch' | 'severe' {
  if (gustKmh > 102) return 'severe';
  if (gustKmh >= 65) return 'watch';
  return 'nominal';
}

export function classifyDrakeSeaState(waveHeightM: number): {
  tier: 1 | 2 | 3 | 4 | 5;
  code:
    | 'DRAKE_LAKE'
    | 'GENTLE_SWELL'
    | 'CLASSIC_ROLL'
    | 'DRAKE_SHAKE'
    | 'EXTREME_TEMPEST';
} {
  if (waveHeightM < 2.0) return { tier: 1, code: 'DRAKE_LAKE' };
  if (waveHeightM < 3.5) return { tier: 2, code: 'GENTLE_SWELL' };
  if (waveHeightM < 5.5) return { tier: 3, code: 'CLASSIC_ROLL' };
  if (waveHeightM < 8.0) return { tier: 4, code: 'DRAKE_SHAKE' };
  return { tier: 5, code: 'EXTREME_TEMPEST' };
}

/**
 * Computes the subsolar geographic coordinates (solar declination lat & UTC subsolar lon)
 * and local solar altitude angle for real-time 3D/2D polar day/night terminator rendering.
 */
export function computeSubsolarPoint(date: Date = new Date()): {
  declinationDeg: number;
  subsolarLonDeg: number;
} {
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = (date.getTime() - startOfYear) / 86400000;
  const declinationDeg = -23.44 * Math.cos(((2 * Math.PI) / 365.24) * (dayOfYear + 10));
  const utcHours =
    date.getUTCHours() + date.getUTCMinutes() / 60 + date.getUTCSeconds() / 3600;
  let subsolarLonDeg = (12 - utcHours) * 15;
  if (subsolarLonDeg > 180) subsolarLonDeg -= 360;
  if (subsolarLonDeg < -180) subsolarLonDeg += 360;
  return { declinationDeg, subsolarLonDeg };
}

export function computeSolarAltitudeDeg(
  latDeg: number,
  lonDeg: number,
  date: Date = new Date()
): number {
  const { declinationDeg, subsolarLonDeg } = computeSubsolarPoint(date);
  const latRad = (latDeg * Math.PI) / 180;
  const decRad = (declinationDeg * Math.PI) / 180;
  const hourAngleRad = ((lonDeg - subsolarLonDeg) * Math.PI) / 180;
  const sinAlt =
    Math.sin(latRad) * Math.sin(decRad) +
    Math.cos(latRad) * Math.cos(decRad) * Math.cos(hourAngleRad);
  return (Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180) / Math.PI;
}

/**
 * Computes Antarctic solar regime (polar day, polar night, or exact daylight hours).
 */
export function computePolarSolarState(
  latDeg: number,
  date: Date = new Date()
): { regime: 'polar-day' | 'polar-night' | 'diurnal'; daylightHours: number } {
  const startOfYear = Date.UTC(date.getUTCFullYear(), 0, 0);
  const dayOfYear = Math.floor((date.getTime() - startOfYear) / 86400000);
  const declRad =
    ((-23.44 * Math.PI) / 180) *
    Math.cos(((2 * Math.PI) / 365) * (dayOfYear + 10));
  const latRad = (latDeg * Math.PI) / 180;

  // Include atmospheric refraction (-0.833 deg)
  const zenithRad = ((90 + 0.833) * Math.PI) / 180;
  const cosH =
    (Math.cos(zenithRad) - Math.sin(latRad) * Math.sin(declRad)) /
    (Math.cos(latRad) * Math.cos(declRad));

  if (cosH <= -1) {
    return { regime: 'polar-day', daylightHours: 24 };
  }
  if (cosH >= 1) {
    return { regime: 'polar-night', daylightHours: 0 };
  }
  const hours = ((2 * Math.acos(cosH)) * 180) / (Math.PI * 15);
  return {
    regime: 'diurnal',
    daylightHours: Math.round(hours * 10) / 10
  };
}
