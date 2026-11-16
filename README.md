# Antarctica Atlas · 南极洲全息数字地图集

> **关于南极洲的一切 :)**  
> **Holistic Live Weather, Subglacial Geology & Exploration Heritage Digital Atlas**

[![Antarctica Atlas CI & Polar QA](https://github.com/70sDushuren/antarctica-atlas/actions/workflows/ci.yml/badge.svg)](https://github.com/70sDushuren/antarctica-atlas/actions/workflows/ci.yml)

**Antarctica Atlas** is a spatial-first interactive polar digital atlas built on **Next.js 15 (Option A Serverless Edge Architecture)**, featuring seamless **3D Polar Globe ⇄ 2D Native `EPSG:3031` Antarctic Polar Stereographic** synchronization, edge-cached live meteorology & Drake Passage sea-state telemetry, **Bedmap3** subglacial bedrock cross-section profiling, and complete **6-locale internationalization (`next-intl`)**:
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

# 2. Run full verification suite (EPSG:3031 geo-data prep + 6-locale QA + typecheck + lint + unit tests + production build)
npm run verify

# 3. Start local development server (http://localhost:3000)
npm run dev
```

## Available Scripts / 工程脚本一览

| Command | Purpose |
| :--- | :--- |
| `npm run dev` | Launch local Next.js 15 development server at `http://localhost:3000` |
| `npm run prep:geodata` | Run Python `EPSG:3031` benchmark validation & generate `< 5 MB` static polar data packs in `public/geo-data/` |
| `npm run validate:i18n` | Enforce 100% 6-locale key parity, ICU placeholder safety, authentic `yue-Hant` Cantonese distinction, and `src/data/` catalog parity |
| `npm run typecheck` | Run strict TypeScript (`tsc --noEmit`) verification |
| `npm run lint` | Run ESLint (`next/core-web-vitals` + `next/typescript`) |
| `npm test` | Execute native TypeScript unit tests (`EPSG:3031` math, `±180°` Ross Sea geodesics, Bedmap3 transects, polar wind-chill & unit formatting) |
| `npm run build` | Validate 6-locale parity and build production serverless bundle |
| `npm run verify` | End-to-end local & CI quality gate combining all checks above |

---

## Confirmed Architecture & Directory Topology / 锁定架构与目录结构

```text
antarctica-atlas/
├── 01_Requirements_Analysis_and_Antigravity_Dev_Plan.md  # V1.1 Master Specification (Single Source of Truth)
├── .agent/
│   ├── rules/                         # Global architecture, 6-locale i18n & scientific attribution guardrails
│   └── skills/                        # Domain skills: polar-projection-epsg3031, polar-weather-aggregator, multilingual-polar-qa
├── .github/
│   ├── workflows/ci.yml               # Automated GitHub Actions CI & Polar QA gate
│   └── PULL_REQUEST_TEMPLATE.md       # Guardrail verification checklist
├── messages/                          # 6-locale UI dictionaries (en, zh-CN, zh-TW, yue-Hant, pt, es)
├── public/geo-data/                   # Pre-baked EPSG:3031 continental outline & Bedmap3 subglacial elevation grid (< 5 MB)
├── scripts/
│   ├── data-pipeline/                 # Offline Python EPSG:3031 & Bedmap3 pre-baking script
│   └── validate-i18n.mjs              # UI + domain catalog 6-locale parity & Cantonese QA validator
├── src/
│   ├── app/
│   │   ├── [locale]/                  # 6-locale App Router pages, hreflang SEO metadata, loading/error/404 boundaries
│   │   └── api/                       # Edge-cached /api/weather, /api/marine, /api/sea-ice & /api/health routes
│   ├── components/
│   │   ├── atlas-canvas/              # 3D Polar Globe <-> 2D EPSG:3031 dual-mode canvas module
│   │   ├── layout-hud/                # Cryo-Glass shell, stateful 6-locale switcher & unit/theme controls
│   │   ├── weather-hud/               # Station meteorology, Katabatic alerts, Drake Shake Index & sea-ice curves
│   │   ├── geology-lab/               # Bedmap3 ice-peel slider & 2-point subglacial cross-section profiler
│   │   ├── heritage-chronicle/        # 4-Act Heroic Age scrollytelling & ATCM HSM heritage explorer
│   │   └── expedition-briefing/       # Default pinned Ushuaia -> Drake -> Peninsula -> Weddell Sea briefing
│   ├── data/                          # Verified 6-locale catalogs (COMNAP stations, ATCM HSMs, expedition corridors)
│   ├── i18n/                          # next-intl routing & request configuration
│   ├── lib/                           # EPSG:3031 math, ±180° geodesics, Bedmap interpolation, URL state sync & Repository layer
│   └── types/                         # Strict TypeScript ambient declarations (Proj4Leaflet)
└── tests/                             # Automated Polar Math, Subglacial Transect & Localization unit tests
```

## Milestone Roadmap Status / 阶段里程碑进度

- [x] **Phase 0 — Scaffold, 6-Locale `next-intl`, Polar Geo-Data & CI Infrastructure**: Completed & connected to [`70sDushuren/antarctica-atlas`](https://github.com/70sDushuren/antarctica-atlas)
- [ ] **Phase 1 — Dual-Mode Polar Canvas (`3D Globe ⇄ 2D EPSG:3031`) & Live Weather/Marine HUD**
- [ ] **Phase 2 — Bedmap3 Ice-Peel Explorer & Interactive Subglacial Cross-Section Lab**
- [ ] **Phase 3 — 4-Act Exploration Heritage Scrollytelling, Default Corridor Briefing & Full 6-Locale QA**

---

## Authoritative Scientific Data Sources / 权威科学数据源溯源

- **Live Meteorology & Marine Waves**: [Open-Meteo Weather & ECMWF IFS API](https://open-meteo.com/en/docs/ecmwf-api), [Open-Meteo Marine API](https://open-meteo.com/en/docs/marine-weather-api), [UW-Madison AMRDC](https://amrdc.ssec.wisc.edu/)
- **Polar Satellite Imagery & Sea Ice**: [NASA Earthdata GIBS (`EPSG:3031`)](https://nasa-gibs.github.io/gibs-api-docs/access-basics/), [NSIDC Sea Ice Index v4](https://nsidc.org/data/g02135/versions/4), [EUMETSAT OSI SAF](https://osi-saf.eumetsat.int/sea-ice-index)
- **Subglacial Bedrock & Geology**: [British Antarctic Survey Bedmap3](https://www.bas.ac.uk/project/bedmap3/), [SCAR GeoMAP (GNS Science)](https://www.gns.cri.nz/data-and-resources/geomap-geological-mapping-of-antarctica/), [PGC REMA](https://www.pgc.umn.edu/data/rema/)
- **Stations, Toponymy & Heritage**: [COMNAP Antarctic Facilities](https://www.comnap.aq/antarctic-facilities-information), [SCAR Composite Gazetteer (CGA)](https://placenames.aq/), [Antarctic Treaty HSM Registry (45 CFR 670.29)](https://www.ecfr.gov/current/title-45/subtitle-B/chapter-VI/part-670/subpart-F/section-670.29), [IAATO Visitor Guidelines](https://iaato.org/visiting-antarctica/visitor-guidelines-library)
