-- ==============================================================================
-- Antarctica Atlas V2.0 — PostgreSQL 17 + PostGIS 3.5 Schema & BI Views
-- Compatible with Docker `postgis/postgis` & Neon Serverless Postgres (`postgis`).
-- Direct-connect ready for Open-Source Metabase & Grafana Dashboards.
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Self-Hosted Authentication & User Accounts
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(120) NOT NULL,
  password_hash TEXT,
  role VARCHAR(24) NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  preferred_locale VARCHAR(16) NOT NULL DEFAULT 'en',
  preferred_units VARCHAR(16) NOT NULL DEFAULT 'nautical',
  preferred_mode VARCHAR(8) NOT NULL DEFAULT '3d',
  bookmarked_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS oauth_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider VARCHAR(32) NOT NULL,
  provider_account_id VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (provider, provider_account_id)
);

CREATE TABLE IF NOT EXISTS auth_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash VARCHAR(128) NOT NULL UNIQUE,
  ip_subnet INET,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_auth_sessions_user_id ON auth_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_auth_sessions_expires ON auth_sessions(expires_at);

-- 2. Polar Spatial Reference Anchors (Stations, Geology Outcrops, HSMs, Landing Sites)
-- Used for PostGIS ST_DWithin proximity recommendations along custom user routes.
CREATE TABLE IF NOT EXISTS polar_spatial_anchors (
  id VARCHAR(96) PRIMARY KEY,
  anchor_type VARCHAR(32) NOT NULL CHECK (anchor_type IN ('station', 'geology', 'hsm', 'landing')),
  code VARCHAR(32),
  region VARCHAR(48) NOT NULL,
  name_i18n JSONB NOT NULL,
  summary_i18n JSONB NOT NULL,
  elevation_m INTEGER NOT NULL DEFAULT 0,
  lat DOUBLE PRECISION NOT NULL,
  lon DOUBLE PRECISION NOT NULL,
  geom_4326 GEOMETRY(Point, 4326) NOT NULL,
  geom_3031 GEOMETRY(Point, 3031) NOT NULL,
  source_url TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_polar_anchors_geom_4326 ON polar_spatial_anchors USING GIST (geom_4326);
CREATE INDEX IF NOT EXISTS idx_polar_anchors_geom_3031 ON polar_spatial_anchors USING GIST (geom_3031);
CREATE INDEX IF NOT EXISTS idx_polar_anchors_type ON polar_spatial_anchors(anchor_type);

-- 3. User Custom Expedition & Hiking Itineraries (with PostGIS LineString Tracks)
CREATE TABLE IF NOT EXISTS user_itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(180) NOT NULL,
  notes TEXT NOT NULL DEFAULT '',
  share_slug VARCHAR(48) NOT NULL UNIQUE,
  is_public BOOLEAN NOT NULL DEFAULT FALSE,
  source_type VARCHAR(24) NOT NULL DEFAULT 'manual'
    CHECK (source_type IN ('gpx', 'geojson', 'kml', 'csv', 'text', 'preset', 'manual')),
  start_date DATE,
  end_date DATE,
  overall_difficulty SMALLINT NOT NULL DEFAULT 2 CHECK (overall_difficulty BETWEEN 1 AND 5),
  total_distance_km NUMERIC(10, 2) NOT NULL DEFAULT 0,
  waypoints_json JSONB NOT NULL DEFAULT '[]'::jsonb,
  advisory_json JSONB NOT NULL DEFAULT '{}'::jsonb,
  route_geom_4326 GEOMETRY(LineString, 4326),
  route_geom_3031 GEOMETRY(LineString, 3031),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_itineraries_user ON user_itineraries(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_itineraries_geom_3031 ON user_itineraries USING GIST (route_geom_3031);

-- 4. Privacy-Safe HTTP Access Logs (Edge & API Telemetry for Metabase / Grafana)
CREATE TABLE IF NOT EXISTS http_access_logs (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  visitor_hash VARCHAR(32) NOT NULL,
  client_subnet INET,
  http_method VARCHAR(12) NOT NULL DEFAULT 'GET',
  route_path VARCHAR(512) NOT NULL,
  query_tab VARCHAR(32),
  locale VARCHAR(16) NOT NULL DEFAULT 'en',
  country_code VARCHAR(8),
  device_type VARCHAR(16) NOT NULL DEFAULT 'desktop',
  browser_family VARCHAR(32),
  os_family VARCHAR(32),
  referrer_host VARCHAR(255),
  status_code SMALLINT NOT NULL DEFAULT 200,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_access_logs_time ON http_access_logs(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_locale_time ON http_access_logs(locale, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_access_logs_visitor ON http_access_logs(visitor_hash);

-- 5. Granular Product & Spatial Interaction Events (with PostGIS Polar Click Geometry)
CREATE TABLE IF NOT EXISTS user_behavior_events (
  id BIGSERIAL PRIMARY KEY,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  session_key VARCHAR(64) NOT NULL,
  visitor_hash VARCHAR(32) NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  locale VARCHAR(16) NOT NULL DEFAULT 'en',
  event_category VARCHAR(32) NOT NULL,
  event_name VARCHAR(64) NOT NULL,
  active_tab VARCHAR(32),
  drilldown_level SMALLINT CHECK (drilldown_level BETWEEN 1 AND 3),
  target_type VARCHAR(32),
  target_id VARCHAR(120),
  dwell_ms INTEGER,
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  geom_4326 GEOMETRY(Point, 4326),
  geom_3031 GEOMETRY(Point, 3031),
  properties JSONB NOT NULL DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_behavior_events_time ON user_behavior_events(occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_events_name_time ON user_behavior_events(event_name, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_behavior_events_geom_3031 ON user_behavior_events USING GIST (geom_3031);

-- ==============================================================================
-- Pre-Built Open-Source BI Analytics Views (Ready for Metabase / Grafana)
-- ==============================================================================

-- View 1: Daily Traffic, Unique Visitors (UV), Mobile Share & Authenticated Ratio by Locale
CREATE OR REPLACE VIEW v_bi_daily_traffic_by_locale AS
SELECT
  DATE_TRUNC('day', occurred_at) AS metric_day,
  locale,
  COUNT(*) AS page_views,
  COUNT(DISTINCT visitor_hash) AS unique_visitors,
  COUNT(DISTINCT user_id) FILTER (WHERE user_id IS NOT NULL) AS signed_in_users,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE device_type = 'mobile') / NULLIF(COUNT(*), 0),
    1
  ) AS mobile_share_pct,
  MODE() WITHIN GROUP (ORDER BY referrer_host) FILTER (WHERE referrer_host IS NOT NULL) AS top_referrer
FROM http_access_logs
GROUP BY 1, 2
ORDER BY 1 DESC, page_views DESC;

-- View 2: Thematic Tab Engagement & L1 -> L2 -> L3 Progressive Drill-Down Funnel
CREATE OR REPLACE VIEW v_bi_tab_and_drilldown_funnel AS
SELECT
  DATE_TRUNC('day', occurred_at) AS metric_day,
  COALESCE(active_tab, 'overview') AS workspace_tab,
  COUNT(*) FILTER (WHERE event_name = 'tab_switch') AS tab_activations,
  ROUND(AVG(dwell_ms) FILTER (WHERE dwell_ms IS NOT NULL AND dwell_ms > 0) / 1000.0, 1) AS avg_dwell_seconds,
  COUNT(*) FILTER (WHERE drilldown_level = 1) AS l1_macro_views,
  COUNT(*) FILTER (WHERE drilldown_level = 2) AS l2_sector_drills,
  COUNT(*) FILTER (WHERE drilldown_level = 3) AS l3_entity_sheet_opens,
  COUNT(DISTINCT visitor_hash) AS engaged_visitors
FROM user_behavior_events
GROUP BY 1, 2
ORDER BY 1 DESC, tab_activations DESC;

-- View 3: PostGIS 25km Polar Spatial Click & Inspection Heatmap (Grafana Geomap / Metabase Map Ready)
CREATE OR REPLACE VIEW v_bi_polar_spatial_hotspots AS
WITH snapped AS (
  SELECT
    ST_SnapToGrid(geom_3031, 25000, 25000) AS cell_3031,
    target_type,
    target_id,
    visitor_hash
  FROM user_behavior_events
  WHERE geom_3031 IS NOT NULL
)
SELECT
  ROUND(ST_Y(ST_Transform(cell_3031, 4326))::numeric, 4) AS center_lat,
  ROUND(ST_X(ST_Transform(cell_3031, 4326))::numeric, 4) AS center_lon,
  ROUND((ST_X(cell_3031) / 1000.0)::numeric, 1) AS epsg3031_x_km,
  ROUND((ST_Y(cell_3031) / 1000.0)::numeric, 1) AS epsg3031_y_km,
  MODE() WITHIN GROUP (ORDER BY target_type) AS dominant_entity_type,
  MODE() WITHIN GROUP (ORDER BY target_id) AS top_entity_id,
  COUNT(*) AS total_interactions,
  COUNT(DISTINCT visitor_hash) AS unique_explorers
FROM snapped
GROUP BY cell_3031
ORDER BY total_interactions DESC;

-- View 4: Custom Itinerary Import Channels, Difficulty Distribution & Save Conversion
CREATE OR REPLACE VIEW v_bi_itinerary_conversion AS
SELECT
  DATE_TRUNC('day', occurred_at) AS metric_day,
  COALESCE(properties->>'sourceType', 'unknown') AS import_channel,
  COUNT(*) FILTER (WHERE event_name = 'itinerary_import') AS imports_triggered,
  COUNT(*) FILTER (WHERE event_name = 'advisor_evaluate') AS evaluations_completed,
  COUNT(*) FILTER (WHERE event_name = 'itinerary_save') AS cloud_saves,
  COUNT(*) FILTER (WHERE event_name = 'itinerary_share') AS shares_created,
  ROUND(
    AVG((properties->>'overallDifficulty')::numeric)
      FILTER (WHERE properties ? 'overallDifficulty'),
    2
  ) AS avg_hiking_difficulty_tier
FROM user_behavior_events
WHERE event_category = 'planner'
GROUP BY 1, 2
ORDER BY 1 DESC, evaluations_completed DESC;
