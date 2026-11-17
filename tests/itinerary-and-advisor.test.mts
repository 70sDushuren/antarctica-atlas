import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { describe, it } from 'node:test';
import { fileURLToPath } from 'node:url';

import {
  computeSegmentDifficultyAndAdvice,
  evaluateExpeditionItinerary
} from '../src/lib/itinerary/hiking-advisor-engine.ts';
import {
  exportWaypointsToGpx,
  matchPolarPlaceByName,
  parseCsvToWaypoints,
  parseFreeTextItinerary,
  parseGeoJsonToWaypoints,
  parseGpxToWaypoints,
  parseKmlToWaypoints
} from '../src/lib/itinerary/importers.ts';
import {
  anonymizeVisitorHash,
  extractSafeReferrerHost,
  maskClientIpSubnet,
  parseUserAgentSummary
} from '../src/lib/telemetry/privacy.ts';
import type { SubglacialBedmapGrid } from '../src/lib/types.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..');

describe('V2.0 Three-in-One Zero-Key Route Importers & GPX Exporter', () => {
  it('parses GPX waypoints/tracks and exports valid round-trip GPX 1.1 XML', () => {
    const sampleGpx = `<?xml version="1.0" encoding="UTF-8"?>
      <gpx version="1.1">
        <wpt lat="-64.8439" lon="-62.5319">
          <ele>135</ele>
          <name>Neko Harbour Ridge Hike</name>
          <time>2026-12-18T10:00:00Z</time>
        </wpt>
        <wpt lat="-64.8253" lon="-63.4944">
          <ele>20</ele>
          <name>Port Lockroy Zodiac Landing</name>
          <time>2026-12-19T13:00:00Z</time>
        </wpt>
      </gpx>`;

    const wps = parseGpxToWaypoints(sampleGpx);
    assert.equal(wps.length, 2);
    assert.equal(wps[0].activityType, 'hiking');
    assert.equal(wps[0].plannedDate, '2026-12-18');
    assert.equal(wps[0].elevationM, 135);
    assert.equal(wps[1].activityType, 'zodiac-landing');

    const exported = exportWaypointsToGpx('Peninsula Trek', wps);
    assert.match(exported, /<gpx version="1\.1"/);
    assert.match(exported, /Neko Harbour Ridge Hike/);
    const reparsed = parseGpxToWaypoints(exported);
    assert.ok(reparsed.length >= 2);
  });

  it('parses GeoJSON LineString & KML Placemarks including ±180° Ross Sea coordinates', () => {
    const geojson = JSON.stringify({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: { name: 'Ross Anti-Meridian Hike', activity: 'hiking' },
          geometry: {
            type: 'LineString',
            coordinates: [
              [179.2, -77.5, 40],
              [-179.4, -77.6, 180]
            ]
          }
        }
      ]
    });

    const gjWps = parseGeoJsonToWaypoints(geojson);
    assert.equal(gjWps.length, 2);
    assert.equal(gjWps[0].lon, 179.2);
    assert.equal(gjWps[1].lon, -179.4);

    const kml = `<kml><Document><Placemark><name>Half Moon Walk</name><Point><coordinates>-59.9194,-62.5944,35</coordinates></Point></Placemark></Document></kml>`;
    const kmlWps = parseKmlToWaypoints(kml);
    assert.equal(kmlWps.length, 1);
    assert.ok(Math.abs(kmlWps[0].lat - -62.5944) < 0.001);
  });

  it('auto-geocodes CSV rows missing Lat/Lon across English and Chinese place names', () => {
    const csv = [
      'Day,Date,Place,Lat,Lon,Activity',
      '1,2026-12-10,Ushuaia,,,cruise',
      '4,2026-12-13,尼科港,,,雪坡徒步',
      '5,2026-12-14,欺骗岛,,,hiking'
    ].join('\n');

    const wps = parseCsvToWaypoints(csv);
    assert.equal(wps.length, 3);
    assert.ok(wps[0].lat < -54 && wps[0].lat > -55.5);
    assert.ok(Math.abs(wps[1].lat - -64.8439) < 0.05);
    assert.equal(wps[1].activityType, 'hiking');
    assert.ok(Math.abs(wps[2].lat - -62.9794) < 0.05);
  });

  it('extracts ordered polar waypoints from pasted multilingual agency schedules (zh/yue/es/en)', () => {
    const cnSchedule = `
      第1天：乌斯怀亚登船启航
      第2天：穿越德雷克海峡
      第4天：尼科港冲锋舟登陆与雪坡徒步
      第5天：探访长城站与半月岛漫步
    `;
    const matchedCn = parseFreeTextItinerary(cnSchedule, '2026-12-01');
    assert.ok(matchedCn.length >= 4, `Expected >=4 stops, got ${matchedCn.length}`);
    assert.equal(matchedCn[0].plannedDate, '2026-12-01');
    assert.equal(matchedCn[2].plannedDate, '2026-12-04');

    const esHit = matchPolarPlaceByName('Isla Decepción');
    assert.ok(esHit);
    assert.equal(esHit.id, 'landing:whalers-bay-deception');
  });
});

describe('V2.0 Polar Hiking & Landing Difficulty + Travel Hacks Engine', () => {
  const gridPath = path.join(ROOT_DIR, 'public', 'geo-data', 'subglacial-bedmap-grid.json');
  const bedmapGrid = JSON.parse(fs.readFileSync(gridPath, 'utf8')) as SubglacialBedmapGrid;

  it('escalates immediately to T5 (Extreme / Suspend) when Katabatic gusts >= 65 km/h or Drake waves >= 5.5 m', () => {
    const galeCheck = computeSegmentDifficultyAndAdvice({
      activityType: 'zodiac-landing',
      lat: -64.8,
      maxElevationM: 40,
      elevationGainM: 30,
      maxSlopeDeg: 7,
      surfaceType: 'coastal-rock-ash',
      isCrevasseZone: false,
      month: 12,
      windChillC: -12,
      gustKmh: 78, // > 65 km/h (35 kt) Zodiac suspension redline
      solarRegime: 'polar-day'
    });
    assert.equal(galeCheck.tier, 5);
    assert.ok(galeCheck.hackKeys.includes('morning_katabatic_window'));

    const drakeShakeCheck = computeSegmentDifficultyAndAdvice({
      activityType: 'cruise',
      lat: -58.5,
      maxElevationM: 0,
      elevationGainM: 0,
      maxSlopeDeg: 0,
      surfaceType: 'open-water',
      isCrevasseZone: false,
      month: 12,
      windChillC: -4,
      gustKmh: 50,
      waveHeightM: 6.4, // Drake Shake Tier 4 (>= 5.5 m)
      solarRegime: 'diurnal'
    });
    assert.equal(drakeShakeCheck.tier, 5);
    assert.ok(drakeShakeCheck.gearKeys.includes('seasickness_patch'));
  });

  it('evaluates full multi-segment peninsula vs high-plateau treks with dual-axis profile samples', () => {
    const waypoints = parseFreeTextItinerary(
      'Day 1 Ushuaia\nDay 2 Drake Passage\nDay 4 Neko Harbour hike\nDay 6 Mount Vinson climb',
      '2027-01-10'
    );
    assert.equal(waypoints.length, 4);

    const report = evaluateExpeditionItinerary({
      waypoints,
      bedmapGrid,
      simulateLiveNow: false,
      referenceNow: new Date('2026-11-17T12:00:00Z')
    });

    assert.equal(report.segments.length, 4);
    assert.equal(report.profileSamples.length, 4);
    assert.ok(report.totalDistanceKm > 2000);
    assert.ok(report.totalElevationGainM >= 1200);
    // Vinson Massif segment reaches T4 demanding glacial trek
    assert.ok(report.overallDifficultyTier >= 4);
    assert.ok(report.recommendedGearKeys.includes('glacier_crampons_harness'));
    assert.ok(report.topPolarHackKeys.includes('wet_landing_layering'));
  });
});

describe('V2.0 Privacy-Safe Access Log Hashing & Subnet Masking', () => {
  it('masks IPv4 to /24 and IPv6 to /48 while rejecting malformed strings', () => {
    assert.equal(maskClientIpSubnet('203.0.113.89, 10.0.0.1'), '203.0.113.0/24');
    assert.equal(maskClientIpSubnet('::ffff:198.51.100.42'), '198.51.100.0/24');
    assert.equal(
      maskClientIpSubnet('2001:0db8:85a3:0042:0000:8a2e:0370:7334'),
      '2001:0db8:85a3::/48'
    );
    assert.equal(maskClientIpSubnet('not-an-ip'), null);
  });

  it('rotates irreversible visitor hashes daily while keeping intra-day UV stable', () => {
    const h1 = anonymizeVisitorHash(
      '203.0.113.89',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/130.0',
      new Date('2026-11-17T08:00:00Z')
    );
    const h2 = anonymizeVisitorHash(
      '203.0.113.89',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/130.0',
      new Date('2026-11-17T22:30:00Z')
    );
    const hNextDay = anonymizeVisitorHash(
      '203.0.113.89',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X) Chrome/130.0',
      new Date('2026-11-18T00:05:00Z')
    );

    assert.equal(h1.length, 20);
    assert.equal(h1, h2);
    assert.notEqual(h1, hNextDay);

    const ua = parseUserAgentSummary('Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) Version/18.0 Mobile Safari/604.1');
    assert.equal(ua.deviceType, 'mobile');
    assert.equal(ua.osFamily, 'iOS');
    assert.equal(extractSafeReferrerHost('https://www.scar.org/antarctica/maps?ref=1'), 'www.scar.org');
  });
});
