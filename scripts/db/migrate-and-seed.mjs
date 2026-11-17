#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pg from 'pg';

import { POLAR_GEOLOGICAL_SITES } from '../../src/data/geology-and-gazetteer.ts';
import { FEATURED_HISTORIC_MONUMENTS } from '../../src/data/heritage-and-corridors.ts';
import { POLAR_LANDING_HOTSPOTS } from '../../src/data/polar-landing-gazetteer.ts';
import { POLAR_STATIONS } from '../../src/data/stations.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(__dirname, '..', '..');
const SQL_INIT_PATH = path.join(__dirname, 'init-postgis-and-views.sql');

async function main() {
  const connectionString =
    process.env.DIRECT_DATABASE_URL ||
    process.env.DATABASE_URL ||
    'postgresql://atlas:atlas_polar_dev_2026@localhost:5432/antarctica_atlas';

  const pool = new pg.Pool({
    connectionString,
    max: 4,
    ssl: connectionString.includes('neon.tech') ? { rejectUnauthorized: false } : undefined
  });

  try {
    const sqlText = fs.readFileSync(SQL_INIT_PATH, 'utf8');
    console.log('[db:migrate] Applying PostgreSQL + PostGIS DDL and BI Views...');
    await pool.query(sqlText);

    const anchors = [
      ...POLAR_STATIONS.map((s) => ({
        id: `station:${s.id}`,
        anchorType: 'station',
        code: s.code,
        region: s.region,
        nameI18n: s.name,
        summaryI18n: s.summary,
        elevationM: s.elevationM,
        lat: s.lat,
        lon: s.lon,
        sourceUrl: s.sourceUrl
      })),
      ...POLAR_GEOLOGICAL_SITES.map((g) => ({
        id: `geology:${g.id}`,
        anchorType: 'geology',
        code: g.category,
        region: g.lon < -30 && g.lon > -80 && g.lat > -72 ? 'antarctic-peninsula' : 'east-antarctica',
        nameI18n: g.name,
        summaryI18n: g.summary,
        elevationM: g.elevationOrDepthM,
        lat: g.lat,
        lon: g.lon,
        sourceUrl: g.sourceUrl
      })),
      ...FEATURED_HISTORIC_MONUMENTS.map((h) => ({
        id: `hsm:${h.id}`,
        anchorType: 'hsm',
        code: h.hsmCode,
        region: h.lon < 0 ? 'antarctic-peninsula' : 'ross-sea-sector',
        nameI18n: h.title,
        summaryI18n: h.summary,
        elevationM: 15,
        lat: h.lat,
        lon: h.lon,
        sourceUrl: h.sourceUrl
      })),
      ...POLAR_LANDING_HOTSPOTS.map((l) => ({
        id: `landing:${l.id}`,
        anchorType: 'landing',
        code: l.terrainType,
        region: l.region,
        nameI18n: l.name,
        summaryI18n: l.summary,
        elevationM: l.typicalElevationGainM,
        lat: l.lat,
        lon: l.lon,
        sourceUrl: l.sourceUrl
      }))
    ];

    console.log(`[db:migrate] Seeding ${anchors.length} PostGIS spatial anchors (SRID 4326 + SRID 3031)...`);
    for (const a of anchors) {
      await pool.query(
        `INSERT INTO polar_spatial_anchors
          (id, anchor_type, code, region, name_i18n, summary_i18n, elevation_m, lat, lon, geom_4326, geom_3031, source_url, updated_at)
         VALUES (
          $1, $2, $3, $4, $5::jsonb, $6::jsonb, $7, $8, $9,
          ST_SetSRID(ST_MakePoint($9, $8), 4326),
          ST_Transform(ST_SetSRID(ST_MakePoint($9, $8), 4326), 3031),
          $10, NOW()
         )
         ON CONFLICT (id) DO UPDATE SET
          name_i18n = EXCLUDED.name_i18n,
          summary_i18n = EXCLUDED.summary_i18n,
          elevation_m = EXCLUDED.elevation_m,
          lat = EXCLUDED.lat,
          lon = EXCLUDED.lon,
          geom_4326 = EXCLUDED.geom_4326,
          geom_3031 = EXCLUDED.geom_3031,
          updated_at = NOW();`,
        [
          a.id,
          a.anchorType,
          a.code,
          a.region,
          JSON.stringify(a.nameI18n),
          JSON.stringify(a.summaryI18n),
          a.elevationM,
          a.lat,
          a.lon,
          a.sourceUrl
        ]
      );
    }

    const { rows } = await pool.query('SELECT PostGIS_Full_Version() AS ver;');
    console.log(`[db:ok] PostGIS ready: ${rows[0]?.ver?.slice(0, 80)}...`);
    console.log(`[db:ok] Root workspace: ${ROOT_DIR}`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('[db:error] Migration failed:', err.message);
  process.exit(1);
});
