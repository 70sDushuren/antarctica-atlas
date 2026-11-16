# Architecture, Dual-Mode Spatial Canvas & Cryo-Glass UI Rules

## 1. Confirmed Baseline Architecture (Option A — Serverless Edge)
- **Framework**: Next.js 15 (App Router) + React 19 + TypeScript 5 (`strict: true`).
- **Zero-Database Constraint**: Do NOT introduce PostgreSQL, Redis, or persistent stateful servers in V1.0. Live meteorological, marine wave, and sea-ice feeds MUST be fetched and cached via Next.js Route Handlers (`src/app/api/weather/route.ts`, `src/app/api/marine/route.ts`, `src/app/api/sea-ice/route.ts`) with `Cache-Control: public, s-maxage=1800, stale-while-revalidate=3600` and deterministic local fallback snapshots so the app never breaks offline.
- **Static Polar Data Packs**: Pre-baked geographical boundaries, subglacial elevation grids, research stations, historic monuments, and expedition corridors MUST reside under `public/geo-data/` and `src/data/`, keeping the total static geo-data payload strictly `< 5 MB`.

## 2. Dual-Mode Spatial Canvas Specification
- **Seamless 3D ⇄ 2D Switch**:
  - **3D Mode**: Interactive Polar Globe ([CesiumJS](https://github.com/cesiumgs/cesium) or dynamic WebGL globe loaded via `next/dynamic` with `ssr: false`) rendering real-time solar terminator illumination, southern hemisphere gateway connectivity (Ushuaia / Punta Arenas to Antarctic Peninsula), and expedition tracks.
  - **2D Mode**: Native South Polar Stereographic scientific map in [EPSG:3031](https://spatialreference.org/ref/epsg/3031/) (`Leaflet` + `Proj4Leaflet`, `ssr: false`), streaming [NASA GIBS EPSG:3031 WMTS](https://nasa-gibs.github.io/gibs-api-docs/access-basics/) imagery and hosting interactive two-point ice-sheet/bedrock cross-section profiling.
- **Camera & Selection Sync**: Toggling between 3D Globe and 2D `EPSG:3031` MUST preserve active `centerLat`, `centerLon`, `zoomLevel`, active map overlays, selected station/monument ID, and selected expedition corridor.
- **Default Pinned Corridor**: On initial load of the Expedition Corridor module, default to Corridor #1: **`Ushuaia → Drake Passage → South Shetland Islands → Antarctic Peninsula → Weddell Sea (Paulet Island HSM-41 & Endurance Wreck HSM-93)`**.

## 3. Visual Aesthetic & Cryo-Glassmorphism HUD
- **Color Tokens**:
  - Abyssal Polar Night Background: `#07111F` / `#0B192C`
  - Glacial Cyan Primary Accent: `#38BDF8`
  - Aurora Emerald Nominal Indicator: `#10B981`
  - Katabatic / Volcanic Amber Alert: `#F59E0B`
  - Severe Storm / Extreme Cold Rose: `#F43F5E`
- **Glacial Light Theme**: Support clean toggle between `Cryo Dark` (default) and `Glacial Light` high-contrast daylight mode.
- **Scientific Precision**: Pair localized UI labels with standard international telemetry badges (`EPSG:3031`, `Wind Chill`, `SST`, `HSM`, `ECMWF`) for cross-disciplinary clarity.
