import fs from 'node:fs';
import path from 'node:path';
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/auth/server';
import { atlasDbRepository } from '@/lib/db';
import {
  evaluateExpeditionItinerary,
  type LiveWaypointWeatherInput
} from '@/lib/itinerary/hiking-advisor-engine';
import { buildOpenMeteoUrl } from '@/lib/open-meteo-endpoint';
import type {
  NearbySpatialAnchor,
  SubglacialBedmapGrid,
  UserItineraryWaypoint
} from '@/lib/types';

let cachedBedmapGrid: SubglacialBedmapGrid | null = null;

function getServerBedmapGrid(): SubglacialBedmapGrid | null {
  if (cachedBedmapGrid) return cachedBedmapGrid;
  try {
    const p = path.join(process.cwd(), 'public', 'geo-data', 'subglacial-bedmap-grid.json');
    cachedBedmapGrid = JSON.parse(fs.readFileSync(p, 'utf8')) as SubglacialBedmapGrid;
    return cachedBedmapGrid;
  } catch {
    return null;
  }
}

export async function POST(req: NextRequest) {
  const rawIp =
    req.headers.get('cf-connecting-ip') ||
    req.headers.get('x-forwarded-for') ||
    req.headers.get('x-real-ip');

  if (!checkRateLimit(`advisor:${rawIp || 'anon'}`, 30, 60_000)) {
    return NextResponse.json({ error: 'RATE_LIMITED' }, { status: 429 });
  }

  try {
    const body = (await req.json()) as {
      waypoints?: UserItineraryWaypoint[];
      simulateLiveNow?: boolean;
    };

    const waypoints = Array.isArray(body.waypoints) ? body.waypoints.slice(0, 28) : [];
    if (waypoints.length === 0) {
      return NextResponse.json({ error: 'EMPTY_WAYPOINTS' }, { status: 400 });
    }

    const validWaypoints = waypoints.filter(
      (w) =>
        w &&
        typeof w.lat === 'number' &&
        typeof w.lon === 'number' &&
        Number.isFinite(w.lat) &&
        Number.isFinite(w.lon) &&
        w.lat >= -90 &&
        w.lat <= 0 &&
        w.lon >= -180 &&
        w.lon <= 180
    );

    if (validWaypoints.length === 0) {
      return NextResponse.json(
        { error: 'WAYPOINTS_MUST_BE_SOUTHERN_HEMISPHERE' },
        { status: 400 }
      );
    }

    const simulateLiveNow = Boolean(body.simulateLiveNow);
    const now = new Date();
    const horizonMs = 15 * 86_400_000;

    // Determine whether we should query Open-Meteo live forecast for waypoints
    const firstDateStr = validWaypoints[0]?.plannedDate;
    const firstDateMs = firstDateStr ? Date.parse(`${firstDateStr}T12:00:00Z`) : NaN;
    const withinForecastHorizon =
      simulateLiveNow ||
      Number.isNaN(firstDateMs) ||
      (firstDateMs >= now.getTime() - 86_400_000 &&
        firstDateMs <= now.getTime() + horizonMs);

    const liveWeatherByIndex: Record<number, LiveWaypointWeatherInput> = {};

    if (withinForecastHorizon) {
      try {
        const lats = validWaypoints.map((w) => w.lat.toFixed(4)).join(',');
        const lons = validWaypoints.map((w) => w.lon.toFixed(4)).join(',');
        const forecastUrl = buildOpenMeteoUrl(
          'forecast',
          `latitude=${lats}&longitude=${lons}&current=temperature_2m,wind_speed_10m,wind_gusts_10m&wind_speed_unit=kmh&timezone=UTC`
        );
        const marineUrl = buildOpenMeteoUrl(
          'marine',
          `latitude=${lats}&longitude=${lons}&current=wave_height&timezone=UTC`
        );

        const [fRes, mRes] = await Promise.all([
          fetch(forecastUrl, { next: { revalidate: 900 } }),
          fetch(marineUrl, { next: { revalidate: 900 } }).catch(() => null)
        ]);

        if (fRes.ok) {
          const fRaw = await fRes.json();
          const fList = Array.isArray(fRaw) ? fRaw : [fRaw];
          const mRaw = mRes && mRes.ok ? await mRes.json().catch(() => null) : null;
          const mList = mRaw ? (Array.isArray(mRaw) ? mRaw : [mRaw]) : [];

          validWaypoints.forEach((_, idx) => {
            const cur = fList[idx]?.current;
            const mCur = mList[idx]?.current;
            if (
              cur &&
              typeof cur.temperature_2m === 'number' &&
              typeof cur.wind_speed_10m === 'number'
            ) {
              liveWeatherByIndex[idx] = {
                tempC: cur.temperature_2m,
                windSpeedKmh: cur.wind_speed_10m,
                gustKmh:
                  typeof cur.wind_gusts_10m === 'number'
                    ? cur.wind_gusts_10m
                    : cur.wind_speed_10m * 1.45,
                waveHeightM:
                  typeof mCur?.wave_height === 'number' ? mCur.wave_height : undefined
              };
            }
          });
        }
      } catch {
        // Gracefully fall back to seasonal polar climatology if upstream API times out
      }
    }

    // Query PostGIS ST_DWithin (or EPSG:3031 planar fallback) for nearby polar anchors
    const nearbyAnchorsByIndex: Record<number, NearbySpatialAnchor[]> = {};
    await Promise.all(
      validWaypoints.map(async (wp, idx) => {
        nearbyAnchorsByIndex[idx] = await atlasDbRepository.findNearbyPolarAnchors(
          wp.lat,
          wp.lon,
          185,
          3
        );
      })
    );

    const evaluation = evaluateExpeditionItinerary({
      waypoints: validWaypoints,
      bedmapGrid: getServerBedmapGrid(),
      liveWeatherByIndex,
      nearbyAnchorsByIndex,
      simulateLiveNow,
      referenceNow: now
    });

    return NextResponse.json({ evaluation });
  } catch {
    return NextResponse.json({ error: 'EVALUATION_FAILED' }, { status: 500 });
  }
}
