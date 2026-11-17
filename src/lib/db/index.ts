import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';

import { POLAR_GEOLOGICAL_SITES } from '@/data/geology-and-gazetteer';
import { FEATURED_HISTORIC_MONUMENTS } from '@/data/heritage-and-corridors';
import { POLAR_LANDING_HOTSPOTS } from '@/data/polar-landing-gazetteer';
import { POLAR_STATIONS } from '@/data/stations';
import type { SupportedLocale } from '@/i18n/routing';
import { wgs84ToEpsg3031 } from '@/lib/polar-math';
import type {
  AuthenticatedUser,
  ItineraryEvaluationResult,
  ItineraryImportSourceType,
  MapViewMode,
  NearbySpatialAnchor,
  PolarHikingDifficultyTier,
  SavedUserItinerary,
  TelemetryEventInput,
  UnitSystem,
  UserItineraryWaypoint
} from '@/lib/types';
import * as schema from './schema';

const globalForPg = globalThis as unknown as {
  __atlasPgPool?: pg.Pool;
};

export function hasPostgresConnection(): boolean {
  return Boolean(process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL);
}

/**
 * Returns a singleton `pg.Pool` capped at 15 physical sockets per instance.
 * When pointed at PgBouncer (port 6432) or Neon Serverless `-pooler`,
 * 15 multiplexed backend connections comfortably serve 100–1,000+ concurrent HTTP clients.
 */
export function getPgPool(): pg.Pool | null {
  const connStr = process.env.DATABASE_URL || process.env.DIRECT_DATABASE_URL;
  if (!connStr) return null;

  if (!globalForPg.__atlasPgPool) {
    globalForPg.__atlasPgPool = new pg.Pool({
      connectionString: connStr,
      max: 15,
      idleTimeoutMillis: 20_000,
      connectionTimeoutMillis: 6_000,
      ssl:
        connStr.includes('neon.tech') || connStr.includes('sslmode=require')
          ? { rejectUnauthorized: false }
          : undefined
    });
  }
  return globalForPg.__atlasPgPool;
}

export function getDrizzleDb() {
  const pool = getPgPool();
  if (!pool) return null;
  return drizzle(pool, { schema });
}

// ==============================================================================
// Graceful Local File Fallback (Used ONLY in local dev when DATABASE_URL is unset)
// ==============================================================================

interface LocalDevUserRecord extends AuthenticatedUser {
  passwordHash: string | null;
}

interface LocalDevSessionRecord {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAtIso: string;
}

interface LocalDevStore {
  users: LocalDevUserRecord[];
  sessions: LocalDevSessionRecord[];
  oauthLinks: Array<{ provider: string; providerAccountId: string; userId: string }>;
  itineraries: SavedUserItinerary[];
  accessLogsCount: number;
  behaviorEventsCount: number;
}

const LOCAL_STORE_PATH = path.join(process.cwd(), '.local-dev-store.json');

function readLocalStore(): LocalDevStore {
  try {
    if (fs.existsSync(LOCAL_STORE_PATH)) {
      return JSON.parse(fs.readFileSync(LOCAL_STORE_PATH, 'utf8')) as LocalDevStore;
    }
  } catch {
    // Ignore corrupted dev file
  }
  return {
    users: [],
    sessions: [],
    oauthLinks: [],
    itineraries: [],
    accessLogsCount: 0,
    behaviorEventsCount: 0
  };
}

function writeLocalStore(data: LocalDevStore): void {
  try {
    fs.writeFileSync(LOCAL_STORE_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch {
    // Read-only filesystem no-op
  }
}

function mapRowToUser(row: {
  id: string;
  email: string;
  display_name: string;
  role: string;
  preferred_locale: string;
  preferred_units: string;
  preferred_mode: string;
  bookmarked_ids: unknown;
  created_at: Date | string;
}): AuthenticatedUser {
  return {
    id: row.id,
    email: row.email,
    displayName: row.display_name,
    role: row.role === 'admin' ? 'admin' : 'user',
    preferredLocale: (row.preferred_locale || 'en') as SupportedLocale,
    preferredUnits: (row.preferred_units || 'nautical') as UnitSystem,
    preferredMode: (row.preferred_mode === '2d' ? '2d' : '3d') as MapViewMode,
    bookmarkedIds: Array.isArray(row.bookmarked_ids)
      ? (row.bookmarked_ids as string[])
      : [],
    createdAtIso:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at)
  };
}

function mapRowToItinerary(row: Record<string, unknown>): SavedUserItinerary {
  const advisoryRaw = row.advisory_json as Record<string, unknown> | null;
  const hasAdvisory = advisoryRaw && typeof advisoryRaw.evaluatedAtIso === 'string';
  return {
    id: String(row.id),
    userId: String(row.user_id),
    title: String(row.title),
    notes: String(row.notes || ''),
    shareSlug: String(row.share_slug),
    isPublic: Boolean(row.is_public),
    sourceType: (row.source_type || 'manual') as ItineraryImportSourceType,
    startDate: row.start_date ? String(row.start_date).slice(0, 10) : null,
    endDate: row.end_date ? String(row.end_date).slice(0, 10) : null,
    overallDifficulty: Math.max(
      1,
      Math.min(5, Number(row.overall_difficulty) || 2)
    ) as PolarHikingDifficultyTier,
    totalDistanceKm: Number(row.total_distance_km) || 0,
    waypoints: Array.isArray(row.waypoints_json)
      ? (row.waypoints_json as UserItineraryWaypoint[])
      : [],
    advisory: hasAdvisory ? (advisoryRaw as unknown as ItineraryEvaluationResult) : null,
    createdAtIso:
      row.created_at instanceof Date
        ? row.created_at.toISOString()
        : String(row.created_at),
    updatedAtIso:
      row.updated_at instanceof Date
        ? row.updated_at.toISOString()
        : String(row.updated_at)
  };
}

// ==============================================================================
// Unified Atlas Database Repository (PostgreSQL + PostGIS Primary)
// ==============================================================================

export const atlasDbRepository = {
  async findUserByEmail(
    email: string
  ): Promise<{ user: AuthenticatedUser; passwordHash: string | null } | null> {
    const normalized = email.trim().toLowerCase();
    const pool = getPgPool();
    if (pool) {
      const { rows } = await pool.query(
        'SELECT * FROM users WHERE email = $1 LIMIT 1',
        [normalized]
      );
      if (rows.length === 0) return null;
      return {
        user: mapRowToUser(rows[0]),
        passwordHash: rows[0].password_hash ?? null
      };
    }

    const store = readLocalStore();
    const hit = store.users.find((u) => u.email === normalized);
    if (!hit) return null;
    const { passwordHash, ...user } = hit;
    return { user, passwordHash };
  },

  async createUser(params: {
    email: string;
    displayName: string;
    passwordHash: string | null;
    preferredLocale?: SupportedLocale;
    preferredUnits?: UnitSystem;
    preferredMode?: MapViewMode;
  }): Promise<AuthenticatedUser> {
    const normalizedEmail = params.email.trim().toLowerCase();
    const pool = getPgPool();
    if (pool) {
      const { rows } = await pool.query(
        `INSERT INTO users (email, display_name, password_hash, preferred_locale, preferred_units, preferred_mode)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [
          normalizedEmail,
          params.displayName.trim(),
          params.passwordHash,
          params.preferredLocale ?? 'en',
          params.preferredUnits ?? 'nautical',
          params.preferredMode ?? '3d'
        ]
      );
      return mapRowToUser(rows[0]);
    }

    const store = readLocalStore();
    if (store.users.some((u) => u.email === normalizedEmail)) {
      throw new Error('EMAIL_ALREADY_EXISTS');
    }
    const created: LocalDevUserRecord = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      displayName: params.displayName.trim(),
      passwordHash: params.passwordHash,
      role: store.users.length === 0 ? 'admin' : 'user',
      preferredLocale: params.preferredLocale ?? 'en',
      preferredUnits: params.preferredUnits ?? 'nautical',
      preferredMode: params.preferredMode ?? '3d',
      bookmarkedIds: [],
      createdAtIso: new Date().toISOString()
    };
    store.users.push(created);
    writeLocalStore(store);
    const { passwordHash: _unused, ...user } = created;
    void _unused;
    return user;
  },

  async upsertOAuthUser(params: {
    provider: 'github' | 'google';
    providerAccountId: string;
    email: string;
    displayName: string;
    locale?: SupportedLocale;
  }): Promise<AuthenticatedUser> {
    const pool = getPgPool();
    const normalizedEmail = params.email.trim().toLowerCase();

    if (pool) {
      const existingOauth = await pool.query(
        `SELECT u.* FROM oauth_accounts oa
         JOIN users u ON u.id = oa.user_id
         WHERE oa.provider = $1 AND oa.provider_account_id = $2
         LIMIT 1`,
        [params.provider, params.providerAccountId]
      );
      if (existingOauth.rows.length > 0) {
        return mapRowToUser(existingOauth.rows[0]);
      }

      let userRow = (
        await pool.query('SELECT * FROM users WHERE email = $1 LIMIT 1', [
          normalizedEmail
        ])
      ).rows[0];

      if (!userRow) {
        userRow = (
          await pool.query(
            `INSERT INTO users (email, display_name, preferred_locale)
             VALUES ($1, $2, $3)
             RETURNING *`,
            [normalizedEmail, params.displayName.trim(), params.locale ?? 'en']
          )
        ).rows[0];
      }

      await pool.query(
        `INSERT INTO oauth_accounts (user_id, provider, provider_account_id)
         VALUES ($1, $2, $3)
         ON CONFLICT (provider, provider_account_id) DO NOTHING`,
        [userRow.id, params.provider, params.providerAccountId]
      );
      return mapRowToUser(userRow);
    }

    const store = readLocalStore();
    const linked = store.oauthLinks.find(
      (l) =>
        l.provider === params.provider &&
        l.providerAccountId === params.providerAccountId
    );
    if (linked) {
      const found = store.users.find((u) => u.id === linked.userId);
      if (found) {
        const { passwordHash: _p, ...u } = found;
        void _p;
        return u;
      }
    }

    let userRec = store.users.find((u) => u.email === normalizedEmail);
    if (!userRec) {
      userRec = {
        id: crypto.randomUUID(),
        email: normalizedEmail,
        displayName: params.displayName.trim(),
        passwordHash: null,
        role: 'user',
        preferredLocale: params.locale ?? 'en',
        preferredUnits: 'nautical',
        preferredMode: '3d',
        bookmarkedIds: [],
        createdAtIso: new Date().toISOString()
      };
      store.users.push(userRec);
    }
    store.oauthLinks.push({
      provider: params.provider,
      providerAccountId: params.providerAccountId,
      userId: userRec.id
    });
    writeLocalStore(store);
    const { passwordHash: _unused, ...cleanUser } = userRec;
    void _unused;
    return cleanUser;
  },

  async createSession(params: {
    userId: string;
    tokenHash: string;
    ipSubnet: string | null;
    userAgent: string | null;
    expiresAt: Date;
  }): Promise<void> {
    const pool = getPgPool();
    if (pool) {
      await pool.query(
        `INSERT INTO auth_sessions (user_id, token_hash, ip_subnet, user_agent, expires_at)
         VALUES ($1, $2, $3::inet, $4, $5)`,
        [
          params.userId,
          params.tokenHash,
          params.ipSubnet,
          params.userAgent?.slice(0, 300) ?? null,
          params.expiresAt.toISOString()
        ]
      );
      return;
    }

    const store = readLocalStore();
    store.sessions = store.sessions.filter(
      (s) => new Date(s.expiresAtIso).getTime() > Date.now()
    );
    store.sessions.push({
      id: crypto.randomUUID(),
      userId: params.userId,
      tokenHash: params.tokenHash,
      expiresAtIso: params.expiresAt.toISOString()
    });
    writeLocalStore(store);
  },

  async findUserBySessionTokenHash(
    tokenHash: string
  ): Promise<AuthenticatedUser | null> {
    const pool = getPgPool();
    if (pool) {
      const { rows } = await pool.query(
        `SELECT u.* FROM auth_sessions s
         JOIN users u ON u.id = s.user_id
         WHERE s.token_hash = $1 AND s.expires_at > NOW()
         LIMIT 1`,
        [tokenHash]
      );
      return rows.length > 0 ? mapRowToUser(rows[0]) : null;
    }

    const store = readLocalStore();
    const sess = store.sessions.find(
      (s) =>
        s.tokenHash === tokenHash && new Date(s.expiresAtIso).getTime() > Date.now()
    );
    if (!sess) return null;
    const hit = store.users.find((u) => u.id === sess.userId);
    if (!hit) return null;
    const { passwordHash: _p, ...user } = hit;
    void _p;
    return user;
  },

  async deleteSessionByTokenHash(tokenHash: string): Promise<void> {
    const pool = getPgPool();
    if (pool) {
      await pool.query('DELETE FROM auth_sessions WHERE token_hash = $1', [tokenHash]);
      return;
    }
    const store = readLocalStore();
    store.sessions = store.sessions.filter((s) => s.tokenHash !== tokenHash);
    writeLocalStore(store);
  },

  async updateUserPreferences(
    userId: string,
    patch: {
      displayName?: string;
      preferredLocale?: SupportedLocale;
      preferredUnits?: UnitSystem;
      preferredMode?: MapViewMode;
      bookmarkedIds?: string[];
    }
  ): Promise<AuthenticatedUser | null> {
    const pool = getPgPool();
    if (pool) {
      const { rows } = await pool.query(
        `UPDATE users SET
          display_name = COALESCE($2, display_name),
          preferred_locale = COALESCE($3, preferred_locale),
          preferred_units = COALESCE($4, preferred_units),
          preferred_mode = COALESCE($5, preferred_mode),
          bookmarked_ids = COALESCE($6::jsonb, bookmarked_ids),
          updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [
          userId,
          patch.displayName?.trim() || null,
          patch.preferredLocale || null,
          patch.preferredUnits || null,
          patch.preferredMode || null,
          patch.bookmarkedIds ? JSON.stringify(patch.bookmarkedIds) : null
        ]
      );
      return rows.length > 0 ? mapRowToUser(rows[0]) : null;
    }

    const store = readLocalStore();
    const rec = store.users.find((u) => u.id === userId);
    if (!rec) return null;
    if (patch.displayName) rec.displayName = patch.displayName.trim();
    if (patch.preferredLocale) rec.preferredLocale = patch.preferredLocale;
    if (patch.preferredUnits) rec.preferredUnits = patch.preferredUnits;
    if (patch.preferredMode) rec.preferredMode = patch.preferredMode;
    if (patch.bookmarkedIds) rec.bookmarkedIds = patch.bookmarkedIds;
    writeLocalStore(store);
    const { passwordHash: _p, ...clean } = rec;
    void _p;
    return clean;
  },

  /**
   * GDPR Right-to-Erasure: Deletes user account, active sessions, OAuth bindings,
   * and all saved itineraries in a single cascading operation.
   */
  async deleteUserAccountCompletely(userId: string): Promise<void> {
    const pool = getPgPool();
    if (pool) {
      await pool.query('DELETE FROM users WHERE id = $1', [userId]);
      return;
    }
    const store = readLocalStore();
    store.users = store.users.filter((u) => u.id !== userId);
    store.sessions = store.sessions.filter((s) => s.userId !== userId);
    store.oauthLinks = store.oauthLinks.filter((o) => o.userId !== userId);
    store.itineraries = store.itineraries.filter((it) => it.userId !== userId);
    writeLocalStore(store);
  },

  /**
   * Saves a custom expedition itinerary along with PostGIS LineString geometries
   * in both SRID 4326 (WGS84) and SRID 3031 (Antarctic Polar Stereographic).
   */
  async saveItinerary(params: {
    id?: string;
    userId: string;
    title: string;
    notes: string;
    isPublic: boolean;
    sourceType: ItineraryImportSourceType;
    startDate: string | null;
    endDate: string | null;
    waypoints: UserItineraryWaypoint[];
    advisory: ItineraryEvaluationResult | null;
  }): Promise<SavedUserItinerary> {
    const overallDifficulty = params.advisory?.overallDifficultyTier ?? 2;
    const totalDistanceKm = params.advisory?.totalDistanceKm ?? 0;
    const shareSlug =
      crypto.randomBytes(6).toString('base64url').toLowerCase().slice(0, 8) +
      '-' +
      Date.now().toString(36).slice(-4);

    // Build WKT LineString for PostGIS if >= 2 waypoints
    const wkt4326 =
      params.waypoints.length >= 2
        ? `LINESTRING(${params.waypoints
            .map((w) => `${Number(w.lon).toFixed(5)} ${Number(w.lat).toFixed(5)}`)
            .join(', ')})`
        : null;

    const pool = getPgPool();
    if (pool) {
      if (params.id) {
        const { rows } = await pool.query(
          `UPDATE user_itineraries SET
            title = $3,
            notes = $4,
            is_public = $5,
            source_type = $6,
            start_date = $7,
            end_date = $8,
            overall_difficulty = $9,
            total_distance_km = $10,
            waypoints_json = $11::jsonb,
            advisory_json = $12::jsonb,
            route_geom_4326 = CASE WHEN $13::text IS NOT NULL THEN ST_GeomFromText($13, 4326) ELSE NULL END,
            route_geom_3031 = CASE WHEN $13::text IS NOT NULL THEN ST_Transform(ST_GeomFromText($13, 4326), 3031) ELSE NULL END,
            updated_at = NOW()
           WHERE id = $1 AND user_id = $2
           RETURNING *`,
          [
            params.id,
            params.userId,
            params.title.trim(),
            params.notes,
            params.isPublic,
            params.sourceType,
            params.startDate || null,
            params.endDate || null,
            overallDifficulty,
            totalDistanceKm,
            JSON.stringify(params.waypoints),
            JSON.stringify(params.advisory ?? {}),
            wkt4326
          ]
        );
        if (rows.length > 0) return mapRowToItinerary(rows[0]);
      }

      const { rows } = await pool.query(
        `INSERT INTO user_itineraries
          (user_id, title, notes, share_slug, is_public, source_type, start_date, end_date,
           overall_difficulty, total_distance_km, waypoints_json, advisory_json,
           route_geom_4326, route_geom_3031)
         VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11::jsonb, $12::jsonb,
          CASE WHEN $13::text IS NOT NULL THEN ST_GeomFromText($13, 4326) ELSE NULL END,
          CASE WHEN $13::text IS NOT NULL THEN ST_Transform(ST_GeomFromText($13, 4326), 3031) ELSE NULL END
         )
         RETURNING *`,
        [
          params.userId,
          params.title.trim(),
          params.notes,
          shareSlug,
          params.isPublic,
          params.sourceType,
          params.startDate || null,
          params.endDate || null,
          overallDifficulty,
          totalDistanceKm,
          JSON.stringify(params.waypoints),
          JSON.stringify(params.advisory ?? {}),
          wkt4326
        ]
      );
      return mapRowToItinerary(rows[0]);
    }

    const store = readLocalStore();
    const nowIso = new Date().toISOString();
    if (params.id) {
      const idx = store.itineraries.findIndex(
        (it) => it.id === params.id && it.userId === params.userId
      );
      if (idx >= 0) {
        store.itineraries[idx] = {
          ...store.itineraries[idx],
          title: params.title.trim(),
          notes: params.notes,
          isPublic: params.isPublic,
          sourceType: params.sourceType,
          startDate: params.startDate,
          endDate: params.endDate,
          overallDifficulty,
          totalDistanceKm,
          waypoints: params.waypoints,
          advisory: params.advisory,
          updatedAtIso: nowIso
        };
        writeLocalStore(store);
        return store.itineraries[idx];
      }
    }

    const created: SavedUserItinerary = {
      id: crypto.randomUUID(),
      userId: params.userId,
      title: params.title.trim(),
      notes: params.notes,
      shareSlug,
      isPublic: params.isPublic,
      sourceType: params.sourceType,
      startDate: params.startDate,
      endDate: params.endDate,
      overallDifficulty,
      totalDistanceKm,
      waypoints: params.waypoints,
      advisory: params.advisory,
      createdAtIso: nowIso,
      updatedAtIso: nowIso
    };
    store.itineraries.unshift(created);
    writeLocalStore(store);
    return created;
  },

  async listUserItineraries(userId: string): Promise<SavedUserItinerary[]> {
    const pool = getPgPool();
    if (pool) {
      const { rows } = await pool.query(
        'SELECT * FROM user_itineraries WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 50',
        [userId]
      );
      return rows.map(mapRowToItinerary);
    }
    const store = readLocalStore();
    return store.itineraries.filter((it) => it.userId === userId);
  },

  async getPublicItineraryBySlug(slug: string): Promise<SavedUserItinerary | null> {
    const pool = getPgPool();
    if (pool) {
      const { rows } = await pool.query(
        'SELECT * FROM user_itineraries WHERE share_slug = $1 AND is_public = TRUE LIMIT 1',
        [slug]
      );
      return rows.length > 0 ? mapRowToItinerary(rows[0]) : null;
    }
    const store = readLocalStore();
    return (
      store.itineraries.find((it) => it.shareSlug === slug && it.isPublic) ?? null
    );
  },

  async deleteUserItinerary(userId: string, itineraryId: string): Promise<boolean> {
    const pool = getPgPool();
    if (pool) {
      const res = await pool.query(
        'DELETE FROM user_itineraries WHERE id = $1 AND user_id = $2',
        [itineraryId, userId]
      );
      return (res.rowCount ?? 0) > 0;
    }
    const store = readLocalStore();
    const before = store.itineraries.length;
    store.itineraries = store.itineraries.filter(
      (it) => !(it.id === itineraryId && it.userId === userId)
    );
    writeLocalStore(store);
    return store.itineraries.length < before;
  },

  /**
   * Queries PostGIS `ST_DWithin` in SRID 3031 planar meters to discover nearby
   * research stations, geological outcrops, HSM monuments, and landing sites.
   * Falls back seamlessly to planar EPSG:3031 Euclidean math when Postgres is offline.
   */
  async findNearbyPolarAnchors(
    lat: number,
    lon: number,
    radiusKm = 180,
    limit = 3
  ): Promise<NearbySpatialAnchor[]> {
    const pool = getPgPool();
    if (pool) {
      try {
        const { rows } = await pool.query(
          `WITH query_pt AS (
             SELECT ST_Transform(ST_SetSRID(ST_MakePoint($2, $1), 4326), 3031) AS g3031
           )
           SELECT
             a.id,
             a.anchor_type,
             a.code,
             a.lat,
             a.lon,
             a.name_i18n,
             ROUND((ST_Distance(a.geom_3031, q.g3031) / 1000.0)::numeric, 1) AS dist_km
           FROM polar_spatial_anchors a, query_pt q
           WHERE ST_DWithin(a.geom_3031, q.g3031, $3)
           ORDER BY a.geom_3031 <-> q.g3031
           LIMIT $4`,
          [lat, lon, radiusKm * 1000, limit]
        );
        if (rows.length > 0) {
          return rows.map((r) => ({
            id: String(r.id),
            anchorType: r.anchor_type,
            code: r.code || undefined,
            distanceKm: Number(r.dist_km),
            lat: Number(r.lat),
            lon: Number(r.lon),
            name: r.name_i18n
          }));
        }
      } catch {
        // Fallback if seed hasn't run yet
      }
    }

    const qxy = wgs84ToEpsg3031(lat, lon);
    const candidates: NearbySpatialAnchor[] = [];

    const pushIfNear = (
      id: string,
      anchorType: NearbySpatialAnchor['anchorType'],
      aLat: number,
      aLon: number,
      name: NearbySpatialAnchor['name'],
      code?: string
    ) => {
      const axy = wgs84ToEpsg3031(aLat, aLon);
      const distKm = Math.round((Math.hypot(axy.x - qxy.x, axy.y - qxy.y) / 1000) * 10) / 10;
      if (distKm <= radiusKm) {
        candidates.push({ id, anchorType, code, distanceKm: distKm, lat: aLat, lon: aLon, name });
      }
    };

    for (const s of POLAR_STATIONS) {
      pushIfNear(`station:${s.id}`, 'station', s.lat, s.lon, s.name, s.code);
    }
    for (const g of POLAR_GEOLOGICAL_SITES) {
      pushIfNear(`geology:${g.id}`, 'geology', g.lat, g.lon, g.name);
    }
    for (const h of FEATURED_HISTORIC_MONUMENTS) {
      pushIfNear(`hsm:${h.id}`, 'hsm', h.lat, h.lon, h.title, h.hsmCode);
    }
    for (const l of POLAR_LANDING_HOTSPOTS) {
      pushIfNear(`landing:${l.id}`, 'landing', l.lat, l.lon, l.name);
    }

    return candidates.sort((a, b) => a.distanceKm - b.distanceKm).slice(0, limit);
  },

  async insertAccessLog(entry: {
    visitorHash: string;
    clientSubnet: string | null;
    httpMethod: string;
    routePath: string;
    queryTab: string | null;
    locale: string;
    countryCode: string | null;
    deviceType: string;
    browserFamily: string;
    osFamily: string;
    referrerHost: string | null;
    statusCode: number;
    userId?: string | null;
  }): Promise<void> {
    const pool = getPgPool();
    if (pool) {
      try {
        await pool.query(
          `INSERT INTO http_access_logs
            (visitor_hash, client_subnet, http_method, route_path, query_tab, locale,
             country_code, device_type, browser_family, os_family, referrer_host, status_code, user_id)
           VALUES ($1, $2::inet, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
          [
            entry.visitorHash,
            entry.clientSubnet,
            entry.httpMethod.slice(0, 12),
            entry.routePath.slice(0, 500),
            entry.queryTab?.slice(0, 32) ?? null,
            entry.locale.slice(0, 16),
            entry.countryCode?.slice(0, 8) ?? null,
            entry.deviceType.slice(0, 16),
            entry.browserFamily.slice(0, 32),
            entry.osFamily.slice(0, 32),
            entry.referrerHost?.slice(0, 250) ?? null,
            entry.statusCode,
            entry.userId ?? null
          ]
        );
      } catch {
        // Non-blocking telemetry safeguard
      }
      return;
    }

    const store = readLocalStore();
    store.accessLogsCount += 1;
    writeLocalStore(store);
  },

  async insertBehaviorEvents(
    events: TelemetryEventInput[],
    meta: { visitorHash: string; userId?: string | null }
  ): Promise<void> {
    if (events.length === 0) return;
    const pool = getPgPool();
    if (pool) {
      try {
        for (const ev of events.slice(0, 25)) {
          const hasCoords =
            typeof ev.lat === 'number' &&
            typeof ev.lon === 'number' &&
            Number.isFinite(ev.lat) &&
            Number.isFinite(ev.lon) &&
            ev.lat >= -90 &&
            ev.lat <= 90 &&
            ev.lon >= -180 &&
            ev.lon <= 180;

          await pool.query(
            `INSERT INTO user_behavior_events
              (session_key, visitor_hash, user_id, locale, event_category, event_name,
               active_tab, drilldown_level, target_type, target_id, dwell_ms, lat, lon,
               geom_4326, geom_3031, properties)
             VALUES (
              $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13,
              CASE WHEN $14::boolean THEN ST_SetSRID(ST_MakePoint($13, $12), 4326) ELSE NULL END,
              CASE WHEN $14::boolean AND $12 <= -50 THEN ST_Transform(ST_SetSRID(ST_MakePoint($13, $12), 4326), 3031) ELSE NULL END,
              $15::jsonb
             )`,
            [
              ev.sessionKey.slice(0, 64),
              meta.visitorHash,
              meta.userId ?? null,
              ev.locale.slice(0, 16),
              ev.eventCategory.slice(0, 32),
              ev.eventName.slice(0, 64),
              ev.activeTab ?? null,
              ev.drilldownLevel ?? null,
              ev.targetType?.slice(0, 32) ?? null,
              ev.targetId?.slice(0, 120) ?? null,
              typeof ev.dwellMs === 'number' ? Math.round(ev.dwellMs) : null,
              hasCoords ? ev.lat : null,
              hasCoords ? ev.lon : null,
              hasCoords,
              JSON.stringify(ev.properties ?? {})
            ]
          );
        }
      } catch {
        // Non-blocking telemetry safeguard
      }
      return;
    }

    const store = readLocalStore();
    store.behaviorEventsCount += events.length;
    writeLocalStore(store);
  }
};
