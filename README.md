# Antarctica Atlas · 南极洲全息数字地图集 (V2.0)

> **关于南极洲的一切 :)**  
> **Holistic Live Weather, Subglacial Geology, Exploration Heritage & Polar Hiking Digital Atlas**

[![Antarctica Atlas CI & Polar QA](https://github.com/70sDushuren/antarctica-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/70sDushuren/antarctica-atlas/actions/workflows/ci.yml)
[![Release: v2.0.0](https://img.shields.io/badge/Release-v2.0.0-f59e0b.svg)](https://github.com/70sDushuren/antarctica-atlas/releases/tag/v2.0.0)
[![License: MIT](https://img.shields.io/badge/Code_License-MIT-10b981.svg)](./LICENSE)
[![Data: CC BY 4.0](https://img.shields.io/badge/Scientific_Data-CC_BY_4.0-38bdf8.svg)](https://creativecommons.org/licenses/by/4.0/)

**Antarctica Atlas V2.0** is a spatial-first interactive polar digital atlas built on **Next.js 15 + Open-Source PostgreSQL/PostGIS**, featuring a sticky **65% Dual-Mode Spatial Stage (`3D Polar Globe ⇄ 2D Native EPSG:3031` + Collapsible Bottom Cross-Section Dock)** paired with a **35% 4-Tab Progressive Drill-Down Workbench (`L1 Sectors → L2 Regional Lists → L3 Holistic Point Sheet`)**, **Baseline-First Async SWR Telemetry & Blurred Resilient Polar Tiles**, **3-in-1 Custom Route & Polar Hiking Difficulty Advisor (`T1–T5` + Gear & Hacks)**, **Self-Hosted Scrypt/OAuth Accounts**, **PostGIS Behavioral Telemetry Views for Metabase/Grafana**, and complete **6-locale internationalization (`next-intl`)**:
- `en` — **English**
- `zh-CN` — **简体中文**
- `zh-TW` — **繁體中文**（標準書面語）
- `yue-Hant` — **繁體粵語**（地道粵文書面表達）
- `pt` — **Português**
- `es` — **Español**

---

## Quickstart / 本地快速启动

```bash
# 1. Install dependencies (Node.js >= 22.6 & Python 3.10+)
npm install

# 2. Run full verification suite (EPSG:3031 geo-data prep + 6-locale QA + typecheck + lint + 28 unit tests + production build)
npm run verify

# 3. Start local development server (works zero-config even before starting Docker PostGIS!)
npm run dev

# 4. (Optional) Start Open-Source PostgreSQL 17 + PostGIS 3.5 + PgBouncer Pooler & seed spatial anchors + BI views
npm run db:up
DATABASE_URL=postgresql://atlas:atlas_polar_dev_2026@localhost:6432/antarctica_atlas \
DIRECT_DATABASE_URL=postgresql://atlas:atlas_polar_dev_2026@localhost:5432/antarctica_atlas \
npm run db:migrate

# 5. (Optional) Launch local Open-Source Metabase (:3001) & Grafana (:3002) BI dashboards
npm run db:bi
```

## Available Scripts / 工程脚本一览

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Launch local Next.js 15 development server at `http://localhost:3000` |
| `npm run prep:geodata` | Run Python `EPSG:3031` benchmark validation & generate `< 5 MB` static polar data packs in `public/geo-data/` |
| `npm run validate:i18n` | Enforce 100% 6-locale key parity (`270` UI keys × 6 + `268` catalog entries) and authentic `yue-Hant` Cantonese distinction |
| `npm run typecheck` | Run strict TypeScript (`tsc --noEmit`) verification |
| `npm run lint` | Run ESLint (`next/core-web-vitals` + `next/typescript`) |
| `npm test` | Execute 28 native TypeScript tests (`EPSG:3031` math, 3-in-1 GPX/GeoJSON/CSV/Text route importers, `T1–T5` hiking advisor, SWR cache, blurred tile bounds & 3D rotation persistence) |
| `npm run db:up` | Start containerized `postgis/postgis:17-3.5-alpine` + `pgbouncer` transaction pooler (`docker-compose.yml`) |
| `npm run db:migrate` | Initialize PostGIS `SRID 4326/3031` tables, `GiST` spatial indexes, 4 BI SQL Views, and seed polar spatial anchors |
| `npm run db:bi` | Launch optional containerized `Metabase` (`:3001`) and `Grafana` (`:3002`) analytics stack |
| `npm run build` | Validate 6-locale parity and build production bundle (supports `NEXT_STANDALONE=true` via `Dockerfile`) |
| `npm run verify` | End-to-end local & CI quality gate combining all checks above |

---

## Architecture & Directory Topology / V2.0 架构与目录结构

```text
antarctica-atlas/
├── docker-compose.yml                 # Open-source PostgreSQL 17 + PostGIS 3.5 + PgBouncer + optional Metabase/Grafana
├── Dockerfile                         # Multi-stage standalone production container for VPS / Cloud hosting
├── drizzle.config.ts                  # Drizzle ORM PostgreSQL + PostGIS configuration
├── .agent/skills/                     # Domain skills: polar-projection-epsg3031, polar-weather-aggregator, multilingual-polar-qa
├── messages/                          # 6-locale UI dictionaries (270 keys × 6: en, zh-CN, zh-TW, yue-Hant, pt, es)
├── public/geo-data/                   # Pre-baked EPSG:3031 continental outline & Bedmap3 subglacial elevation grid (71.9 KB)
├── scripts/
│   ├── data-pipeline/                 # Offline Python EPSG:3031 & Bedmap3 pre-baking script
│   ├── db/                            # PostGIS DDL, 4 BI SQL Views & spatial anchor seeding script
│   └── validate-i18n.mjs              # UI + domain catalog 6-locale parity & Cantonese QA validator
├── src/
│   ├── app/
│   │   ├── [locale]/                  # 6-locale Atlas workspace, /legal disclaimer & /plan/[slug] shared itinerary pages
│   │   └── api/                       # SWR /weather, /marine, /sea-ice + /auth, /itineraries, /advisor/evaluate, /telemetry, /user/account
│   ├── components/
│   │   ├── atlas-canvas/              # 3D Polar Globe (60fps local camera) <-> 2D EPSG:3031 (blurred fallback WMTS tiles)
│   │   ├── layout-hud/                # 65%/35% split AtlasShell, CollapsibleBottomChartDock & stateful 6-locale switcher
│   │   ├── drilldown/                 # L1–L2 OverviewTabPanel & L3 Holistic EntityInspectorSheet
│   │   ├── itinerary-planner/         # 3-in-1 Custom Route & T1–T5 Hiking Advisor + dual-axis HikingProfileChart
│   │   ├── auth/                      # Self-hosted AccountAndPlansSheet (Email/Password, optional OAuth & GDPR erasure)
│   │   ├── legal/                     # 6-locale Polar Navigation & Hiking Liability Disclaimer banner
│   │   ├── weather-hud/               # Station meteorology, Katabatic alerts, Drake Shake Index & sea-ice curves
│   │   ├── geology-lab/               # Bedmap3 ice-peel slider & 2-point subglacial cross-section profiler
│   │   ├── heritage-chronicle/        # 4-Act Heroic Age scrollytelling & ATCM HSM heritage explorer
│   │   └── expedition-briefing/       # Official Ushuaia -> Drake -> Peninsula -> Weddell Sea corridor briefing
│   ├── data/                          # Verified 6-locale catalogs (stations, geology, HSMs, corridors & landing hotspots)
│   └── lib/                           # EPSG:3031 math, SWR cache, tile fallback, 3-in-1 importers, hiking advisor, PostGIS DB & privacy hashing
└── tests/                             # 28 unit & UI regression tests (projection, advisor, importers, SWR cache & 3D rotation)
```

## Milestone Roadmap Status / 版本里程碑记录

- [x] **V1.0 Baseline (Phases 0–3)**: Dual-mode `3D Globe ⇄ 2D EPSG:3031` spatial canvas, 18 COMNAP stations live telemetry, 5-tier Drake Shake Index, Bedmap3 subglacial cross-section lab, 4-Act Exploration Chronicle & 6-locale parity.
- [x] **V2.0 Upgrade**:
  - **Split-Viewport Thematic Workspace & L1–L3 Progressive Drill-Down**: Sticky 65% spatial stage + collapsible bottom profile chart dock + 35% 4-tab workbench (`Overview`, `Weather & Ice`, `Subglacial Lab`, `Routes & Hiking`) + L3 holistic point inspector sheet;
  - **Baseline-First Async SWR Telemetry & Blurred Tile Resilience**: Zero-wait frame-0 rendering from cached valid windows, single-flight non-blocking upstream refreshes, and Gaussian-blurred `EPSG:3031` tile placeholders that smoothly sharpen upon delivery;
  - **Open-Source PostgreSQL + PostGIS + Self-Hosted Auth & BI Views**: PgBouncer 100+ concurrency pooling, Scrypt + optional GitHub/Google OAuth accounts, GDPR self-erasure, privacy-safe `visitor_hash` access logs, PostGIS spatial click telemetry, and 4 pre-built SQL views for Metabase / Grafana;
  - **3-in-1 Custom Itinerary Import & `T1–T5` Polar Hiking Advisor**: GPX/GeoJSON/KML/CSV upload, map waypoint drawing, zero-key multilingual free-text schedule matching, terrain slope + wind-chill + katabatic + swell rating, gear checklist, Polar Travel Hacks, `.gpx` export, and public share links (`/[locale]/plan/[slug]`).

---

## Authoritative Scientific Data Sources / 权威科学数据源溯源

- **Live Meteorology & Marine Waves**: [Open-Meteo Weather & ECMWF IFS API](https://open-meteo.com/en/docs/ecmwf-api), [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api), [UW-Madison AMRDC](https://amrdc.ssec.wisc.edu/)
- **Polar Satellite Imagery & Sea Ice**: [NASA Earthdata GIBS (`EPSG:3031`)](https://nasa-gibs.github.io/gibs-api-docs/access-basics/), [NSIDC Sea Ice Index v4](https://nsidc.org/data/g02135/versions/4), [EUMETSAT OSI SAF](https://osi-saf.eumetsat.int/sea-ice-index)
- **Subglacial Bedrock & Geology**: [British Antarctic Survey Bedmap3](https://www.bas.ac.uk/project/bedmap3/), [SCAR GeoMAP (GNS Science)](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/), [PGC REMA](https://www.pgc.umn.edu/data/rema/)
- **Stations, Toponymy & Heritage**: [COMNAP Antarctic Facilities](https://www.comnap.aq/antarctic-facilities-information), [SCAR Composite Gazetteer (CGA)](https://placenames.aq/), [Antarctic Treaty HSM Registry (45 CFR 670.29)](https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/section-670.29), [IAATO Visitor Guidelines](https://iaato.org/visiting-antarctica/visitor-guidelines-library)

---

## License & Compliance / 开源许可与数据合规声明

- **Source Code (`MIT`)**: Original code, UI components, and 6-locale translations are licensed under the [MIT License](./LICENSE).
- **Scientific Datasets (`CC BY 4.0` & Open Data)**: Polar datasets (Open-Meteo/ECMWF, BAS Bedmap3, SCAR GeoMAP/ADD/CGA, COMNAP, EUMETSAT OSI SAF) are attributed and simplified/resampled for interactive web rendering under [Creative Commons Attribution 4.0 International (`CC BY 4.0`)](https://creativecommons.org/licenses/by/4.0/). Full academic citations, modification disclosures, and Open-Meteo non-commercial free-tier API terms are documented in [`NOTICE.md`](./NOTICE.md).
