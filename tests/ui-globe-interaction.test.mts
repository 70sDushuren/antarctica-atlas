import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  clampPolarGlobeLatDeg,
  DEFAULT_ATLAS_URL_STATE,
  normalizeLongitudeDeg,
  parseAtlasUrlState,
  resolveInitialAtlasState,
  safeReplaceUrlQuery,
  serializeAtlasUrlState
} from '../src/lib/atlas-url-core.ts';
import {
  CLIENT_SYNC_FRESH_WINDOW_MS,
  persistTelemetrySnapshot,
  readCachedOrBaselineTelemetry
} from '../src/lib/telemetry-client-swr.ts';
import {
  computeEpsg3031TileBoundsMeters,
  samplePolarFallbackPixelRgb
} from '../src/lib/polar-tile-fallback.ts';
import { getOrAsyncRefreshServerTelemetry } from '../src/lib/server-telemetry-cache.ts';
import type { SubglacialBedmapGrid } from '../src/lib/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

describe('UI Acceptance Regression: 3D Globe Drag Rotation & State Recovery', () => {
  it('keeps longitude strictly within [-180, 180] across aggressive multi-turn 3D globe drags', () => {
    const startLon = -58.96;
    for (let dx = -4000; dx <= 4000; dx += 17) {
      const nextLon = normalizeLongitudeDeg(startLon - dx * 0.35);
      assert.ok(
        Number.isFinite(nextLon) && nextLon >= -180 && nextLon <= 180,
        `Out-of-bounds longitude ${nextLon} at dx=${dx}`
      );
    }

    assert.equal(normalizeLongitudeDeg(-185), 175);
    assert.equal(normalizeLongitudeDeg(-545), 175);
    assert.equal(normalizeLongitudeDeg(185), -175);
    assert.equal(clampPolarGlobeLatDeg(-120), -90);
    assert.equal(clampPolarGlobeLatDeg(15), -25);
  });

  it('never crashes when browser history.replaceState throws WebKit/Blink rate-limit SecurityError', () => {
    const originalWindow = (globalThis as Record<string, unknown>).window;
    let calls = 0;

    try {
      (globalThis as Record<string, unknown>).window = {
        location: { pathname: '/zh-CN', search: '' },
        history: {
          state: {},
          replaceState() {
            calls += 1;
            if (calls > 5) {
              const err = new Error(
                'Attempt to use history.replaceState() more than 100 times per 10 seconds'
              );
              err.name = 'SecurityError';
              throw err;
            }
          }
        }
      };

      let survivedAll = true;
      for (let i = 0; i < 200; i++) {
        try {
          safeReplaceUrlQuery(
            '/zh-CN',
            `mode=3d&lat=-75.1000&lon=${normalizeLongitudeDeg(i * 7)}`
          );
        } catch {
          survivedAll = false;
        }
      }

      assert.equal(survivedAll, true, 'safeReplaceUrlQuery must never leak SecurityError');
      assert.ok(calls >= 6);
    } finally {
      if (originalWindow === undefined) {
        delete (globalThis as Record<string, unknown>).window;
      } else {
        (globalThis as Record<string, unknown>).window = originalWindow;
      }
    }
  });

  it('restores exact rotated camera coordinates on remount/recovery instead of jumping to start position', () => {
    const rotatedState = {
      ...DEFAULT_ATLAS_URL_STATE,
      mode: '3d' as const,
      tab: 'geology' as const,
      peel: 68,
      centerLat: -77.85,
      centerLon: 166.67,
      zoom: 4.5
    };
    const serialized = serializeAtlasUrlState(rotatedState);

    const recoveredFromUrl = resolveInitialAtlasState(
      new URLSearchParams(''),
      `?${serialized}`,
      null
    );
    assert.equal(recoveredFromUrl.centerLat, -77.85);
    assert.equal(recoveredFromUrl.centerLon, 166.67);
    assert.equal(recoveredFromUrl.zoom, 4.5);
    assert.equal(recoveredFromUrl.tab, 'geology');
    assert.equal(recoveredFromUrl.peel, 68);

    const recoveredFromSession = resolveInitialAtlasState(
      new URLSearchParams(''),
      '',
      serialized
    );
    assert.equal(recoveredFromSession.centerLat, -77.85);
    assert.equal(recoveredFromSession.centerLon, 166.67);
    assert.equal(recoveredFromSession.zoom, 4.5);
    assert.notEqual(recoveredFromSession.centerLat, DEFAULT_ATLAS_URL_STATE.centerLat);

    const parsedWrapped = parseAtlasUrlState(
      new URLSearchParams('mode=3d&lat=-75.0&lon=-215.0&zoom=4')
    );
    assert.equal(parsedWrapped.centerLon, 145);
  });
});

describe('Baseline-First Async SWR Telemetry Cache & Rate-Limit Protection', () => {
  it('serves full 18-station baseline on cold boot and reuses cached valid window without wasted syncs', () => {
    const mockMap = new Map<string, string>();
    const mockStorage = {
      getItem: (k: string) => mockMap.get(k) ?? null,
      setItem: (k: string, v: string) => {
        mockMap.set(k, v);
      }
    };

    const t0 = 1_760_000_000_000;
    const cold = readCachedOrBaselineTelemetry(mockStorage, t0);
    assert.equal(cold.snapshot.source, 'embedded-baseline');
    assert.equal(cold.snapshot.weatherList.length, 18);
    assert.equal(cold.snapshot.marineList.length, 6);
    assert.equal(cold.needsBackgroundSync, true);

    // Save a valid live snapshot with a custom temperature marker
    const customSnapshot = {
      ...cold.snapshot,
      syncedAtMs: t0,
      source: 'live-async-sync' as const,
      weatherList: cold.snapshot.weatherList.map((w, idx) =>
        idx === 0 ? { ...w, temperature2mC: -33.7, isFallback: false } : w
      )
    };
    persistTelemetrySnapshot(customSnapshot, mockStorage);

    // Within 15-minute window -> zero background sync required, serves cached valid window
    const warmFresh = readCachedOrBaselineTelemetry(mockStorage, t0 + 5 * 60_000);
    assert.equal(warmFresh.snapshot.source, 'cached-valid-window');
    assert.equal(warmFresh.snapshot.weatherList[0].temperature2mC, -33.7);
    assert.equal(warmFresh.needsBackgroundSync, false);

    // Past 15-minute window -> still serves previous valid dataset immediately as baseline, flags async refresh
    const warmExpired = readCachedOrBaselineTelemetry(
      mockStorage,
      t0 + CLIENT_SYNC_FRESH_WINDOW_MS + 10_000
    );
    assert.equal(warmExpired.snapshot.source, 'cached-valid-window');
    assert.equal(warmExpired.snapshot.weatherList[0].temperature2mC, -33.7);
    assert.equal(warmExpired.needsBackgroundSync, true);
  });

  it('deduplicates concurrent server refreshes into a single non-blocking background fetch', async () => {
    let upstreamCalls = 0;
    const key = `unit-test-swr-${Date.now()}`;

    const callEndpoint = () =>
      getOrAsyncRefreshServerTelemetry({
        key,
        freshTtlMs: 60_000,
        buildBaseline: () => ({ value: 'baseline-v1' }),
        fetchLive: async () => {
          upstreamCalls += 1;
          await new Promise((r) => setTimeout(r, 40));
          return { value: 'live-v2' };
        }
      });

    // Fire 25 concurrent requests; all 25 must return baseline immediately while only 1 upstream call runs
    const tStart = performance.now();
    const batch = await Promise.all(Array.from({ length: 25 }, () => callEndpoint()));
    const elapsed = performance.now() - tStart;

    assert.ok(elapsed < 25, `Expected non-blocking <25ms return, took ${elapsed.toFixed(1)}ms`);
    assert.equal(upstreamCalls, 1, 'Expected single-flight deduplication');
    assert.equal(batch[0].data.value, 'baseline-v1');

    // Wait for background refresh to complete, then verify subsequent reads get live-v2 with 0 new calls
    await new Promise((r) => setTimeout(r, 60));
    const afterSync = await callEndpoint();
    assert.equal(afterSync.data.value, 'live-v2');
    assert.equal(afterSync.cacheState, 'fresh');
    assert.equal(upstreamCalls, 1);
  });
});

describe('Resilient Blurred EPSG:3031 Tile Fallback Synthesis', () => {
  const gridPath = path.join(ROOT_DIR, 'public', 'geo-data', 'subglacial-bedmap-grid.json');
  const bedmapGrid = JSON.parse(fs.readFileSync(gridPath, 'utf8')) as SubglacialBedmapGrid;

  it('computes exact NASA GIBS EPSG:3031 WMTS tile bounds and contrasts ice-cap vs ocean fallback pixels', () => {
    const z0Tile = computeEpsg3031TileBoundsMeters(0, 0, 0);
    assert.equal(z0Tile.minX, -4_194_304);
    assert.equal(z0Tile.maxY, 4_194_304);
    assert.equal(z0Tile.maxX - z0Tile.minX, 512 * 8192);

    // South Pole (0, 0) sits on bright glacial ice sheet
    const poleRgb = samplePolarFallbackPixelRgb(0, 0, bedmapGrid, 'gibs-modis');
    // Outer Southern Ocean (3,200 km from pole) sits in deep marine blue
    const oceanRgb = samplePolarFallbackPixelRgb(3_200_000, 0, bedmapGrid, 'gibs-modis');

    assert.ok(poleRgb[0] > 180 && poleRgb[2] > 210, `Expected bright ice RGB at pole: ${poleRgb}`);
    assert.ok(oceanRgb[0] < 30 && oceanRgb[2] < 100, `Expected deep ocean RGB: ${oceanRgb}`);
  });
});
