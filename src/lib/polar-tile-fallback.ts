import {
  interpolateBedmapPoint,
  NASA_GIBS_EPSG3031_CONFIG
} from './polar-math.ts';
import type { PolarBaseLayer, SubglacialBedmapGrid } from './types.ts';

export interface TileBoundsMeters {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

/**
 * Computes the exact planar EPSG:3031 bounding box in meters for a NASA GIBS WMTS tile (z, x, y).
 */
export function computeEpsg3031TileBoundsMeters(
  z: number,
  x: number,
  y: number
): TileBoundsMeters {
  const clampedZ = Math.max(
    0,
    Math.min(NASA_GIBS_EPSG3031_CONFIG.resolutions.length - 1, Math.floor(z))
  );
  const res = NASA_GIBS_EPSG3031_CONFIG.resolutions[clampedZ];
  const spanMeters = NASA_GIBS_EPSG3031_CONFIG.tileSize * res;
  const [originX, originY] = NASA_GIBS_EPSG3031_CONFIG.origin;

  const minX = originX + x * spanMeters;
  const maxX = minX + spanMeters;
  const maxY = originY - y * spanMeters;
  const minY = maxY - spanMeters;

  return { minX, maxX, minY, maxY };
}

/**
 * Computes color RGB tuple for low-resolution blurred fallback polar tile pixels
 * based on Bedmap3 elevation/bathymetry (or radial polar cap approximation before grid loads).
 */
export function samplePolarFallbackPixelRgb(
  xMeters: number,
  yMeters: number,
  bedmapGrid: SubglacialBedmapGrid | null,
  baseLayer: PolarBaseLayer
): [number, number, number] {
  if (bedmapGrid && Math.abs(xMeters) <= 2_800_000 && Math.abs(yMeters) <= 2_800_000) {
    const { surfaceElevationM, bedElevationM, iceThicknessM } = interpolateBedmapPoint(
      bedmapGrid,
      xMeters,
      yMeters
    );

    if (surfaceElevationM > 40 || iceThicknessM > 30) {
      // Continental ice sheet & ice shelves — brighter snowy tones for MODIS, cryo-blue for BlueMarble
      const norm = Math.min(1, surfaceElevationM / 3600);
      if (baseLayer === 'gibs-modis') {
        return [
          Math.round(188 + norm * 56),
          Math.round(212 + norm * 38),
          Math.round(232 + norm * 22)
        ];
      }
      return [
        Math.round(145 + norm * 85),
        Math.round(188 + norm * 55),
        Math.round(222 + norm * 30)
      ];
    }

    // Southern Ocean bathymetry gradient
    const depthFactor = Math.max(0, Math.min(1, Math.abs(bedElevationM) / 4200));
    return [
      Math.round(14 - depthFactor * 8),
      Math.round(48 - depthFactor * 24),
      Math.round(86 - depthFactor * 36)
    ];
  }

  // Outer Southern Ocean radial gradient
  const rhoKm = Math.hypot(xMeters, yMeters) / 1000;
  if (rhoKm < 1950) {
    return [165, 202, 230];
  }
  const oceanFade = Math.min(1, (rhoKm - 1950) / 2600);
  return [
    Math.round(12 - oceanFade * 6),
    Math.round(38 - oceanFade * 16),
    Math.round(70 - oceanFade * 26)
  ];
}

const fallbackDataUrlMemo = new Map<string, string>();

/**
 * Generates a lightweight 24x24 DataURI raster aligned to the exact EPSG:3031 tile bounds,
 * designed to be rendered with CSS Gaussian blur (`blur(8px)`) when a live WMTS tile is
 * loading, rate-limited, offline, or expired — eliminating jarring black/blank tile holes.
 */
export function buildBlurredFallbackTileDataUrl(
  z: number,
  x: number,
  y: number,
  bedmapGrid: SubglacialBedmapGrid | null,
  baseLayer: PolarBaseLayer
): string {
  if (typeof document === 'undefined') return '';

  const gridTag = bedmapGrid ? 'grid' : 'nogrid';
  const cacheKey = `${baseLayer}:${gridTag}:${z}:${x}:${y}`;
  const hit = fallbackDataUrlMemo.get(cacheKey);
  if (hit) return hit;

  const sizePx = 24;
  const canvas = document.createElement('canvas');
  canvas.width = sizePx;
  canvas.height = sizePx;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const bounds = computeEpsg3031TileBoundsMeters(z, x, y);
  const imgData = ctx.createImageData(sizePx, sizePx);

  for (let py = 0; py < sizePx; py++) {
    const fy = (py + 0.5) / sizePx;
    const yMeters = bounds.maxY - fy * (bounds.maxY - bounds.minY);
    for (let px = 0; px < sizePx; px++) {
      const fx = (px + 0.5) / sizePx;
      const xMeters = bounds.minX + fx * (bounds.maxX - bounds.minX);
      const [r, g, b] = samplePolarFallbackPixelRgb(
        xMeters,
        yMeters,
        bedmapGrid,
        baseLayer
      );
      const offset = (py * sizePx + px) * 4;
      imgData.data[offset] = r;
      imgData.data[offset + 1] = g;
      imgData.data[offset + 2] = b;
      imgData.data[offset + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);
  const dataUrl = canvas.toDataURL('image/png');

  if (fallbackDataUrlMemo.size > 240) {
    const oldest = fallbackDataUrlMemo.keys().next().value;
    if (oldest) fallbackDataUrlMemo.delete(oldest);
  }
  fallbackDataUrlMemo.set(cacheKey, dataUrl);
  return dataUrl;
}
