import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  classifyDrakeSeaState,
  classifyKatabaticTier,
  computePolarSolarState,
  computeSolarAltitudeDeg,
  computeSubsolarPoint,
  computeWindChillC,
  densifyGreatCircle,
  epsg3031ToWgs84,
  NASA_GIBS_EPSG3031_CONFIG,
  sampleSubglacialTransect,
  wgs84ToEcef,
  wgs84ToEpsg3031
} from '../src/lib/polar-math.ts';
import {
  formatPolarLength,
  formatPolarTemperature,
  formatPolarWindSpeed,
  kmhToKnots
} from '../src/lib/units-and-format.ts';
import type { SubglacialBedmapGrid } from '../src/lib/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

describe('Polar Stereographic (EPSG:3031) Golden Benchmarks', () => {
  it('maps Geographic South Pole (-90°, 0°) to exact planar origin (0, 0)', () => {
    const pt = wgs84ToEpsg3031(-90, 0);
    assert.equal(pt.x, 0);
    assert.equal(pt.y, 0);

    const inv = epsg3031ToWgs84(0, 0);
    assert.equal(inv.lat, -90);
    assert.equal(inv.lon, 0);
  });

  it('maps McMurdo Station (-77.8463°, 166.6682°) into (+X, -Y) Ross quadrant with < 0.001° inverse precision', () => {
    const pt = wgs84ToEpsg3031(-77.8463, 166.6682);
    assert.ok(pt.x > 290_000 && pt.x < 330_000, `Unexpected McMurdo X: ${pt.x}`);
    assert.ok(pt.y > -1_340_000 && pt.y < -1_280_000, `Unexpected McMurdo Y: ${pt.y}`);

    const inv = epsg3031ToWgs84(pt.x, pt.y);
    assert.ok(Math.abs(inv.lat - -77.8463) < 0.001);
    assert.ok(Math.abs(inv.lon - 166.6682) < 0.001);
  });

  it('maps Great Wall Station (-62.2163°, -58.9622°) into (-X, +Y) Peninsula quadrant', () => {
    const pt = wgs84ToEpsg3031(-62.2163, -58.9622);
    assert.ok(pt.x > -2_660_000 && pt.x < -2_560_000, `Unexpected Great Wall X: ${pt.x}`);
    assert.ok(pt.y > 1_520_000 && pt.y < 1_610_000, `Unexpected Great Wall Y: ${pt.y}`);
  });

  it('exposes canonical NASA GIBS EPSG:3031 WMTS tile grid parameters', () => {
    assert.deepEqual(NASA_GIBS_EPSG3031_CONFIG.origin, [-4194304, 4194304]);
    assert.equal(NASA_GIBS_EPSG3031_CONFIG.tileSize, 512);
    assert.equal(NASA_GIBS_EPSG3031_CONFIG.resolutions[0], 8192);
  });
});

describe('Anti-Meridian (±180° Ross Sea) & 3D ECEF Geodesic Safety', () => {
  it('densifies a Ross Sea track crossing 178°E -> -178°W along the short 4° arc without Mercator seam wrap', () => {
    const pts = densifyGreatCircle(
      { lat: -76.0, lon: 178.0 },
      { lat: -76.0, lon: -178.0 },
      0.5
    );
    assert.ok(pts.length >= 3);
    for (const p of pts) {
      // Every intermediate point must stay near ±180°, never swinging across 0° Prime Meridian
      assert.ok(Math.abs(p.lon) >= 177.5, `Anti-meridian wrap artifact at lon=${p.lon}`);
      assert.ok(p.lat < -75.5 && p.lat > -76.5);
    }
  });

  it('converts South Pole to negative Z axis in 3D ECEF space', () => {
    const pole = wgs84ToEcef(-90, 0, 2835);
    assert.ok(Math.abs(pole.x) < 1);
    assert.ok(Math.abs(pole.y) < 1);
    assert.ok(pole.z < -6_350_000);
  });
});

describe('Subglacial Bedmap3 Cross-Section Bilinear Interpolation', () => {
  const gridPath = path.join(ROOT_DIR, 'public', 'geo-data', 'subglacial-bedmap-grid.json');
  const grid = JSON.parse(fs.readFileSync(gridPath, 'utf8')) as SubglacialBedmapGrid;

  it('samples planar Euclidean transects and detects marine-based ice sheet grounding in West Antarctica', () => {
    // Transect from West Antarctica Bentley Subglacial Trench region (-80°S, -115°W) to East Antarctica Dome A (-80°S, 77°E)
    const samples = sampleSubglacialTransect(
      grid,
      { lat: -80.0, lon: -115.0 },
      { lat: -80.0, lon: 77.0 },
      80
    );

    assert.equal(samples.length, 80);
    assert.equal(samples[0].distanceKm, 0);
    assert.ok(samples[samples.length - 1].distanceKm > 1500);

    // West Antarctic end sits over deep sub-sea-level marine basin (Bentley Trench)
    const hasMarineGroundedIce = samples.some(
      (s) => s.isMarineBasedIceSheet && s.bedElevationM < -500 && s.iceThicknessM > 1000
    );
    assert.ok(hasMarineGroundedIce, 'Expected marine-based ice sheet detection in West Antarctica');

    // East Antarctic end sits over high cratonic plateau (> 2,500 m ice surface)
    const eastEnd = samples[samples.length - 1];
    assert.ok(eastEnd.surfaceElevationM > 2500);
    assert.ok(eastEnd.bedElevationM > 0);
  });

  it('executes 180-point continental cross-section profiling well under the 100ms Phase 2 SLA', () => {
    const t0 = performance.now();
    const samples = sampleSubglacialTransect(
      grid,
      { lat: -75.1, lon: -106.7 },
      { lat: -77.85, lon: 166.67 },
      180
    );
    const elapsedMs = performance.now() - t0;
    assert.equal(samples.length, 180);
    assert.ok(elapsedMs < 50, `Transect interpolation took ${elapsedMs.toFixed(2)}ms (expected < 50ms)`);
  });
});

describe('Polar Meteorology, Drake Sea-State & Locale Unit Formatting', () => {
  it('computes NWS polar wind chill and Katabatic gust tiers accurately', () => {
    // At -25°C and 40 km/h wind, wind chill should be significantly colder (~ -39.6°C)
    const wc = computeWindChillC(-25, 40);
    assert.ok(wc < -38 && wc > -41, `Unexpected wind chill: ${wc}`);
    assert.equal(computeWindChillC(12, 30), 12);

    assert.equal(classifyKatabaticTier(45), 'nominal');
    assert.equal(classifyKatabaticTier(75), 'watch');
    assert.equal(classifyKatabaticTier(115), 'severe');
  });

  it('classifies the 5-tier Drake Passage sea-state scale', () => {
    assert.equal(classifyDrakeSeaState(1.4).code, 'DRAKE_LAKE');
    assert.equal(classifyDrakeSeaState(2.8).code, 'GENTLE_SWELL');
    assert.equal(classifyDrakeSeaState(4.5).code, 'CLASSIC_ROLL');
    assert.equal(classifyDrakeSeaState(6.4).code, 'DRAKE_SHAKE');
    assert.equal(classifyDrakeSeaState(9.1).code, 'EXTREME_TEMPEST');
  });

  it('identifies 24h Polar Day in austral summer and 24h Polar Night in austral winter at 90°S', () => {
    const summer = computePolarSolarState(-90, new Date('2026-12-21T12:00:00Z'));
    const winter = computePolarSolarState(-90, new Date('2026-06-21T12:00:00Z'));
    assert.equal(summer.regime, 'polar-day');
    assert.equal(summer.daylightHours, 24);
    assert.equal(winter.regime, 'polar-night');
    assert.equal(winter.daylightHours, 0);

    const subsolar = computeSubsolarPoint(new Date('2026-12-21T12:00:00Z'));
    assert.ok(subsolar.declinationDeg < -22 && subsolar.declinationDeg >= -23.5);
    assert.ok(Math.abs(subsolar.subsolarLonDeg) < 2);

    const poleSunAlt = computeSolarAltitudeDeg(-90, 0, new Date('2026-12-21T12:00:00Z'));
    assert.ok(poleSunAlt > 22 && poleSunAlt < 24);
  });

  it('formats localized decimals (comma in es/pt vs dot in en/zh) and converts nautical knots', () => {
    assert.ok(Math.abs(kmhToKnots(18.52) - 10) < 0.001);
    assert.equal(formatPolarTemperature(-24.5, 'metric', 'en'), '-24.5 °C');
    assert.match(formatPolarTemperature(-24.5, 'metric', 'es'), /-24,5\s*°C/);
    assert.match(formatPolarTemperature(-24.5, 'metric', 'pt'), /-24,5\s*°C/);
    assert.equal(formatPolarWindSpeed(18.52, 'nautical', 'en'), '10.0 kt');
    assert.equal(formatPolarLength(100, 'imperial', 'en', 0), '328 ft');
  });
});
