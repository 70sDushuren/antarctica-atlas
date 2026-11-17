import {
  bigserial,
  boolean,
  customType,
  date,
  doublePrecision,
  inet,
  integer,
  jsonb,
  numeric,
  pgTable,
  smallint,
  text,
  timestamp,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';
import type {
  ItineraryEvaluationResult,
  LocalizedText,
  UserItineraryWaypoint
} from '@/lib/types';

/**
 * Custom PostGIS Geometry column type supporting both WGS84 (SRID 4326)
 * and Antarctic Polar Stereographic (SRID 3031).
 */
const postgisGeometry = (spec: string) =>
  customType<{ data: string }>({
    dataType() {
      return `geometry(${spec})`;
    }
  });

export const usersTable = pgTable('users', {
  id: uuid('id').defaultRandom().primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  displayName: varchar('display_name', { length: 120 }).notNull(),
  passwordHash: text('password_hash'),
  role: varchar('role', { length: 24 }).notNull().default('user'),
  preferredLocale: varchar('preferred_locale', { length: 16 }).notNull().default('en'),
  preferredUnits: varchar('preferred_units', { length: 16 })
    .notNull()
    .default('nautical'),
  preferredMode: varchar('preferred_mode', { length: 8 }).notNull().default('3d'),
  bookmarkedIds: jsonb('bookmarked_ids').$type<string[]>().notNull().default([]),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const oauthAccountsTable = pgTable('oauth_accounts', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  provider: varchar('provider', { length: 32 }).notNull(),
  providerAccountId: varchar('provider_account_id', { length: 255 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const authSessionsTable = pgTable('auth_sessions', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  tokenHash: varchar('token_hash', { length: 128 }).notNull().unique(),
  ipSubnet: inet('ip_subnet'),
  userAgent: text('user_agent'),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const polarSpatialAnchorsTable = pgTable('polar_spatial_anchors', {
  id: varchar('id', { length: 96 }).primaryKey(),
  anchorType: varchar('anchor_type', { length: 32 }).notNull(),
  code: varchar('code', { length: 32 }),
  region: varchar('region', { length: 48 }).notNull(),
  nameI18n: jsonb('name_i18n').$type<LocalizedText>().notNull(),
  summaryI18n: jsonb('summary_i18n').$type<LocalizedText>().notNull(),
  elevationM: integer('elevation_m').notNull().default(0),
  lat: doublePrecision('lat').notNull(),
  lon: doublePrecision('lon').notNull(),
  geom4326: postgisGeometry('Point, 4326')('geom_4326').notNull(),
  geom3031: postgisGeometry('Point, 3031')('geom_3031').notNull(),
  sourceUrl: text('source_url'),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const userItinerariesTable = pgTable('user_itineraries', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => usersTable.id, { onDelete: 'cascade' }),
  title: varchar('title', { length: 180 }).notNull(),
  notes: text('notes').notNull().default(''),
  shareSlug: varchar('share_slug', { length: 48 }).notNull().unique(),
  isPublic: boolean('is_public').notNull().default(false),
  sourceType: varchar('source_type', { length: 24 }).notNull().default('manual'),
  startDate: date('start_date'),
  endDate: date('end_date'),
  overallDifficulty: smallint('overall_difficulty').notNull().default(2),
  totalDistanceKm: numeric('total_distance_km', { precision: 10, scale: 2 })
    .notNull()
    .default('0'),
  waypointsJson: jsonb('waypoints_json')
    .$type<UserItineraryWaypoint[]>()
    .notNull()
    .default([]),
  advisoryJson: jsonb('advisory_json')
    .$type<ItineraryEvaluationResult | Record<string, never>>()
    .notNull()
    .default({}),
  routeGeom4326: postgisGeometry('LineString, 4326')('route_geom_4326'),
  routeGeom3031: postgisGeometry('LineString, 3031')('route_geom_3031'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull()
});

export const httpAccessLogsTable = pgTable('http_access_logs', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  visitorHash: varchar('visitor_hash', { length: 32 }).notNull(),
  clientSubnet: inet('client_subnet'),
  httpMethod: varchar('http_method', { length: 12 }).notNull().default('GET'),
  routePath: varchar('route_path', { length: 512 }).notNull(),
  queryTab: varchar('query_tab', { length: 32 }),
  locale: varchar('locale', { length: 16 }).notNull().default('en'),
  countryCode: varchar('country_code', { length: 8 }),
  deviceType: varchar('device_type', { length: 16 }).notNull().default('desktop'),
  browserFamily: varchar('browser_family', { length: 32 }),
  osFamily: varchar('os_family', { length: 32 }),
  referrerHost: varchar('referrer_host', { length: 255 }),
  statusCode: smallint('status_code').notNull().default(200),
  userId: uuid('user_id').references(() => usersTable.id, { onDelete: 'set null' })
});

export const userBehaviorEventsTable = pgTable('user_behavior_events', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).defaultNow().notNull(),
  sessionKey: varchar('session_key', { length: 64 }).notNull(),
  visitorHash: varchar('visitor_hash', { length: 32 }).notNull(),
  userId: uuid('user_id').references(() => usersTable.id, { onDelete: 'set null' }),
  locale: varchar('locale', { length: 16 }).notNull().default('en'),
  eventCategory: varchar('event_category', { length: 32 }).notNull(),
  eventName: varchar('event_name', { length: 64 }).notNull(),
  activeTab: varchar('active_tab', { length: 32 }),
  drilldownLevel: smallint('drilldown_level'),
  targetType: varchar('target_type', { length: 32 }),
  targetId: varchar('target_id', { length: 120 }),
  dwellMs: integer('dwell_ms'),
  lat: doublePrecision('lat'),
  lon: doublePrecision('lon'),
  geom4326: postgisGeometry('Point, 4326')('geom_4326'),
  geom3031: postgisGeometry('Point, 3031')('geom_3031'),
  properties: jsonb('properties')
    .$type<Record<string, string | number | boolean | null>>()
    .notNull()
    .default({})
});
